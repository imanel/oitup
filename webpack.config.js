module.exports = {
  devtool: 'eval-source-map',
  entry: './src/index.js',
  output: {
    path: './xcode/Oitup/',
    filename: 'application.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['latest'],
          plugins: ['transform-object-rest-spread'],
        }
      }
    ]
  }
}
