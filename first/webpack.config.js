/**
 * Created by user on 16/6/2.
 */
var webpack = require('webpack');
var path = require('path');
var fs= require('fs');
var node_modules_dir = path.join(__dirname, "node_modules");
var controller_dir = path.join(__dirname, "static/source/scripts/");
var ExtractTextPlugin=require("extract-text-webpack-plugin");
var TransferWebpackPlugin=require("transfer-webpack-plugin");
var entryList={};


//读取所有scripts的文件(返回目录下的所有文件的名称的数组)
var list =fs.readdirSync(controller_dir);
list.forEach(function(item,index){
    if(item.indexOf('.js')!=-1){
        entryList[item.split('.')[0]]=controller_dir+item;
    }
});


module.exports = {
    entry: entryList,
    output: {
        path: __dirname + '/dist',
        filename: 'scripts/[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: node_modules_dir,
                loader: 'babel-loader?presets[]=es2015&compact=false'
            },{
                test:/\.css$/,
                exclude:node_modules_dir,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },{
                test:/.(png|jpg|gif)$/,
                loader:"url-loader",
                query: { limit: 8192, name: "images/[name].[ext]" }
            },{
                test:path.resolve(node_modules_dir, "jquery/dist/jquery.js"),
                loader: "expose?$!expose?jQuery"
            }
        ]
    },
    plugins:[
        new TransferWebpackPlugin([
        { from: 'static/source/images', to: 'images' }
    ]),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("css/[name].css")
    ],
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
}