const webpack = require("webpack");
const path = require('path');

module.exports = {
    target: 'web',
    entry: {
        index: './index.js',
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].js",
        publicPath: "/",
    },
    devServer: {
        static: {
            directory: path.join(__dirname),
        },
        compress: true,
    },
    resolve: {
        extensions: [".js"],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    }
};