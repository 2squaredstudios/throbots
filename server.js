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
      entities[req.query.entity] = {x: 5, y: 5, yvelocity: 0, xvelocity: 0, crouchdown: false, leftdown: false, rightdown: false, frame: 'player' + req.query.player + '/still', thrown: false};
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
      if (entities[req.query.entity].frame.includes('player0/')) {
        entities[req.query.entity].frame = 'player0/left';
      }
      if (entities[req.query.entity].frame.includes('player1/')) {
        entities[req.query.entity].frame = 'player1/left';
      }
      if (entities[req.query.entity].frame.includes('player2/')) {
        entities[req.query.entity].frame = 'player2/left';
      }
      if (entities[req.query.entity].frame.includes('player3/')) {
        entities[req.query.entity].frame = 'player3/left';
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
      if (entities[req.query.entity].frame.includes('player0/')) {
        entities[req.query.entity].frame = 'player0/right';
      }
      if (entities[req.query.entity].frame.includes('player1/')) {
        entities[req.query.entity].frame = 'player1/right';
      }
      if (entities[req.query.entity].frame.includes('player2/')) {
        entities[req.query.entity].frame = 'player2/right';
      }
      if (entities[req.query.entity].frame.includes('player3/')) {
        entities[req.query.entity].frame = 'player3/right';
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
      if (entities[req.query.entity].frame.includes('player0/')) {
        entities[req.query.entity].frame = 'player0/still';
      }
      if (entities[req.query.entity].frame.includes('player1/')) {
        entities[req.query.entity].frame = 'player1/still';
      }
      if (entities[req.query.entity].frame.includes('player2/')) {
        entities[req.query.entity].frame = 'player2/still';
      }
      if (entities[req.query.entity].frame.includes('player3/')) {
        entities[req.query.entity].frame = 'player3/still';
      }
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/rightup') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].rightdown = false;
      if (entities[req.query.entity].frame.includes('player0/')) {
        entities[req.query.entity].frame = 'player0/still';
      }
      if (entities[req.query.entity].frame.includes('player1/')) {
        entities[req.query.entity].frame = 'player1/still';
      }
      if (entities[req.query.entity].frame.includes('player2/')) {
        entities[req.query.entity].frame = 'player2/still';
      }
      if (entities[req.query.entity].frame.includes('player3/')) {
        entities[req.query.entity].frame = 'player3/still';
      }
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/jump') {
    if (entities.hasOwnProperty(req.query.entity)) {
      if (Math.floor(entities[req.query.entity].yvelocity) == 0) {
        if (entities[req.query.entity].crouchdown) {
          res(400, 'text/plain', 'could not jump, crouched');
        }
        else {
          entities[req.query.entity].yvelocity = -4;
          if (entities[req.query.entity].frame.includes('player0/')) {
            entities[req.query.entity].frame = 'player0/jump';
          }
          if (entities[req.query.entity].frame.includes('player1/')) {
            entities[req.query.entity].frame = 'player1/jump';
          }
          if (entities[req.query.entity].frame.includes('player2/')) {
            entities[req.query.entity].frame = 'player2/jump';
          }
          if (entities[req.query.entity].frame.includes('player3/')) {
            entities[req.query.entity].frame = 'player3/jump';
          }
          res(200, 'text/plain', 'ok');
        }
      }
      else {
        res(400, 'text/plain', 'could not jump, not on ground');
      }
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/throw') {
    if (entities.hasOwnProperty(req.query.entity)) {
      if (entities[req.query.entity].crouchdown) {
        res(400, 'text/plain', 'could not throw, crouched');
      }
      else {
        entities[req.query.entity].yvelocity = parseInt(req.query.y);
        entities[req.query.entity].xvelocity = parseInt(req.query.x);
        entities[req.query.entity].thrown = true;
        res(200, 'text/plain', 'ok');
      }
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/crouchdown') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].crouchdown = true;
      if (entities[req.query.entity].frame.includes('player0/')) {
        entities[req.query.entity].frame = 'player0/crouch';
      }
      if (entities[req.query.entity].frame.includes('player1/')) {
        entities[req.query.entity].frame = 'player1/crouch';
      }
      if (entities[req.query.entity].frame.includes('player2/')) {
        entities[req.query.entity].frame = 'player2/crouch';
      }
      if (entities[req.query.entity].frame.includes('player3/')) {
        entities[req.query.entity].frame = 'player3/crouch';
      }
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/crouchup') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].crouchdown = false;
      if (entities[req.query.entity].frame.includes('player0/')) {
        entities[req.query.entity].frame = 'player0/still';
      }
      if (entities[req.query.entity].frame.includes('player1/')) {
        entities[req.query.entity].frame = 'player1/still';
      }
      if (entities[req.query.entity].frame.includes('player2/')) {
        entities[req.query.entity].frame = 'player2/still';
      }
      if (entities[req.query.entity].frame.includes('player3/')) {
        entities[req.query.entity].frame = 'player3/still';
      }
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
    entities[entity].x += entities[entity].xvelocity;
    if (entities[entity].xvelocity > 0) {
      entities[entity].xvelocity -= 0.1;
    }
    if (entities[entity].xvelocity < 0) {
      entities[entity].xvelocity += 0.1;
    }
    entities[entity].y += entities[entity].yvelocity;
    if (entities[entity].leftdown && !(entities[entity].thrown || entities[entity].crouchdown)) {
      entities[entity].x--;
    }
    if (entities[entity].rightdown && !(entities[entity].thrown || entities[entity].crouchdown)) {
      entities[entity].x++;
    }
    var condition = false;
    for (var i = 0; i < platforms.length; i++) {
      if ((entities[entity].x > platforms[i].x) && (entities[entity].x < (platforms[i].x + 83)) && (entities[entity].y > platforms[i].y) && (entities[entity].y < (platforms[i].y + 9))) {
        entities[entity].thrown = false;
        entities[entity].xvelocity = 0;
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
      entities[entity].y = 5;
      entities[entity].x = 5;
      entities[entity].yvelocity = 0;
    }
  }
}
setInterval(function() {
  process.stdout.write('TPS: ' + tps + '\r');
  tps = 0;
}, 1000);
setInterval(loop, 1000 / parseInt(process.argv[3]));
process.stdin.on('data', function(data) {
  if (entities.hasOwnProperty(data.toString().split('\n')[0])) {
    delete entities[data.toString().split('\n')[0]];
    console.log(data.toString().split('\n')[0] + ' left the game!');
  }
  else {
    console.log('could not kick player ' + data.toString().split('\n')[0] + ', no player found');
  }
});
}
});
}
