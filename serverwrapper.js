function startServer(world, port) {
    process.argv = ['node', 'server.js', port, '60', world];
    require('server.js');
}