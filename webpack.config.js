let webpack = require("webpack");
let path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

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
  devServer: {
    overlay: true
  },
  // plugins: [new UglifyJSPlugin({ uglifyOptions: {} })],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: "babel-loader"
      },
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
