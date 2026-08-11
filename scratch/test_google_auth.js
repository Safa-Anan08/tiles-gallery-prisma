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

async function runGoogleAuthTestSuite() {
  console.log('--- STARTING GOOGLE AUTHENTICATION TEST SUITE ---');

  // 1. Google Auth with Missing Parameters (Expect 400)
  const badReq = await request('POST', '/auth/google', {});
  console.log('1. Empty Payload Status:', badReq.status, '(Expected: 400)');
  if (badReq.status !== 400) {
    throw new Error('Empty payload should return 400 Bad Request');
  }

  // 2. Google Login for New User
  const timestamp = Date.now();
  const googleEmail = `google_user_${timestamp}@example.com`;
  const googleSub = `google_sub_id_${timestamp}`;
  const mockToken = `mock_google_token_${googleEmail}___${googleSub}`;


  const newGoogleUserRes = await request('POST', '/auth/google', {
    idToken: mockToken,
  });

  console.log('2. New Google User Login Status:', newGoogleUserRes.status, 'Email:', newGoogleUserRes.body.data?.user?.email);
  if (newGoogleUserRes.status !== 200 || !newGoogleUserRes.body.data?.token) {
    throw new Error('New Google user login failed: ' + JSON.stringify(newGoogleUserRes.body));
  }

  const newGoogleToken = newGoogleUserRes.body.data.token;
  const newGoogleUser = newGoogleUserRes.body.data.user;

  if (newGoogleUser.role !== 'USER') {
    throw new Error('New Google user must have role USER');
  }
  if (newGoogleUser.password || newGoogleUser.passwordHash) {
    throw new Error('SECURITY VIOLATION: Password hash returned in Google auth payload!');
  }
  console.log('   Security Check: Password hash is NOT exposed ✅');

  // 3. Fetch /auth/me with New Google User Token
  const meRes = await request('GET', '/auth/me', null, newGoogleToken);
  console.log('3. Google User GET /auth/me Status:', meRes.status, 'User Email:', meRes.body.data?.email);
  if (meRes.status !== 200 || meRes.body.data?.email !== googleEmail) {
    throw new Error('Google user /auth/me failed');
  }

  // 4. Cart & Wishlist Access with Google User Token
  const cartRes = await request('GET', '/cart', null, newGoogleToken);
  console.log('4. Google User GET /cart Status:', cartRes.status);
  if (cartRes.status !== 200) {
    throw new Error('Google user GET /cart failed');
  }

  const wishlistRes = await request('GET', '/wishlist', null, newGoogleToken);
  console.log('5. Google User GET /wishlist Status:', wishlistRes.status);
  if (wishlistRes.status !== 200) {
    throw new Error('Google user GET /wishlist failed');
  }

  // 6. Normal Google User Accessing Admin Endpoint -> EXPECT 403
  const userAdminRes = await request('GET', '/users', null, newGoogleToken);
  console.log('6. Normal Google User GET /users Status:', userAdminRes.status, '(Expected: 403)');
  if (userAdminRes.status !== 403) {
    throw new Error('Normal Google user accessing admin endpoint must return 403 Forbidden!');
  }

  // 7. Google Login for Existing ADMIN Account (admin@gmail.com)
  const adminGoogleSub = `google_sub_admin_12345`;
  const adminMockToken = `mock_google_token_admin@gmail.com___${adminGoogleSub}`;


  const adminGoogleRes = await request('POST', '/auth/google', {
    credential: adminMockToken,
  });

  console.log('7. Admin Google Login Status:', adminGoogleRes.status, 'Role:', adminGoogleRes.body.data?.user?.role);
  if (adminGoogleRes.status !== 200 || adminGoogleRes.body.data?.user?.role !== 'ADMIN') {
    throw new Error('SECURITY VIOLATION: ADMIN role was altered or login failed!');
  }
  console.log('   Security Check: admin@gmail.com preserved ADMIN role ✅');

  const adminGoogleToken = adminGoogleRes.body.data.token;

  // 8. Admin Google User Accessing Admin Endpoint -> EXPECT 200
  const adminAccessRes = await request('GET', '/users', null, adminGoogleToken);
  console.log('8. Admin Google User GET /users Status:', adminAccessRes.status);
  if (adminAccessRes.status !== 200) {
    throw new Error('Admin Google user must be allowed to access /users');
  }

  // 9. Unauthenticated Request -> EXPECT 401
  const unauthRes = await request('GET', '/auth/me');
  console.log('9. Unauthenticated GET /auth/me Status:', unauthRes.status, '(Expected: 401)');
  if (unauthRes.status !== 401) {
    throw new Error('Unauthenticated request must return 401 Unauthorized');
  }

  console.log('--- ALL GOOGLE AUTHENTICATION TESTS PASSED 100% ---');
}

runGoogleAuthTestSuite().catch((err) => {
  console.error('GOOGLE AUTH TEST SUITE FAILED:', err);
  process.exit(1);
});
