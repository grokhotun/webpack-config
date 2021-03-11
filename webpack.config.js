const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

const filename = ext => (isDevelopment ? `[name].${ext}` : `[name].[fullhash].${ext}`)

const getBabelOptions = (presets = []) => {
  const options = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if (presets.length) {
    options.presets = [
      ...options.presets,
      ...presets
    ]
  }

  return options
}

const getJsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: getBabelOptions()
    }
  ]

  if (isDevelopment) {
    loaders.push('eslint-loader')
  }

  return loaders
}

const getWebpackPlugins = () => {
  const basePlugins = [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      // Минифицируем HTML код в production версиях
      minify: {
        removeComments: isProduction,
        collapseWhitespace: isProduction
      }
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new ProgressBarPlugin()
  ]

  if (isDevelopment) {
    basePlugins.push(new BundleAnalyzerPlugin())
    basePlugins.push(new ErrorOverlayPlugin())
  }
  if (isProduction) {
    basePlugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'src/favicon.ico'),
              to: path.resolve(__dirname, 'build')
            }
          ]
        })
    )
  }

  return basePlugins
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  // Добавляем полифиллы для корректной работы новых стандартов javascript
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.js'],
    // Создаем алиасы для импортов
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@containers': path.resolve(__dirname, 'src/containers')
    }
  },
  // Добавляем source-maps в режиме разработке
  devtool: isDevelopment ? 'source-map' : false,
  // devServer для обновления в режиме реального вревмени
  devServer: {
    port: 5080,
    hot: isDevelopment
  },
  target: 'web',
  // Оптимизация файлов по чанкам
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: getWebpackPlugins(),
  module: {
    rules: [
      // Пропускаем все scss файлы через loader для
      // превращения их в конечный bundle css
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      // Пропускаем все js/jsx файлы через babel чтобы превратить
      // js код в стандарт, который будут понимать все браузеры
      {
        test: /\.js[x]$/,
        exclude: /node_modules/,
        use: getJsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: getBabelOptions(['@babel/preset-typescript'])
          }
        ]
      }
    ]
  }
}
