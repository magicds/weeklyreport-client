module.exports = {
  publicPath: '/weeklyreport-new',
  productionSourceMap: false,
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  devServer: {
    port: 2221,
    // proxy: 'http://localhost:2222'
    proxy: 'http://192.168.201.159'
    // proxy: {
    //   "^/fe-manage/api": { target: "http://localhost:2222" }
    // }
  },
  pwa: {
    name: '新点前端周报',
    assetsVersion: new Date().toISOString().replace(/:\d{2}\.\d{3}[a-zA-Z]$/, ''),
    workboxOptions: {
      importWorkboxFrom: 'local'
    }
  }
};
