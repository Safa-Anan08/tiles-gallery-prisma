const http = require('http');

const API_BASE = 'http://localhost:5000/api/v1';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runComplianceTestSuite() {
  console.log('--- STARTING FULL SCIC/EJP-13 COMPLIANCE TEST SUITE ---');

  // 1. Health
  const health = await request('GET', '/health');
  console.log('1. Health Check:', health.status, health.body.message);
  if (health.status !== 200) throw new Error('Health check failed');

  // 2. Auth Register
  const userEmail = `compliance_user_${Date.now()}@example.com`;
  const regRes = await request('POST', '/auth/register', {
    name: 'Compliance Tester',
    email: userEmail,
    password: 'Password123!',
  });
  console.log('2. User Register Status:', regRes.status, 'Email:', regRes.body.data?.user?.email);
  if (regRes.status !== 201) throw new Error('User register failed');
  const token = regRes.body.data.token;

  // 3. Categories (Get All)
  const catRes = await request('GET', '/categories');
  console.log('3. Get Categories Status:', catRes.status, 'Count:', catRes.body.data?.length);
  if (catRes.status !== 200 || !Array.isArray(catRes.body.data)) throw new Error('Get categories failed');

  // 4. Create Review
  const reviewRes = await request('POST', '/reviews', {
    rating: 5,
    comment: 'Exceptional tile design and texture quality!',
    tileId: 'tile_001',
  }, token);
  console.log('4. Create Review Status:', reviewRes.status, 'Review ID:', reviewRes.body.data?.id);
  if (reviewRes.status !== 201) throw new Error('Create review failed: ' + JSON.stringify(reviewRes.body));
  const reviewId = reviewRes.body.data.id;

  // 5. Get Reviews by Tile
  const getReviewsRes = await request('GET', '/reviews?tileId=tile_001');
  console.log('5. Get Reviews by Tile Status:', getReviewsRes.status, 'Count:', getReviewsRes.body.data?.length);
  if (getReviewsRes.status !== 200 || getReviewsRes.body.data?.length < 1) throw new Error('Get reviews failed');

  // 6. Update Review
  const updateReviewRes = await request('PUT', `/reviews/${reviewId}`, {
    rating: 4,
    comment: 'Updated review: Very good quality!',
  }, token);
  console.log('6. Update Review Status:', updateReviewRes.status, 'Updated Rating:', updateReviewRes.body.data?.rating);
  if (updateReviewRes.status !== 200) throw new Error('Update review failed');

  // 7. Delete Review
  const delReviewRes = await request('DELETE', `/reviews/${reviewId}`, null, token);
  console.log('7. Delete Review Status:', delReviewRes.status, delReviewRes.body.message);
  if (delReviewRes.status !== 200) throw new Error('Delete review failed');

  // 8. Contact Us
  const contactRes = await request('POST', '/contact-us', {
    name: 'Compliance Tester',
    email: userEmail,
    message: 'Testing full SCIC API compliance.',
  });
  console.log('8. Contact Us Status:', contactRes.status, contactRes.body.message);
  if (contactRes.status !== 200) throw new Error('Contact us failed');

  console.log('--- ALL FULL COMPLIANCE API TESTS PASSED 100% ---');
}

runComplianceTestSuite().catch((err) => {
  console.error('COMPLIANCE TEST SUITE FAILED:', err);
  process.exit(1);
});
