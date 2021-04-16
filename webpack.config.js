const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin(
            {
                template: './index.html',
                minify: {
                    collapseWhitespace: isProd
                }
            }
        ),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin(
            {
                patterns: [{
                        from: path.resolve(__dirname, 'src/favicon.ico'),
                        to: path.resolve(__dirname, 'dist')
                }]
            }
        ),
        new MiniCssExtractPlugin(
            {
                chunkFilename: '[id].css'
            }
        )
    ]
  
    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    target: 'web',
    entry: {
        main: ['@babel/polyfill', './index.js']
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@moduls': path.resolve(__dirname, 'src/moduls'),
            '@': path.resolve(__dirname, 'src')
        },
        modules: ["node_modules"]
    },
    optimization: optimization(),
    devServer: {
        host: 'localhost',
        port: 4200,
        open: true,
        hot: isDev
    },
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.(sa|sc|le|c)ss$/,
                exclude: /(node_modules)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false, 
                        }
                    },{
                        loader: "less-loader",
                        options: {
                            implementation: require("less"),
                            sourceMap: true,
                        }
                    },{
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sourceMap: true,
                        }
                    }
                ]
            },{
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: ['file-loader']
            },{
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                    presets: ['@babel/preset-env'],
                        plugins: [
                            ['@babel/plugin-proposal-class-properties', { 'loose': true }]
                        ]
                    }
                }
            }
        ]
    }
}