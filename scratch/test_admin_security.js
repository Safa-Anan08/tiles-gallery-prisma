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

async function runAdminSecuritySuite() {
  console.log('--- STARTING ADMIN SECURITY & AUTHORIZATION SUITE ---');

  // 1. Admin Login
  const adminLogin = await request('POST', '/auth/login', {
    email: 'admin@gmail.com',
    password: 'admin@123',
  });
  console.log('1. Admin Login Status:', adminLogin.status, 'Role:', adminLogin.body.data?.user?.role);
  if (adminLogin.status !== 200 || adminLogin.body.data?.user?.role !== 'ADMIN') {
    throw new Error('Admin login failed or role is not ADMIN');
  }
  const adminToken = adminLogin.body.data.token;

  // 2. Admin fetches user list
  const usersRes = await request('GET', '/users', null, adminToken);
  console.log('2. Admin GET /users Status:', usersRes.status, 'Users Count:', usersRes.body.data?.length);
  if (usersRes.status !== 200 || !Array.isArray(usersRes.body.data)) {
    throw new Error('Admin fetch users failed');
  }

  // 3. Admin creates a tile
  const testTileId = `tile_admin_test_${Date.now()}`;
  const createTileRes = await request('POST', '/tiles', {
    id: testTileId,
    title: 'Admin Test Royal Tile',
    description: 'Exclusive admin test tile description',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    category: 'Marble',
    price: 99.99,
    dimensions: '24x24 inch',
    material: 'Marble',
  }, adminToken);
  console.log('3. Admin POST /tiles Status:', createTileRes.status, 'Tile ID:', createTileRes.body.data?.id);
  if (createTileRes.status !== 201) {
    throw new Error('Admin create tile failed: ' + JSON.stringify(createTileRes.body));
  }

  // 4. Admin updates tile
  const updateTileRes = await request('PUT', `/tiles/${testTileId}`, {
    title: 'Admin Test Royal Tile Updated',
    price: 109.99,
  }, adminToken);
  console.log('4. Admin PUT /tiles/:id Status:', updateTileRes.status, 'Updated Title:', updateTileRes.body.data?.title);
  if (updateTileRes.status !== 200) {
    throw new Error('Admin update tile failed');
  }

  // 5. Admin soft deletes tile
  const deleteTileRes = await request('DELETE', `/tiles/${testTileId}`, null, adminToken);
  console.log('5. Admin DELETE /tiles/:id Status:', deleteTileRes.status, deleteTileRes.body.message);
  if (deleteTileRes.status !== 200) {
    throw new Error('Admin soft delete tile failed');
  }

  // 6. Register normal user & login
  const normalEmail = `normal_user_${Date.now()}@example.com`;
  const normalReg = await request('POST', '/auth/register', {
    name: 'Normal User',
    email: normalEmail,
    password: 'Password123!',
  });
  console.log('6. Normal User Register Status:', normalReg.status, 'Role:', normalReg.body.data?.user?.role);
  if (normalReg.status !== 201 || normalReg.body.data?.user?.role !== 'USER') {
    throw new Error('Normal user registration failed');
  }
  const normalToken = normalReg.body.data.token;

  // 7. Normal user attempts GET /users -> EXPECTED 403 FORBIDDEN
  const normalUsersRes = await request('GET', '/users', null, normalToken);
  console.log('7. Normal User GET /users Status:', normalUsersRes.status, '(Expected: 403)');
  if (normalUsersRes.status !== 403) {
    throw new Error('Normal user GET /users should return 403 Forbidden!');
  }

  // 8. Normal user attempts POST /tiles -> EXPECTED 403 FORBIDDEN
  const normalCreateTileRes = await request('POST', '/tiles', {
    id: `tile_hacker_${Date.now()}`,
    title: 'Unauthorized Tile',
    description: 'Should fail',
    image: 'https://example.com/img.jpg',
    category: 'Ceramic',
    price: 10.0,
    dimensions: '12x12',
    material: 'Clay',
  }, normalToken);
  console.log('8. Normal User POST /tiles Status:', normalCreateTileRes.status, '(Expected: 403)');
  if (normalCreateTileRes.status !== 403) {
    throw new Error('Normal user POST /tiles should return 403 Forbidden!');
  }

  // 9. Unauthenticated call to GET /users -> EXPECTED 401 UNAUTHORIZED
  const unauthRes = await request('GET', '/users');
  console.log('9. Unauthenticated GET /users Status:', unauthRes.status, '(Expected: 401)');
  if (unauthRes.status !== 401) {
    throw new Error('Unauthenticated request should return 401 Unauthorized!');
  }

  console.log('--- ALL ADMIN SECURITY & AUTHORIZATION TESTS PASSED 100% ---');
}

runAdminSecuritySuite().catch((err) => {
  console.error('ADMIN SECURITY SUITE FAILED:', err);
  process.exit(1);
});
