var http = require('@thecoder08/http');
var players = [{x: 0, y: 0, dir: 'right'}, {x: 0, y: 0, dir: 'right'}, {x: 0, y: 0, dir: 'right'}, {x: 0, y: 0, dir: 'right'}];
http.server(8080, function(req, res) {
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
