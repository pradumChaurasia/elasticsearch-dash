const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/elasticsearch',  // Adjust this path based on your needs
    createProxyMiddleware({
      target: 'http://localhost:9200',
      changeOrigin: true,
    })
  );
};
