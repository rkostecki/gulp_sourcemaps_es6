var path         = require('path');

module.exports = {
    context: __dirname,
    entry: './src/js/app.js',
    output: {
        path: __dirname + '/build/local/js',
        filename: 'app.js' },
    module: {
        loaders: [
            {
                test: /.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react']
                }
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    }

};

