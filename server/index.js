const express = require('express');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
//const webpack = ('webpack');
import webpack from 'webpack';

const server = express();
const port = 4000;

const config = require('../webpack.config');
const compiler = webpack(config);

server.use('/', express.static(path.resolve(__dirname, '../public')));
server.get('*', (req, res, next) => {
    if( req.path.split('/')[1] === 'static' ) return next();
    res.sendFile(path.resolve( __dirname, '../public/index.html'));
})

const expressServer = server.listen(port, function () {
    console.log('server has connected on ' + port);
});

const io = require('socket.io')(expressServer);
io.on('connection', (socket) => {
	console.log("connected on Client");
	socket.on('onDrawSendData', (data) => {
		console.log(data);
		socket.broadcast.emit('getonDrawData', data);
	});
	
	socket.on('onDrawSendItem', (data) => {
		console.log(data.item.points.length);
		socket.broadcast.emit('getonDrawItem', data);
	});

	socket.on('SendCreatePage', (data) => {
		socket.broadcast.emit('getCreatePage', data);
	});
});

const devServer = new WebpackDevServer(compiler, config.devServer);
devServer.listen(4005, () => {
	console.log('-----------Client Server has open 4001. ( INFO: Webpack.dev.server )');
});
