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

async function runE2ESmokeTest() {
  console.log('--- STARTING E2E USER FLOW SMOKE TEST ---');

  // 1. Health Check
  const health = await request('GET', '/health');
  console.log('1. Health Check Status:', health.status, health.body.message);
  if (health.status !== 200) throw new Error('Health check failed');

  // 2. Register User
  const uniqueEmail = `smoke_e2e_${Date.now()}@example.com`;
  const regRes = await request('POST', '/auth/register', {
    name: 'Smoke Test User',
    email: uniqueEmail,
    password: 'Password123!',
  });
  console.log('2. Register Status:', regRes.status, 'User Email:', regRes.body.data?.user?.email);
  if (regRes.status !== 201) throw new Error('Registration failed: ' + JSON.stringify(regRes.body));
  const token = regRes.body.data.token;

  // Verify password / passwordHash is NEVER exposed in registration payload
  if (regRes.body.data.user.password || regRes.body.data.user.passwordHash) {
    throw new Error('SECURITY VIOLATION: Password hash exposed in registration payload!');
  }
  console.log('   Security Check: Password hash is NOT exposed in response payload ✅');

  // 3. Login
  const loginRes = await request('POST', '/auth/login', {
    email: uniqueEmail,
    password: 'Password123!',
  });
  console.log('3. Login Status:', loginRes.status, 'Login Success:', loginRes.body.success);
  if (loginRes.status !== 200) throw new Error('Login failed');

  // 4. Fetch /auth/me
  const meRes = await request('GET', '/auth/me', null, token);
  const userObj = meRes.body.data?.user || meRes.body.data;
  console.log('4. Profile /me Status:', meRes.status, 'User Name:', userObj?.name);
  if (meRes.status !== 200) throw new Error('/me request failed');

  // 5. Fetch Tiles
  const tilesRes = await request('GET', '/tiles');
  console.log('5. Tiles Catalog Status:', tilesRes.status, 'Tile Count:', tilesRes.body.data?.length);
  if (tilesRes.status !== 200 || !Array.isArray(tilesRes.body.data)) throw new Error('Tiles fetch failed');

  // 6. Fetch Single Tile
  const tileDetailRes = await request('GET', '/tiles/tile_001');
  console.log('6. Tile Details Status:', tileDetailRes.status, 'Tile Title:', tileDetailRes.body.data?.title);
  if (tileDetailRes.status !== 200 || !tileDetailRes.body.data) throw new Error('Tile detail fetch failed');

  // 7. Add to Wishlist
  const addWishlistRes = await request('POST', '/wishlist', { tileId: 'tile_001' }, token);
  console.log('7. Add Wishlist Status:', addWishlistRes.status, addWishlistRes.body.message);
  if (addWishlistRes.status !== 200) throw new Error('Add wishlist failed');

  // 8. Fetch User Wishlist
  const getWishlistRes = await request('GET', '/wishlist', null, token);
  console.log('8. Fetch Wishlist Status:', getWishlistRes.status, 'Items Count:', getWishlistRes.body.data?.length);
  if (getWishlistRes.status !== 200 || getWishlistRes.body.data?.length !== 1) throw new Error('Fetch wishlist failed');

  // 9. Remove from Wishlist
  const delWishlistRes = await request('DELETE', '/wishlist', { tileId: 'tile_001' }, token);
  console.log('9. Delete Wishlist Status:', delWishlistRes.status, delWishlistRes.body.message);
  if (delWishlistRes.status !== 200) throw new Error('Delete wishlist failed: ' + JSON.stringify(delWishlistRes.body));

  // 10. Add to Cart
  const addCartRes = await request('POST', '/cart', { tileId: 'tile_001' }, token);
  console.log('10. Add Cart Status:', addCartRes.status, addCartRes.body.message);
  if (addCartRes.status !== 200) throw new Error('Add cart failed');

  // 11. Fetch User Cart
  const getCartRes = await request('GET', '/cart', null, token);
  console.log('11. Fetch Cart Status:', getCartRes.status, 'Items Count:', getCartRes.body.data?.length);
  if (getCartRes.status !== 200 || getCartRes.body.data?.length !== 1) throw new Error('Fetch cart failed');

  // 12. Delete from Cart
  const delCartRes = await request('DELETE', '/cart', { tileId: 'tile_001' }, token);
  console.log('12. Delete Cart Status:', delCartRes.status, delCartRes.body.message);
  if (delCartRes.status !== 200) throw new Error('Delete cart failed: ' + JSON.stringify(delCartRes.body));

  // 13. Update Profile
  const updateProfileRes = await request('PUT', '/user/update', { name: 'Smoke Test User Updated', image: 'https://example.com/avatar.jpg' }, token);
  console.log('13. Update Profile Status:', updateProfileRes.status, updateProfileRes.body.message);
  if (updateProfileRes.status !== 200) throw new Error('Update profile failed');

  // 14. Re-fetch /auth/me to verify profile update
  const meUpdatedRes = await request('GET', '/auth/me', null, token);
  const userObjUpdated = meUpdatedRes.body.data?.user || meUpdatedRes.body.data;
  console.log('14. Re-fetch /me Updated Name:', userObjUpdated?.name);
  if (userObjUpdated?.name !== 'Smoke Test User Updated') throw new Error('Profile update verification failed');

  // 15. Submit Contact Us Message
  const contactRes = await request('POST', '/contact-us', { name: 'Smoke Tester', email: uniqueEmail, message: 'Test message' });
  console.log('15. Contact Us Submission Status:', contactRes.status, contactRes.body.message);
  if (contactRes.status !== 200) throw new Error('Contact submission failed');

  // 16. JWT Security Check: Unauthenticated request to /cart must return HTTP 401
  const unauthCartRes = await request('GET', '/cart');
  console.log('16. Unauthenticated /cart Status:', unauthCartRes.status, '(Expected: 401)');
  if (unauthCartRes.status !== 401) throw new Error('SECURITY VIOLATION: /cart did not enforce HTTP 401 Unauthorized!');

  console.log('--- ALL E2E USER FLOW SMOKE TESTS PASSED 100% ---');
}

runE2ESmokeTest().catch((err) => {
  console.error('E2E TEST FAILED:', err);
  process.exit(1);
});
