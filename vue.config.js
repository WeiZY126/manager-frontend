//在根目录下创建vue.config.js,如下配置：
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8081', //路径指向本地主机地址及端口号。这里别忘了加http
                ws: true,
                changeOrigin: true,
                pathRewrite:{
                    '^/api': '/json' //路径转发代理。这里意味着用"/api"来代替"/json"
                }
            }
        }
    }
}