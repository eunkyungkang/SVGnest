const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    target: 'web',
    entry: {
        index: './index.js',
    },
    output: {
        path: path.join(__dirname, "dist"),
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
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./index.html",
            filename: "./index.html"
        })
    ]
};