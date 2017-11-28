module.exports = {
    entry: [
		'./src/index.js',
		'webpack-dev-server/client?http://0.0.0.0:4001',
	],

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    devServer: {
		inline: true,
		hot: true,
		host: "0.0.0.0",
        port: 3001,
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
                    presets: ['es2015', 'react']
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
    }
};
