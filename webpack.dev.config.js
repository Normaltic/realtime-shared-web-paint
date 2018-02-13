var webpack = require('webpack');

module.exports = {
    entry: [
		'./src/index.js',
		'webpack-dev-server/client?http://0.0.0.0:4009',
		'webpack/hot/only-dev-server'
	],

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    devServer: {
		inline: true,
		hot: true,
		host: "0.0.0.0",
        port: 4009,
		proxy: {
			"**": "http://0.0.0.0:4003"
		},
        contentBase: __dirname + '/public/',
		historyApiFallback: true,
		disableHostCheck: true
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /mode_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
					plugins: ["react-hot-loader/babel"]
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
			{
				test: /\.png$/,
				loader: 'url-loader'
			}	
        ]
    },

	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
};
