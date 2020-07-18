const { createProxyMiddleware } = require("http-proxy-middleware");

// allows me to test netlify function locally since client calls from localhost:3000 => 9000 triggers CORS issues
module.exports = function (app) {
  app.use(
    "/.netlify/functions/",
    createProxyMiddleware({
      target: "http://localhost:9000",
      pathRewrite: { "^/.netlify/functions": "" },
    })
  );
};
