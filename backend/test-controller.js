const ArticleController = require('./src/controllers/content/article.controller');

// Create a fake request and response
const req = {
  body: {
    items: [
      { id: 'test1' },
      { id: 'test2' }
    ]
  }
};

const res = {
  status: function(code) {
    console.log('Status:', code);
    return this;
  },
  json: function(data) {
    console.log('Response:', data);
    return this;
  }
};

console.log('Testing updateOrder method...');
ArticleController.updateOrder(req, res);