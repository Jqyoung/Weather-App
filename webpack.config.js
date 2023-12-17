const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Weather App',
      template: 'src/template.html',
    }),
  ],

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.css$/i,

        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.(png|jpg|svg|jpeg|gif)$/i,

        type: 'asset/resource',
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,

        type: 'asset/resource',
      },
    ],
  },
};
