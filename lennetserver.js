var lennet = require('@thecoder08/lennet');
lennet.setServerInstance(function(id) {
  console.log('New instance running at ' + id);
  var entities = {};
  var platforms = [{x: 1000, y: 200}, {x: 600, y: 400}, {x: 200, y: 600}, {x: 0, y: 800}, {x: 200, y: 800}, {x: 400, y: 800}, {x: 600, y: 800}, {x: 800, y: 800}, {x: 1000, y: 800}, {x: 1200, y: 800}];
  lennet.registerRequestHandler(id, function(req, res) {
    if (req.pathname == '/join') {
      entities[req.query.entity] = {x: 2, y: 2, yvelocity: 0, leftdown: false, rightdown: false, frame: 'player' + req.query.player + 'left'};
      console.log(req.query.entity + ' joined the game!');
      res(200, 'text/plain', 'joined successfully');
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
});
lennet.init(25568);
