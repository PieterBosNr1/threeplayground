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
                use: 'babel-loader'
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