const path = require('path');
const html = require('html-webpack-plugin');

module.exports = {
  entry : ['./src/js/index.js'], // entry-point (arr)
  output : {
    path : path.resolve(__dirname, 'dist'), // abs path
    filename : 'js/bundle.js' // output bundled file
  },
  /*
  mode : 'development' // for bundling, 'production' for minifying
  */
  devServer : {
    contentBase : './dist' // folder to serve for webpack
  },
  plugins : [
    new html({ // html-webpack-plugin for index.html
      filename : 'index.html',
      template : './src/index.html'
    })
  ],
  module : { // obj
    rules : [ // arr of loaders
      {
        test : /\.js$/, // prop as RegEx to test for all JS files
        exclude : /node_modules/, // prop as RegEx for files to exclude
        use : { // obj -> all the test JS files will use the loader here
          loader : 'babel-loader' // npm package
        }
      }
    ]
  }
};