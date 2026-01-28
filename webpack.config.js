const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ConcatPlugin = require('webpack-concat-plugin');
const modules = require("./src/modules.js");
console.log(modules);

const VENDOR_LIBS = [
    'three'
];

//console.log(process.env.NODE_ENV)
console.log('process.env', process.env.npm_lifecycle_event)

module.exports = {
    entry: {
        bundle: './src/app.js',
        'solar-system': './src/solar-system.js',
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
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['manifest', 'vendor', 'bundle']
        }),
        new HtmlWebpackPlugin({
            template: './src/solar-system.html',
            filename: 'solar-system.html',
            chunks: ['manifest', 'vendor', 'solar-system']
        }),
        new ConcatPlugin({
            uglify: false, // or you can set uglifyjs options
            useHash: false, // md5 file
            sourceMap: true, // generate sourceMap
            name: 'flexible', // used in html-webpack-plugin
            fileName: '[name].bundle.js', // would output to 'flexible.d41d8cd98f00b204e980.bundle.js'
            filesToConcat:modules
        })
    ]
};