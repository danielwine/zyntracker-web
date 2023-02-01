const path = require('path');

module.exports = {
  entry: './build/index.js',
  mode: "production",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    library: "ZSS",
    libraryTarget: "umd"
  },
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
    }
  }
};