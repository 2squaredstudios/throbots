var cp = require('child_process');

exports.startServer = function(world, port) {
    cp.exec('node server.js ' + port + ' 60 ' + world);
}