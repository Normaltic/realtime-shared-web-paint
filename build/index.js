'use strict';

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var path = require('path');
var WebpackDevServer = require('webpack-dev-server');
//const webpack = ('webpack');


var server = express();
var port = 4000;

var config = require('../webpack.config');
var compiler = (0, _webpack2.default)(config);

server.use('/', express.static(path.resolve(__dirname, '../public')));
server.get('*', function (req, res, next) {
    if (req.path.split('/')[1] === 'static') return next();
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

server.listen(port, function () {
    console.log('server has connected on ' + port);
});

var devServer = new WebpackDevServer(compiler, config.devServer);
devServer.listen(4001, function () {
    console.log('-----------Client Server has open 4001. ( INFO: Webpack.dev.server )');
});