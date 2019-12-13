require('babel-polyfill')
var path = require('path');
var webpack = require('webpack');
var dotenv = require('dotenv').config({path: __dirname + '/.env'});


console.log("test_env.application_mode--",process.env.application_mode)
var config = {
   entry: {
     index: ['babel-polyfill', './client/main.js']
   },
   output: {
   		path: path.resolve(__dirname, 'build'),
   		filename: 'index.js',
   		publicPath: '/'
   	},
   	devServer: {
   		inline: true, // autorefresh
   		port: process.env.port,  // development port server
   		historyApiFallback: true
   	},
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['@babel/preset-env', '@babel/preset-react']
            }
         },
         {
           test: /\.css$/,
           exclude: /node_modules/,
           loader: 'style-loader!css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1&sourceMap!postcss-loader'
         },
         {
           test: /\.css$/,
           include: /node_modules/,
           loaders: ['style-loader', 'css-loader']
         },
         {
           test: /\.(png|jpg|jpeg|gif)$/,
           exclude: /node_modules/,
           loader: 'url-loader?limit=2050000'
         }
      ]
   },
   plugins:[
      new webpack.DefinePlugin({
         test_env:JSON.stringify(dotenv.parsed)
       })     
   ]
}
module.exports = config;
