const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')

module.exports = {
  entry: {
    server: './src/server.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].js',
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        // Transpile ES6-8 into ES5
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']],
            plugins: ['@babel/plugin-proposal-class-properties'],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  plugins: [
    new WebpackShellPluginNext({
      onAfterDone: {
        scripts: ['echo "Build complete!"'],
      },
    }),
  ],
}
