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


//读取scripts里所有的文件(返回目录下的所有文件的名称的数组)
var list =fs.readdirSync(controller_dir);
list.forEach(function(item,index){
    if(item.indexOf('.js')!=-1){
        entryList[item.split('.')[0]]=controller_dir+item;
    }
});


module.exports = {
    entry: entryList,
    output: {
        path: __dirname + '/dist',              //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它,名字可以随便起
        filename: 'scripts/[name].min.js',
        publicPath:'../',         //模板、样式、脚本、图片等资源对应的server上的路径
        vendor: ['jquery']
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
            }, {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                query: {limit: 10000, name: "fonts/[name].[ext]", mimetype: "application/font-woff"}
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                query: {limit: 10000, name: "fonts/[name].[ext]", mimetype: "application/font-woff2"}
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                query: {limit: 10000, name: "fonts/[name].[ext]", mimetype: "application/octet-stream"}
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader",
                query: {name: "fonts/[name].[ext]"}
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                query: {limit: 10000, name: "fonts/[name].[ext]", mimetype: "image/svg+xml"}
            }
        ]
    },
    plugins:[
        new TransferWebpackPlugin([
            { from: 'static/source/images', to: 'images' }
        ]),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("css/[name].css"),
        new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery", "window.jQuery": "jquery"}),
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'lib/vendor.js')
    ],
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
}
