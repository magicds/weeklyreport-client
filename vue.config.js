module.exports = {
  productionSourceMap: false,

  devServer: {
    port: 2221,
    proxy: "http://localhost:2222"
    // proxy: {
    //   "^/fe-manage/api": { target: "http://localhost:2222" }
    // }
  }
};
