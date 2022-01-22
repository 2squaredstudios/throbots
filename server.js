if (process.argv.length < 5) {
  console.log('Usage:');
  console.log('./server.js [port] [maxtps] [worldfile]');
}
else {
var http = require('@thecoder08/http');
var fs = require('fs');
fs.readFile(process.argv[4], function(err, data) {
  if (err) {
    console.log('Error reading world file!');
  }
  else {
var world = JSON.parse(fs.readFileSync(process.argv[4]));
console.log('Loaded world ' + world.title);
var theme = world.theme;
var entities = world.entities;
var platforms = world.platforms;
http.server(process.argv[2],   function(req, res) {
  if (req.pathname == '/join') {
    if (entities.hasOwnProperty(req.query.entity)) {
      res(400, 'text/plain', 'entity already exists');
    }
    else {
      entities[req.query.entity] = {x: 2, y: 2, yvelocity: 0, leftdown: false, rightdown: false, frame: 'player' + req.query.player + 'left', thrownleft: false, thrownright: false};
      console.log(req.query.entity + ' joined the game!');
      res(200, 'text/plain', theme);
    }
  }
  else if (req.pathname == '/leave') {
    if (entities.hasOwnProperty(req.query.entity)) {
      delete entities[req.query.entity];
      console.log(req.query.entity + ' left the game!');
      res(200, 'text/plain', 'left successfully');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/getentities') {
    res(200, 'text/plain', JSON.stringify(entities));
  }
  else if (req.pathname == '/getplatforms') {
    res(200, 'text/plain', JSON.stringify(platforms));
  }
  else if (req.pathname == '/leftdown') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].leftdown = true;
      if (entities[req.query.entity].frame.includes('0')) {
        entities[req.query.entity].frame = 'player0left';
      }
      if (entities[req.query.entity].frame.includes('1')) {
        entities[req.query.entity].frame = 'player1left';
      }
      if (entities[req.query.entity].frame.includes('2')) {
        entities[req.query.entity].frame = 'player2left';
      }
      if (entities[req.query.entity].frame.includes('3')) {
        entities[req.query.entity].frame = 'player3left';
      }
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/rightdown') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].rightdown = true;
      if (entities[req.query.entity].frame.includes('0')) {
        entities[req.query.entity].frame = 'player0right';
      }
      if (entities[req.query.entity].frame.includes('1')) {
        entities[req.query.entity].frame = 'player1right';
      }
      if (entities[req.query.entity].frame.includes('2')) {
        entities[req.query.entity].frame = 'player2right';
      }
      if (entities[req.query.entity].frame.includes('3')) {
        entities[req.query.entity].frame = 'player3right';
      }
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/leftup') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].leftdown = false;
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/rightup') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].rightdown = false;
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/jump') {
    if (entities.hasOwnProperty(req.query.entity)) {
      if (Math.floor(entities[req.query.entity].yvelocity) == 0) {
        entities[req.query.entity].yvelocity = -4;
        res(200, 'text/plain', 'ok');
      }
      else {
        res(400, 'text/plain', 'could not jump, not on ground');
      }
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/throwright') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].yvelocity = -4;
      entities[req.query.entity].thrownright = true;
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/throwleft') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].yvelocity = -4;
      entities[req.query.entity].thrownleft = true;
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else {
    res(404, 'text/plain', '404 not found');
  }
});
var tps = 0;
function loop() {
  tps++;
  for (var entity in entities) {
    entities[entity].y += entities[entity].yvelocity;
    if (entities[entity].leftdown && !(entities[entity].thrownleft || entities[entity].thrownright)) {
      entities[entity].x -= 1;
    }
    if (entities[entity].rightdown && !(entities[entity].thrownleft || entities[entity].thrownright)) {
      entities[entity].x += 1;
    }
    if (entities[entity].thrownleft) {
      entities[entity].x -= 1;
    }
    if (entities[entity].thrownright) {
      entities[entity].x += 1;
    }
    var condition = false;
    for (var i = 0; i < platforms.length; i++) {
      if ((entities[entity].x > platforms[i].x) && (entities[entity].x < (platforms[i].x + 83)) && (entities[entity].y > platforms[i].y) && (entities[entity].y < (platforms[i].y + 9))) {
        entities[entity].thrownleft = false;
        entities[entity].thrownright = false;
        if (entities[entity].yvelocity < 0) {
          entities[entity].yvelocity = 0;
          entities[entity].y = platforms[i].y + 40;
        }
        else {
          condition = true;
          entities[entity].yvelocity = 0;
          entities[entity].y = platforms[i].y + 1;
        }
      }
    }
    if (!condition) {
      entities[entity].yvelocity += 0.1;
    }
    if (entities[entity].y > 300) {
      entities[entity].y = 0;
      entities[entity].yvelocity = 0;
    }
  }
}
setInterval(function() {
  process.stdout.write('TPS: ' + tps + '\r');
  tps = 0;
}, 1000);
setInterval(loop, 1000 / parseInt(process.argv[3]));
}
});
}
