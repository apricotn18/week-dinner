const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const enabledSourceMap = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	watch: true,
	entry: './src/app.js',
	// 出力の設定
	output: {
		// 出力するファイル名
		filename: 'app.js',
		// 出力先のパス（絶対パスを指定する必要がある）
		path: path.join(__dirname, 'dist/'),
	},
	module: {
		rules: [
			{
				test: /\.ejs$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: false
						},
					},
					{
						loader: 'ejs-plain-loader'
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
							sourceMap: enabledSourceMap,
							importLoaders: 2,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: enabledSourceMap,
							postcssOptions: {
								plugins: ['autoprefixer'],
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
							sassOptions: {
								fiber: require('fibers'),
							},
							sourceMap: enabledSourceMap,
						},
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
							]
						}
					}
				]
			},
			// {
			// 	test: /\.(gif|png|jpe?g|svg|eot|wof|woff|ttf)$/i,
			// 	loader: 'file-loader',
			// 	options: {
			// 		name: './assets/img/[name].[ext]',
			// 	}
			// },
		],
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: false,
		}),
		new CopyPlugin({
			patterns: [{
				from: __dirname + '/src/assets/img',
				to: __dirname + '/dist/assets/img'
			}],
		}),
		new ImageminPlugin({
			disable: process.env.NODE_ENV !== 'production',
			pngquant: {
				quality: '95-100'
			}
		}),
		new MiniCssExtractPlugin({
			filename: './assets/css/common.css',
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template : './src/index.ejs',
		}),
		new HtmlWebpackPlugin({
			filename: 'buy.html',
			template : './src/buy.ejs',
		}),
		new HtmlWebpackPlugin({
			filename: 'delete.html',
			template : './src/delete.ejs',
		}),
		new HtmlWebpackPlugin({
			filename: 'entry.html',
			template : './src/entry.ejs',
		}),
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	],
	watchOptions: {
		ignored: /node_modules/
	},
};