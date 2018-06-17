const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const production = process.env.NODE_ENV === 'production'
const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : '/mapa_nuevo/'

const developmentPlugins = []
const productionPlugins = [
  // bundle analyzer
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'report.html',
    openAnalyzer: true,
  }),
]

module.exports = {
  baseUrl: BASE_URL,
  configureWebpack: {
    plugins: production ? productionPlugins : developmentPlugins,
  },
  lintOnSave: false,
  pwa: {
    workboxOptions: {
      runtimeCaching: [
        {
          handler: 'networkFirst',
          urlPattern: new RegExp('.*'),
        },
      ],
      skipWaiting: true,
    },
  },
}
