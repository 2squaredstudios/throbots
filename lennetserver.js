var lennet = require('@thecoder08/lennet');
lennet.setServerInstance(function(id) {
  console.log('New instance running at ' + id);
  var players = [{x: 0, y: 0, dir: 'right'}, {x: 0, y: 0, dir: 'right'}, {x: 0, y: 0, dir: 'right'}, {x: 0, y: 0, dir: 'right'}];
  lennet.registerRequestHandler(id, function(req, res) {
    if (req.pathname == '/get') {
      res(200, 'text/plain', JSON.stringify(players));
    }
    else if (req.pathname == '/send') {
      players[parseInt(req.query.player)].x = req.query.x;
      players[parseInt(req.query.player)].y = req.query.y;
      players[parseInt(req.query.player)].dir = req.query.dir;
      res(200, 'text/plain', 'success');
    }
    else {
      res(404, 'text/plain', '404 not found');
    }
  });
});
lennet.init(25568);
