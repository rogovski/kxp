const helpers = require("./helpers"),
  webpackConfig = require("./webpack.config.base"),
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  env = require('../environment/dev.env');

webpackConfig.devServer = {
  port: 8080,
  host: "localhost",
  historyApiFallback: true,
  watchOptions: {aggregateTimeout: 300, poll: 1000},
  contentBase: './src',
  open: true,
  proxy: {
    '/static': {
      target: 'http://localhost:8484',
			rewrite: function(req) {
      	req.url = req.url.replace(/^/, '');
      },
			changeOrigin: true
    },
    '/auth': {
      target: 'http://localhost:8282',
			rewrite: function(req) {
      	req.url = req.url.replace(/^/, '');
      },
			changeOrigin: true
    },
    '/image': {
      target: 'http://localhost:8282',
			rewrite: function(req) {
      	req.url = req.url.replace(/^/, '');
      },
			changeOrigin: true
    },
    '/pdf': {
      target: 'http://localhost:8282',
			rewrite: function(req) {
      	req.url = req.url.replace(/^/, '');
      },
			changeOrigin: true
    },
    '/dataset': {
      target: 'http://localhost:8282',
			rewrite: function(req) {
      	req.url = req.url.replace(/^/, '');
      },
			changeOrigin: true
    },
    '/txdensity': {
      target: 'http://localhost:8282',
			rewrite: function(req) {
      	req.url = req.url.replace(/^/, '');
      },
			changeOrigin: true
    },
    '/mbox_jn': {
      target: 'http://localhost:8282',
			rewrite: function(req) {
      	req.url = req.url.replace(/^/, '');
      },
			changeOrigin: true
    },
    '/events': {
      target: 'ws://localhost:8282',
      changeOrigin: true,
      ws: true
    }
  }
};

webpackConfig.plugins = [...webpackConfig.plugins,
  new DefinePlugin({
    'process.env': env
  })
]

module.exports = webpackConfig;
