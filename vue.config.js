const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const CIUDADES = require('./src/ciudades.json')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const production = process.env.NODE_ENV === 'production'
const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : '/mapa/'

const developmentPlugins = [new VuetifyLoaderPlugin()]
const productionPlugins = [
  new PrerenderSPAPlugin({
    staticDir: path.join(__dirname, 'dist'),
    indexPath: path.join(__dirname, 'dist', BASE_URL, 'index.html'),
    routes: [BASE_URL].concat(CIUDADES.map(c => BASE_URL + c.slug)),
  }),
  // bundle analyzer
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'report.html',
    openAnalyzer: true,
  }),
  new VuetifyLoaderPlugin(),
]

module.exports = {
  publicPath: BASE_URL,
  outputDir: 'dist' + BASE_URL,
  devServer: {
    public: '0.0.0.0:' + process.env.HOST_PORT || '8080',
    https: process.env.TRAVIS_HTTPS !== 'False',
  },
  chainWebpack: config => {
    config.plugin('prefetch').tap(options => {
      options[0].include = 'allAssets'
      options[0].as = function(entry) {
        if (/\.css$/.test(entry)) return 'style'
        if (/\.woff$/.test(entry)) return 'font'
        if (/\.png$/.test(entry)) return 'image'
        return 'script'
      }
      return options
    })
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 128,
        name: 'img/[name].[hash:8].[ext]',
      })
  },
  configureWebpack: {
    plugins: production ? productionPlugins : developmentPlugins,
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        options: {
          implementation: require('sass'),
          fiber: require('fibers'),
        },
      },
    },
  },
  pwa: {
    name: 'Cualbondi',
    themeColor: '#4285F4',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxOptions: {
      runtimeCaching: [
        {
          // handler: 'staleWhileRevalidate',
          handler: 'networkFirst',
          urlPattern: new RegExp('^https://cualbondi.org'),
        },
        {
          handler: 'networkOnly',
          urlPattern: new RegExp('.*'),
        },
      ],
      skipWaiting: true,
    },
  },
}
