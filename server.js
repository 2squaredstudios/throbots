if (process.argv.length < 5) {
  console.log('Usage:');
  console.log('./server.js [port] [maxtps] [worldfile]');
}
else {
var tps = 0;
// load world file
console.log('Loading...');
var http = require('@thecoder08/http');
var world = require('./' + process.argv[4]);
var entities = world.entities;
var platforms = world.platforms;
// infer box dimensions
for (var entity in entities) {
  if (entity.includes('box')) {
    entities[entity].width = 14;
    entities[entity].height = 14;
  }
}
// run entity scripts (enemy logic)
for (var entity in entities) {
  if (entities[entity].hasOwnProperty('script')) {
    var script = {
      left: function() {
        if (entities.hasOwnProperty(entity)) {
          script.stop();
          entities[entity].leftdown = true;
        }
      },
      right: function() {
        if (entities.hasOwnProperty(entity)) {
          script.stop();
          entities[entity].rightdown = true;
        }
      },
      stop: function() {
        if (entities.hasOwnProperty(entity)) {
          entities[entity].leftdown = false;
          entities[entity].rightdown = false;
          entities[entity].crouchdown = false;
        }
      },
      jump: function() {
        if (entities.hasOwnProperty(entity)) {
          if (Math.floor(entities[entity].yvelocity) == 0) {
            if (entities[entity].crouchdown) {
              return false;
            }
            else {
              entities[entities].yvelocity = -4;
              return true;
            }
          }
          else {
            return false;
          }
        }
      },
      crouch: function() {
        if (entities.hasOwnProperty(entity)) {
          script.stop();
          entities[entity].crouchdown = true;
        }
      },
      setFrame: function(frame) {
        if (entities.hasOwnProperty(entity)) {
          entities[entity].frame = frame;
        }
      }
    }
    eval(entities[entity].script);
  }
}
console.log('Loaded world ' + world.title);
// create server that gets requests from users
http.server(process.argv[2], function(req, res) {
  // join request
  if (req.pathname == '/join') {
    if (entities.hasOwnProperty(req.query.entity)) {
      res(400, 'text/plain', 'entity already exists');
    }
    else {
      entities[req.query.entity] = {x: 20, y: 10, width: parseInt(req.query.width), height: parseInt(req.query.height), yvelocity: 0, xvelocity: 0, crouchdown: false, leftdown: false, rightdown: false, frame: 'player' + req.query.player + '/still', thrown: false, pickedup: false};
      console.log(req.query.entity + ' joined the game!');
      res(200, 'text/plain', JSON.stringify({theme: world.theme, end: world.end}));
    }
  }
  // leave request
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
  // get entities request
  else if (req.pathname == '/getentities') {
    res(200, 'text/plain', JSON.stringify(entities));
  }
  // get platforms request
  else if (req.pathname == '/getplatforms') {
    res(200, 'text/plain', JSON.stringify(platforms));
  }
  // keystokes
  else if (req.pathname == '/leftdown') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].leftdown = true;
      setFrame(req.query.entity, 'left');
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/rightdown') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].rightdown = true;
      setFrame(req.query.entity, 'right');
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/leftup') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].leftdown = false;
      setFrame(req.query.entity, 'still');
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/rightup') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].rightdown = false;
      setFrame(req.query.entity, 'still');
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  // jump
  else if (req.pathname == '/jump') {
    if (entities.hasOwnProperty(req.query.entity)) {
      if (entities[req.query.entity].yvelocity == 0) {
        if (entities[req.query.entity].crouchdown || entities[req.query.entity].pickedup) {
          res(400, 'text/plain', 'could not jump, crouched or picked up');
        }
        else {
          entities[req.query.entity].yvelocity = -4;
          setFrame(req.query.entity, 'jump');
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
  // crouching
  else if (req.pathname == '/crouchdown') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].crouchdown = true;
      setFrame(req.query.entity, 'crouch');
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  else if (req.pathname == '/crouchup') {
    if (entities.hasOwnProperty(req.query.entity)) {
      entities[req.query.entity].crouchdown = false;
      setFrame(req.query.entity, 'still');
      res(200, 'text/plain', 'ok');
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  // throw picked up entity
  else if (req.pathname == '/throw') {
    if (entities.hasOwnProperty(req.query.entity)) {
      if (entities[req.query.entity].crouchdown) {
        res(400, 'text/plain', 'could not throw, crouched');
      }
      else {
        var closest = findPickedEntity(req.query.entity);
        if (closest) {
              entities[closest].yvelocity = parseInt(req.query.y) / 20;
              entities[closest].xvelocity = parseInt(req.query.x) / 20;
              entities[closest].thrown = true;
              entities[closest].pickedup = false;
              entities[closest].picker = '';
              console.log(req.query.entity + ' throwing ' + closest);
              res(200, 'text/plain', 'ok');
        }
        else {
          res(400, 'text/plain', 'no entity picked up');
        }
      }
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  // pick up/drop
  else if (req.pathname == '/pickup') {
    if (entities.hasOwnProperty(req.query.entity)) {
      if (entities[req.query.entity].crouchdown) {
        res(400, 'text/plain', 'could not pick up, crouched');
      }
      else {
        if (entities[req.query.entity].pickedup) {
          res(400, 'text/plain', 'could not pick up, picked up by someone else');
        }
        else {
          var closest = findClosest(req.query.entity);
          if (closest) {
            if (entities[closest].thrown) {
              res(400, 'text/plain', 'being thrown');
            }
            else {
              if (entities[closest].crouchdown) {
                res(400, 'text/plain', 'crouched');
              }
              else {
                if (entities[closest].pickedup) {
                  if (entities[closest].picker == req.query.entity) {
                    console.log(req.query.entity + ' dropping ' + closest);
                    entities[closest].pickedup = false;
                    entities[closest].picker = '';
                  }
                }
                else {
                  console.log(req.query.entity + ' picking up ' + closest);
                  entities[closest].pickedup = true;
                  entities[closest].picker = req.query.entity;
                }
                res(200, 'text/plain', 'ok');
              }
            }
          }
          else {
            res(400, 'text/plain', 'no pickupable entities');
          }
        }
      }
    }
    else {
      res(404, 'text/plain', 'entity not found');
    }
  }
  // if we receive an unknown request, return 404 not found
  else {
    res(404, 'text/plain', '404 not found');
  }
});
// tick loop
function loop() {
  // increment tps counter
  tps++;
  // loop through all entities
  for (var entity in entities) {
    // physics
    entities[entity].x += entities[entity].xvelocity;
    entities[entity].y += entities[entity].yvelocity;
    // you fall if you go below 300
    if (entities[entity].y > 300) {
      delete entities[entity];
      console.log(entity + ' was yeeted off a cliff!');
      continue;
    }
    // move left and right if it's ok to do so
    if (entities[entity].leftdown && !(entities[entity].thrown || entities[entity].crouchdown || entities[entity].pickedup)) {
      entities[entity].x--;
    }
    if (entities[entity].rightdown && !(entities[entity].thrown || entities[entity].crouchdown || entities[entity].pickedup)) {
      entities[entity].x++;
    }
    // collision detection
    var touchingPlatform = false;
    for (var i = 0; i < platforms.length; i++) {
      if (collide(entities[entity], platforms[i])) {
        entities[entity].thrown = false;
        entities[entity].xvelocity = 0;
        touchingPlatform = true;
        if (entities[entity].crouchdown) {
          setFrame(entity, 'crouch');
        }
        else if (entities[entity].rightdown) {
          setFrame(entity, 'right');
        }
        else if (entities[entity].leftdown) {
          setFrame(entity, 'left');
        }
        else {
          setFrame(entity, 'still');
        }
        // if we hit our head
        if (entities[entity].yvelocity < 0) {
          entities[entity].y = platforms[i].y + 27;
        }
        // if we were falling
        else {
          entities[entity].y = platforms[i].y - entities[entity].height;
        }
        entities[entity].yvelocity = 0;
        break;
      }
    }
    // gravity
    if (!touchingPlatform && !entities[entity].pickedup) {
      entities[entity].yvelocity += 0.1;
    }
    // hover if picked up
    if (entities[entity].pickedup) {
      if (entities.hasOwnProperty(entities[entity].picker)) {
        entities[entity].x = entities[entities[entity].picker].x;
        entities[entity].y = entities[entities[entity].picker].y - 5;
      }
    }
    // win condition
    if (collideEnd(entities[entity], world.end)) {
      for (var otherentity in entities) {
        entities[otherentity].winner = false;
      }
      entities[entity].winner = true;
      clearInterval(loopInterval);
      console.log(entity + ' won, restart server.');
    }
  }
}
// interval controllers
setInterval(function() {
  process.stdout.write('TPS: ' + tps + '\r');
  tps = 0;
}, 1000);
var loopInterval = setInterval(loop, 1000 / parseInt(process.argv[3]));
// kicking
process.stdin.on('data', function(data) {
  var kickee = data.toString().split('\n')[0];
  if (entities.hasOwnProperty(kickee)) {
    delete entities[kickee];
    console.log(kickee + ' was kicked from the server!');
  }
  else {
    console.log('could not kick player ' + kickee + ', no player found');
  }
});
}
// setFrame function
function setFrame(entity, frame) {
  if (entities[entity].frame.includes('player0/')) {
    entities[entity].frame = 'player0/' + frame;
  }
  if (entities[entity].frame.includes('player1/')) {
    entities[entity].frame = 'player1/' + frame;
  }
  if (entities[entity].frame.includes('player2/')) {
    entities[entity].frame = 'player2/' + frame;
  }
  if (entities[entity].frame.includes('player3/')) {
    entities[entity].frame = 'player3/' + frame;
  }
}
// find closest entity
function findClosest(me) {
  var distances = [];
  var names = [];
  for (var entity in entities) {
    var distance = Math.hypot(entities[entity].x - entities[me].x, entities[entity].y - entities[me].y);
    if ((entity != me) && distance < 50) {
      names.push(entity);
      distances.push(distance);
    }
  }
  if (distances.length > 0) {
    return names[distances.indexOf(Math.min(...distances))];
  }
  else {
    return "";
  }
}
// find entity that is being picked up
function findPickedEntity(me) {
  for (var entity in entities) {
    if (entities[entity].picker == me) {
      return entity;
    }
  }
}
// collision detection
function collide(obj1, obj2) {
  return obj1.x < obj2.x + 90 &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + 27 &&
         obj1.y + obj1.height > obj2.y - 1;
}
// collision detection with end post
function collideEnd(obj1, obj2) {
  return obj1.x < obj2.x + 50 &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + 200 &&
         obj1.y + obj1.height > obj2.y;
}