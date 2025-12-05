const { createRouter } = require('../../utils/vercel-helper');

module.exports = createRouter({
  'GET /': async (req, res) => {
    return {
      success: true,
      data: [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
      ]
    };
  },
  
  'GET /[id]': async (req, res) => {
    const { id } = req.query;
    return {
      success: true,
      data: { id, name: `Product ${id}` }
    };
  },
  
  'POST /': async (req, res) => {
    return {
      success: true,
      message: 'Product created'
    };
  }
});