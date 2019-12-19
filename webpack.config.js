const htmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: path.resolve('index.js'),
  output: {
    path: __dirname + '/dist',
    filename: 'virtual-dom-with-diff.js'
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    })
  ]
}