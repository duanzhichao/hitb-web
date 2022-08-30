const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api' : {
        target: 'http://127.0.0.1:8000', //请求的服务器地址
        pathRewrite:{ '^/api': '' }, //可以让发过去的请求不带/api打头
        ws: true,
        changOrigin: true,
      }
    }
  }
})
