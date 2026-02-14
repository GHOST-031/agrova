const fetch = require('node-fetch');

async function testLogin() {
  try {
    // Login
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vermakrishansh@gmail.com',
        password: 'consumer123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login Status:', loginResponse.status);
    console.log('📦 Login Response:', JSON.stringify(loginData, null, 2).substring(0, 500));
    
    if (!loginData.token) {
      console.log('❌ No token received!');
      return;
    }
    
    const token = loginData.token;
    console.log('\n🔑 Token (first 50 chars):', token.substring(0, 50) + '...');
    
    // Test protected route - cart
    console.log('\n🛒 Testing /api/cart...');
    const cartResponse = await fetch('http://localhost:5001/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Cart Response Status:', cartResponse.status);
    const cartData = await cartResponse.json();
    console.log('Cart Response:', JSON.stringify(cartData, null, 2).substring(0, 300));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
