const https = require('https');

function post(urlStr, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const payload = JSON.stringify(data);
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testLiveAPI() {
  console.log('--- TESTING LIVE RENDER API PRODUCTION ENDPOINTS ---');

  // Test 1: Existing Admin Login on /api/v1/auth/login
  const v1Login = await post('https://tiles-gallery-api-ywt8.onrender.com/api/v1/auth/login', {
    email: 'admin@gmail.com',
    password: 'admin@123',
  });
  console.log('1. Live /api/v1/auth/login (Admin):', v1Login.status, v1Login.data.success ? 'SUCCESS' : v1Login.data);

  // Test 2: Existing Admin Login on /api/auth/login
  const apiLogin = await post('https://tiles-gallery-api-ywt8.onrender.com/api/auth/login', {
    email: 'admin@gmail.com',
    password: 'admin@123',
  });
  console.log('2. Live /api/auth/login (Admin):', apiLogin.status, apiLogin.data.success ? 'SUCCESS' : apiLogin.data);

  // Test 3: Temporary Unique User Registration on /api/v1/auth/register
  const uniqueEmail = `live_test_${Date.now()}@example.com`;
  const v1Register = await post('https://tiles-gallery-api-ywt8.onrender.com/api/v1/auth/register', {
    name: 'Live Test User',
    email: uniqueEmail,
    password: 'password123',
  });
  console.log('3. Live /api/v1/auth/register (New User):', v1Register.status, v1Register.data.success ? 'SUCCESS' : v1Register.data);

  // Test 4: New User Login on /api/v1/auth/login
  const newLogin = await post('https://tiles-gallery-api-ywt8.onrender.com/api/v1/auth/login', {
    email: uniqueEmail,
    password: 'password123',
  });
  console.log('4. Live /api/v1/auth/login (New User):', newLogin.status, newLogin.data.success ? 'SUCCESS' : newLogin.data);

  // Test 5: Validation Error (Invalid Email)
  const invalidEmail = await post('https://tiles-gallery-api-ywt8.onrender.com/api/v1/auth/login', {
    email: 'invalid-email',
    password: '123',
  });
  console.log('5. Live Invalid Email (Expected 400 Validation Error):', invalidEmail.status, invalidEmail.data.message);
}

testLiveAPI().catch(console.error);
