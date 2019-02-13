/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('./package.json');

const commonConfig = {
  entry: ['@babel/polyfill', './src/css/chart.css', './src/index.ts'],
  output: {
    library: ['toastui', 'Chart'],
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@t': path.resolve(__dirname, 'types/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

module.exports = (env, { mode, minify }) => {
  const isProduction = mode === 'production';
  const { version, author, license } = pkg;

  commonConfig.output.filename = `toastui-chart${minify ? '.min' : ''}.js`;

  const BANNER = [
    'TOAST UI Chart 4th Edition',
    `@version ${version} | ${new Date().toDateString()}`,
    `@author ${author}`,
    `@license ${license}`,
  ].join('\n');

  if (isProduction) {
    const productionConfig = {
      mode,
      plugins: [
        new MiniCssExtractPlugin({ filename: `toastui-chart${minify ? '.min' : ''}.css` }),
        new webpack.BannerPlugin({
          banner: BANNER,
          entryOnly: true,
        }),
      ],
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
        ],
      },
      optimization: {
        minimize: false,
      },
    };

    if (minify) {
      productionConfig.optimization = {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // eslint-disable-line camelcase
                warnings: true,
              },
              output: {
                comments: /TOAST UI Chart/i,
              },
            },
          }),
        ],
      };
    }

    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, {
    mode,
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        title: 'Development',
        showErrors: true,
      }),
    ],
    devServer: {
      hot: true,
      open: 'Google Chrome',
      overlay: {
        warnings: true,
        errors: true,
      },
      clientLogLevel: 'debug',
      stats: {
        color: true,
      },
      contentBase: __dirname,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
      ],
    },
    devtool: 'eval-source-map',
  });
};