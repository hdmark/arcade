module.exports = {
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    inline: true,
    host: '0.0.0.0',
    port: 3000,
    public: 'lvmgmtllc.com',
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:2690',
    //     //pathRewrite: { '^/api': '' },
    //   },
    // },
    //allowedHosts: ['ice.broke-it.net:2680', 'ice.broke-it.net'],
  },
};
