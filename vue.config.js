const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const CIUDADES = require('./src/ciudades')

const production = process.env.NODE_ENV === 'production'
console.log('PRODUCTION', production)
const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : '/mapa_nuevo/'


const developmentPlugins = []
const productionPlugins = [
  new PrerenderSPAPlugin({
    staticDir: path.join(__dirname, 'dist'),
    indexPath: path.join(__dirname, 'dist', BASE_URL, 'index.html'),
    routes: CIUDADES.map(c => BASE_URL + c.slug),
  }),
  // bundle analyzer
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'report.html',
    openAnalyzer: true,
  })
]

module.exports = {
  baseUrl: BASE_URL,
  outputDir: 'dist' + BASE_URL,

  configureWebpack: {
    plugins: production ? productionPlugins : developmentPlugins,

    //output: {
      //dir: path.join(__dirname, 'dist/' + BASE_URL),
      //publicPath: path.join(__dirname, 'dist/' + BASE_URL)
      //path: path.join(__dirname, 'dist/' + BASE_URL)
    //}
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
