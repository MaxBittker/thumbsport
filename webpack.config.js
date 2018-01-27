let webpack = require("webpack");
let path = require("path");
// let glslify = require('glslify-loader');

let BUILD_DIR = path.resolve(__dirname, "dist");
let APP_DIR = __dirname;

let config = {
  entry: APP_DIR + "/src/index.js",
  output: {
    path: BUILD_DIR,
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devtool: "#cheap-source-map",
  module: {
    // rules: [
    //   {
    //     test: /\.js$/,
    //     exclude: /(node_modules|bower_components)/,
    //     use: {
    //       loader: 'babel-loader',
    //     }
    //   }
    // ],
    loaders: [
      {
        test: /\.(glsl|frag|vert)$/,
        use: "raw-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: "glslify-loader",
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
