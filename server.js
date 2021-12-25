#!/usr/bin/env node
if (process.argv.length < 4) {
  console.log('Usage:');
  console.log('./server.js [port] [maxtps]');
}
else {
var http = require('@thecoder08/http');
var entities = {};
var platforms = [{x: 200, y: 40}, {x: 120, y: 80}, {x: 40, y: 120}, {x: 0, y: 160}, {x: 200, y: 800}, {x: 400, y: 800}, {x: 600, y: 800}, {x: 800, y: 800}, {x: 1000, y: 800}, {x: 1200, y: 800}];
http.server(process.argv[2],   function(req, res) {
  if (req.pathname == '/join') {
    entities[req.query.entity] = {x: 2, y: 2, yvelocity: 0, leftdown: false, rightdown: false};
    res(200, 'text/plain', 'joined successfully');
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
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/rightdown') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].rightdown = true;
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
  else {
    res(404, 'text/plain', '404 not found');
  }
});
var tps = 0;
function loop() {
  tps++;
  for (var entity in entities) {
    entities[entity].y += entities[entity].yvelocity;
    if (entities[entity].leftdown) {
      entities[entity].x -= 1;
    }
    if (entities[entity].rightdown) {
      entities[entity].x += 1;
    }
    var condition = false;
    for (var i = 0; i < platforms.length; i++) {
      if ((entities[entity].x > platforms[i].x) && (entities[entity].x < (platforms[i].x + 83)) && (entities[entity].y > platforms[i].y) && (entities[entity].y < (platforms[i].y + 9))) {
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
  }
}
setInterval(function() {
  process.stdout.write('TPS: ' + tps + '\r');
  tps = 0;
}, 1000);
setInterval(loop, 1000 / parseInt(process.argv[3]));
}
