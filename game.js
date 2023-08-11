// global variables
var searchParams = new URL(document.location.href).searchParams;
var player = parseInt(searchParams.get('player'));
var address = searchParams.get('address');
var name = searchParams.get('name');
var ctx = $('canvas').getContext('2d');
var fs = require('fs');
var dead = false;
var runScript = require('./speech.js');
var speechBox = '';
var theme = '';
var end = {x: 0, y: 0};
var themesong = new Audio();
var images = {};
var fpscounter = 0;
var showFps = false;
var fps = 0;
var platforms = [];
var t = 0;
var oldentities = {};
var newentities = {};
var entities = {};
var entityFrames = {};
var leftDown = false;
var rightDown = false;
var buttons = [];
var animationFrame = 0;
var aiming = false;
var throwX = 0;
var throwY = 0;
// resize canvas
var ngui = require('nw.gui');
var nwin = ngui.Window.get();
function resize() {
  var aspectratio = window.innerWidth / window.innerHeight;
  if (aspectratio > 1.77) {
    $('canvas').style.width = Math.round((window.innerHeight / 9) * 16).toString() + 'px';
    $('canvas').style.height = window.innerHeight.toString() + 'px';
  }
  else {
    $('canvas').style.height = Math.round((window.innerWidth / 16) * 9).toString() + 'px';
    $('canvas').style.width = window.innerWidth.toString() + 'px';
  }
}
resize();
window.onresize = resize;
// function for loading images
function loadImage(image) {
  images[image] = new Image();
  images[image].src = 'images/' + image + '.png';
  return new Promise(function(resolve, reject) {
    images[image].onload = resolve;
    images[image].onerror = reject;
  });
}
// loading screen
loadImage('loading').then(() => {
  ctx.drawImage(images['loading'], 0, 0);
});
// load image assets
function loadImages() {
  var promises = [];
  promises.push(loadImage('dead'));
  promises.push(loadImage('deadtext'));
  for (var i = 0; i < 4; i++) {
    entityFrames['player' + i + '/still'] = 1;
    entityFrames['player' + i + '/jump'] = 1;
    entityFrames['player' + i + '/crouch'] = 1;
    promises.push(loadImage('player' + i + '/still0'));
    promises.push(loadImage('player' + i + '/jump0'));
    promises.push(loadImage('player' + i + '/crouch0'));
    if (i == 0) {
      entityFrames['player' + i + '/left'] = 4;
      entityFrames['player' + i + '/right'] = 4;
      for (var j = 0; j < 4; j++) {
        promises.push(loadImage('player' + i + '/left' + j));
        promises.push(loadImage('player' + i + '/right' + j));
      }
    }
    else {
      entityFrames['player' + i + '/left'] = 2;
      entityFrames['player' + i + '/right'] = 2;
      for (var j = 0; j < 2; j++) {
        promises.push(loadImage('player' + i + '/left' + j));
        promises.push(loadImage('player' + i + '/right' + j));
      }
    }
  }
  for (var i = 0; i < 3; i++) {
    promises.push(loadImage('box' + i));
  }
  entityFrames['box'] = 3;
  return Promise.all(promises);
}
// join game
loadImages().then(function() {
request('http://' + address + '/join?entity=' + name + '&player=' + player + '&width=' + images['player' + player + '/still0'].width + '&height=' + images['player' + player + '/still0'].height, function(data) {
  if (data === undefined) {
    alert('Error connecting to server! (Is it still up?)');
    document.location.href = 'index.html';
  }
  if (data === 'entity already exists') {
    alert('There is already a player with name ' + name + '!');
    document.location.href = 'index.html';
  }
  theme = JSON.parse(data).theme;
  end = JSON.parse(data).end;
  // load theme-specific assets
  var promises = [];
  promises.push(loadImage(theme));
  promises.push(loadImage(theme + 'platform'));
  promises.push(loadImage(theme + 'enemyleft0'));
  promises.push(loadImage(theme + 'enemyright0'));
  promises.push(loadImage(theme + 'enemyleft1'));
  promises.push(loadImage(theme + 'enemyright1'));
  entityFrames[theme + 'enemyleft'] = 2;
  entityFrames[theme + 'enemyright'] = 2;
  promises.push(loadImage(theme + 'end'));
  themesong.src = 'audio/' + theme + '.wav';
  themesong.loop = true;
  themesong.play();
  Promise.all(promises).then(function() {
    // inital fetch
    fetchloop(function() {
      // start fetch loop
      setInterval(fetchloop, 100);
      // start game loop
      requestAnimationFrame(loop);
    });
  });
});
});
// game loop
function loop() {
  if (newentities.hasOwnProperty(name)) {
    ctx.fillStyle = 'dimgray';
    // entity interpolation
    entities = structuredClone(newentities);
    for (var entity in newentities) {
      // case for first fetch
      if (oldentities[entity] !== undefined) {
        if (entity == name && !newentities[entity].thrown && !newentities[entity].pickedup) { // fall back to interpolation if thrown/carried
          // client side prediction for player's x position
          if (leftDown) {
            newentities[name].x--;
          }
          if (rightDown) {
            newentities[name].x++;
          }
        }
        else {
          entities[entity].x = oldentities[entity].x + t * (newentities[entity].x - oldentities[entity].x);
        }
        entities[entity].y = oldentities[entity].y + t * (newentities[entity].y - oldentities[entity].y);
      }
      t += 0.02; // we get this from fetchrate (10 fetches per second) / framerate (60 frames per second)
    }
    // increment fps counter
    fpscounter++;
    // draw background
    ctx.drawImage(images[theme], 0, 0);
    // draw speech
    var textLines = speechBox.split('\n');
    var textY = 10;
    for (var i = 0; i < textLines.length; i++) {
      ctx.fillText(textLines[i], 5, textY);
      textY += 10;
    }
    // draw platforms
    for (var i = 0; i < platforms.length; i++) {
      ctx.drawImage(images[theme + 'platform'], Math.round(platforms[i].x - entities[name].x + 192), Math.round(platforms[i].y - 34));
      // draw hitboxes if requested
      if (showFps) {
        ctx.strokeStyle = 'white';
        ctx.strokeRect(Math.round(platforms[i].x - entities[name].x + 192), Math.round(platforms[i].y - 34), 90, 27);
      }
    }
    // draw entities and nametags
    for (var entity in entities) {
      console.log(entity, entities[entity]);
      ctx.drawImage(images[entities[entity].frame + (animationFrame % entityFrames[entities[entity].frame])], Math.round((entities[entity].x - entities[name].x) + 192), Math.round(entities[entity].y - 34));
      if (entities[entity].player) {
        ctx.fillText(entity, Math.round((entities[entity].x - entities[name].x) + 192), Math.round(entities[entity].y - 34));
      }
      // draw hitboxes if requested
      if (showFps) {
        ctx.strokeStyle = 'white';
        ctx.strokeRect(Math.round((entities[entity].x - entities[name].x) + 192), Math.round(entities[entity].y - 34), entities[entity].width, entities[entity].height);
      }
    }
    // draw end post
    ctx.drawImage(images[theme + 'end'], Math.round(end.x - entities[name].x + 192), Math.round(end.y - 34));
    // draw FPS indicator and end hitbox if wanted
    if (showFps) {
      ctx.fillText('FPS: ' + fps, 10, 10);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(Math.round(end.x - entities[name].x + 192), Math.round(end.y - 34), 50, 200);
    }
    // draw aiming line
    if (aiming) {
      ctx.fillStyle = 'white';
      for (var i = 0; i < 100; i += 1) {
        ctx.fillRect(192 + (throwX / 20 * i), (entities[name].y - 5 - 34) + (throwY / 20 * i) + (0.05 * (i * i)), 1, 1);
      }
    }
    // if someone won
    if (entities[name].hasOwnProperty('winner')) {
      ctx.fillStyle = 'white';
      // display background
      ctx.drawImage(images['dead'], 0, 0);
      // stop theme song
      themesong.pause();
      // wait 1 second
      setTimeout(function() {
        if (entities[name].winner) {
          // we won!
          ctx.fillText('You won!\nPress ESC to disconnect.', 10, 10);
          // play win song
          var winsong = new Audio();
          winsong.src = 'audio/levelend.wav';
          winsong.play();
        }
        else {
          // we lost...
          ctx.fillText('You lost.\nPress ESC to disconnect.', 10, 10);
          // play death song
          var deathsong = new Audio();
          deathsong.src = 'audio/death.wav';
          deathsong.play();
        }
      }, 1000);
    }
    else {
      // draw next frame
      requestAnimationFrame(loop);
    }
  }
  // if we died or got kicked
  else {
    // display background
    ctx.drawImage(images['dead'], 0, 0);
    // stop theme song
    themesong.pause();
    // wait 1 second
    setTimeout(function() {
      // display death message
      ctx.drawImage(images['deadtext'], 122, 108);
      // play death song
      var deathsong = new Audio();
      deathsong.src = 'audio/death.wav';
      deathsong.play();
      dead = true;
    }, 1000);
  }
}
// probe gamepads
setInterval(function() {
  var gamepads = navigator.getGamepads();
  if (gamepads[0]) {
    for (var i = 0; i < gamepads[0].buttons.length; i++) {
      if (!(gamepads[0].buttons[i].pressed == buttons[i])) {
        if (gamepads[0].buttons[i].pressed) {
          buttonDown(i);
        }
        else {
          buttonUp(i);
        }
        buttons[i] = gamepads[0].buttons[i].pressed;
      }
    }
  }
}, 100);
// fetch loop
function fetchloop(fetched) {
  // animation tick
  animationFrame++;
  request('http://' + address + '/getentities', function(data) {
    t = 0;
    oldentities = structuredClone(newentities);
    newentities = JSON.parse(data);
    if (fetched) {
      fetched();
    }
  });
  request('http://' + address + '/getplatforms', function(data) {
    platforms = JSON.parse(data);
  });
}
// keyboard controls
document.onkeydown = function(event) {
  if (!event.repeat) {
  if (event.code == 'KeyO') {
    speechBox = '';
    runScript(JSON.parse(fs.readFileSync('script.json')), function(char) {
      if (char == 'clear') {
        speechBox = '';
      }
      else {
        speechBox += char;
      }
    });
  }
  if (event.code == 'Escape') {
    request('http://' + address + '/leave?entity=' + name, function(data) {
      document.location.href = 'index.html';
    });
    setTimeout(function() {
      document.location.href = 'index.html';
    }, 10000);
  }
  if (event.code == 'Enter') {
    if (dead) {
      location.reload();
    }
  }
  if (event.code == 'F11') {
    nwin.toggleFullscreen();
  }
  if (event.code == 'F3') {
    if (showFps) {
      showFps = false;
    }
    else {
      showFps = true;
    }
  }
  if ((event.code == 'KeyW') || (event.code == 'Space') || (event.code == 'ArrowUp')) {
    request('http://' + address + '/jump?entity=' + name, function() {});
  }
  if (event.code == 'KeyE') {
    request('http://' + address + '/pickup?entity=' + name, function() {});
  }
  if ((event.code == 'KeyA') || (event.code == 'ArrowLeft')) {
    leftDown = true;
    request('http://' + address + '/leftdown?entity=' + name, function() {});
  }
  if ((event.code == 'KeyD') || (event.code == 'ArrowRight')) {
    rightDown = true;
    request('http://' + address + '/rightdown?entity=' + name, function() {});
  }
  if ((event.code == 'KeyS') || (event.code == 'ArrowDown')) {
    request('http://' + address + '/crouchdown?entity=' + name, function() {});
  }
  }
}
document.onkeyup = function(event) {
  if ((event.code == 'KeyA') || (event.code == 'ArrowLeft')) {
    leftDown = false;
    request('http://' + address + '/leftup?entity=' + name, function() {});
  }
  if ((event.code == 'KeyD') || (event.code == 'ArrowRight')) {
    rightDown = false;
    request('http://' + address + '/rightup?entity=' + name, function() {});
  }
  if ((event.code == 'KeyS') || (event.code == 'ArrowDown')) {
    request('http://' + address + '/crouchup?entity=' + name, function() {});
  }
}
// controller controls
function buttonDown(button) {
  if (button == 11) {
    speechBox = '';
    runScript(JSON.parse(fs.readFileSync('script.json')), function(char) {
      if (char == 'clear') {
        speechBox = '';
      }
      else {
        speechBox += char;
      }
    });
  }
  if (button == 9) {
    request('http://' + address + '/leave?entity=' + name, function(data) {
      document.location.href = 'index.html';
    });
    setTimeout(function() {
      document.location.href = 'index.html';
    }, 10000);
  }
  if (button == 5) {
    nwin.toggleFullscreen();
  }
  if (button == 4) {
    if (showFps) {
      showFps = false;
    }
    else {
      showFps = true;
    }
  }
  if (button == 0) {
    if (dead) {
      location.reload();
    }
    else {
      request('http://' + address + '/jump?entity=' + name, function() {});
    }
  }
  if (button == 2) {
    request('http://' + address + '/pickup?entity=' + name, function() {});
  }
  if (button == 14) {
    leftDown = true;
    request('http://' + address + '/leftdown?entity=' + name, function() {});
  }
  if (button == 15) {
    rightDown = true;
    request('http://' + address + '/rightdown?entity=' + name, function() {});
  }
  if (button == 1) {
    request('http://' + address + '/crouchdown?entity=' + name, function() {});
  }
}
function buttonUp(button) {
  if (button == 14) {
    leftDown = false;
    request('http://' + address + '/leftup?entity=' + name, function() {});
  }
  if (button == 15) {
    rightDown = false;
    request('http://' + address + '/rightup?entity=' + name, function() {});
  }
  if (button == 1) {
    request('http://' + address + '/crouchup?entity=' + name, function() {});
  }
}
// display parabola
$('canvas').onmousedown = function() {
  aiming = true;
}
// calculate throw velocities
$('canvas').onmousemove = function(event) {
  var rect = $('canvas').getBoundingClientRect();
  throwX = Math.round(((event.clientX - rect.left) / parseInt($('canvas').style.width)) * 384 - 192);
  throwY = Math.round(((event.clientY - rect.top) / parseInt($('canvas').style.height)) * 216 - 216);
}
// throw nearest entity
$('canvas').onmouseup = function() {
  aiming = false;
  request('http://' + address + '/throw?entity=' + name + '&x=' + throwX + '&y=' + throwY, function() {});
}
// fps management
setInterval(function() {
  fps = fpscounter;
  fpscounter = 0;
}, 1000);