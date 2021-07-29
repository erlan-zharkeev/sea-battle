const path = require('path')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`)

/* PLUGINS */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // get css from js file
/// //////////////////////////////////////////
module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: isDev ? './' : '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/pug/index.pug'),
      inject: true,
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/static'),
          to: path.resolve(__dirname, 'dist/'),
        },
        {
          from: path.resolve(__dirname, './src/assets/audio'),
          to: path.resolve(__dirname, 'dist/assets/audio'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: isDev,
            },
          },
        ],
      },
      {
        test: /\.s[ca]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg|mp3)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: isDev,
              mozjpeg: {
                progressive: true,
                quality: 70,
              },
              pngquant: {
                quality: [0.35, 0.8],
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.mp4$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    host: '192.168.0.8',
    publicPath: '/',
    port: 9000,
    contentBase: path.join(__dirname, './src/pug/index.pug'),
    watchContentBase: true,
    clientLogLevel: 'silent',
  },
  devtool: isDev ? 'source-map' : '',
}
