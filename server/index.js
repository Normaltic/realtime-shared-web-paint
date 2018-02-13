const express = require('express');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
//const webpack = ('webpack');
import webpack from 'webpack';

const server = express();
const port = 4003;


server.use('/', express.static(path.resolve(__dirname, '../public')));
server.get('*', (req, res, next) => {
    if( req.path.split('/')[1] === 'static' ) return next();
    res.sendFile(path.resolve( __dirname, '../public/index.html'));
})

console.log(process.env.SERVER_ENV);

const expressServer = server.listen(port, function () {
    console.log('server has connected on ' + port);
});

const io = require('socket.io')(expressServer);
io.on('connection', (socket) => {

	if( socket.BoardSession ) socket.emit('BoardInitialize', socket.BoardSession);
	else {
		const sessions = {
			pageLength: 1,
			pageData: [
				{
					pageIndex: 1,
					items: {
						itemCount: 0,
						itemList: []
					},
					preview: '',
					background: ''
				}
			]
		}
	}

	socket.on('onDrawSendData', (data) => {
		console.log(data);
		socket.broadcast.emit('getonDrawData', data);
	});
	
	socket.on('onDrawSendItem', (data) => {
		console.log("Success to Send ItemData");
		socket.broadcast.emit('getonDrawItem', data);
	});

	socket.on('SendCreatePage', (data) => {
		socket.broadcast.emit('getCreatePage', data);
	});

	socket.on('gettestDrawData', (data) => {
		socket.broadcast.emit('testDrawData', data);
	});
	
	socket.on('triggerUndoEvent', (data) => {
		socket.broadcast.emit('triggedUndoEvent', data);
	});

	socket.on('triggerRedoEvent', (data) => {
		socket.broadcast.emit('triggedRedoEvent', data);
	});
});

if( process.env.SERVER_ENV == "development" ) {

	const config = require('../webpack.dev.config');
	const compiler = webpack(config);
	
	const devServer = new WebpackDevServer(compiler, config.devServer);

	devServer.listen(4009, () => {
		console.log('-----------Client Server has open 4001. ( INFO: Webpack.dev.server )');
	});
}
