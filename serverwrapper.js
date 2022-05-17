var cp = require('child_process');

exports.startServer = function() {
    cp.exec('node server.js 25500 60 world.json');
}