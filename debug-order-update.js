const axios = require('axios');

async function testOrderUpdate() {
  try {
    // Login
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      username: 'admin',
      password: '(130Bpm)'
    });
    
    const token = loginResponse.data.token;
    console.log('Token obtained');
    
    // Get articles
    const articlesResponse = await axios.get('http://localhost:5001/api/content/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const articles = articlesResponse.data.items;
    console.log(`Found ${articles.length} articles`);
    
    if (articles.length > 0) {
      // Try to update order
      const items = articles.map(article => ({ id: article.id }));
      
      console.log('Sending order update with items:', items.slice(0, 3));
      
      const orderResponse = await axios.put('http://localhost:5001/api/content/articles/order', 
        { items },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Order update response:', orderResponse.data);
    }
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 500) {
      console.error('Server error - check backend logs');
    }
  }
}

testOrderUpdate();