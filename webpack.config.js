const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const VENDOR_LIBS = [
    'three'
];

//console.log(process.env.NODE_ENV)
console.log('process.env', process.env.npm_lifecycle_event)

module.exports = {
    entry: {
        bundle: './src/app.js',
        vendor: VENDOR_LIBS
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename:'[name].js'
    },
    module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: "/node_modules/",
				use: {
					loader: 'babel-loader',
					options: {
						presets:[path.resolve(__dirname, "./node_modules/babel-preset-es2015"), path.resolve(__dirname, "./node_modules/babel-preset-react")]
					}
				}
			}
		]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new HtmlWebpackPlugin({template: './src/index.html'})
    ]
};