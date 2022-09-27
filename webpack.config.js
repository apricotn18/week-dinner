const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const enabledSourceMap = process.env.NODE_ENV !== 'production';

module.exports = {
	mode: 'production',
	entry: './src/App.tsx',
	output: {
		filename: '_app.js',
		path: path.join(__dirname, 'dist/'),
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		historyApiFallback: true,
	},
	module: {
		rules: [
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
				test: /\.(ts|tsx|js)$/,
				use: [
					{
					loader: 'babel-loader',
					options: { presets: ['@babel/preset-env', '@babel/react'] },
					},
					{
					loader: 'ts-loader',
					options: {
						configFile: path.resolve(__dirname, 'tsconfig.json'),
					},
					},
				]
			},
			{
				test: /\.(png|svg|jpe?g|gif|ico)$/,
				type: "asset/resource",
				generator: {
					filename: "./assets/img/[name][ext]"
				}
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: __dirname + '/src/assets/img',
					to: __dirname + '/dist/assets/img'
				},
				{
					from: __dirname + '/src/html',
					to: __dirname + '/dist'
				}
			],
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
	],
	watchOptions: {
		ignored: /node_modules/
	},
	performance: {
		maxEntrypointSize: 500000,
		maxAssetSize: 500000,
	},
	target: 'web',
};