const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const production = process.env.NODE_ENV === 'production'

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
  lintOnSave: false,
  configureWebpack: {
    plugins: production ? productionPlugins : developmentPlugins
  }
}