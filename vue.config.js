module.exports = {
  devServer: {
    port: 80,
    proxy: {
      "^/sessions": {
        target: "http://cosy-backend:8080/sessions",
        ws: true,
        changeOrigin: true,
      },
      "^/analysis": {
        target: "http://cosy-backend:8080/analysis",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
