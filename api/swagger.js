const swagger = require('../public/swagger/swagger.json');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(swagger);
};
