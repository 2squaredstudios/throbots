// global variables
var searchParams = new URL(document.location.href).searchParams;
var player = parseInt(searchParams.get('player'));
var address = searchParams.get('address');
var name = searchParams.get('name');
var ctx = $('#canvas').getContext('2d');
var fs = require('fs');
var dead = false;
var runScript = require('./speech.js');
var speechBox = '';
var theme = '';
var themesong = new Audio();
var images = {};
var fpscounter = 0;
var showFps = false;
var fps = 0;
var fpslimit = 1000 / 60;
var platforms = [];
var entities = {};
var entityFrames = {};
var leftDown = false;
var rightDown = false;
var buttons = [];
// resize canvas
var ngui = require('nw.gui');
var nwin = ngui.Window.get();
var animationFrame = 0;
$('#canvas').style.width = window.innerWidth.toString() + 'px';
$('#canvas').style.height = window.innerHeight.toString() + 'px';
$('#canvas').width = Math.round(window.innerWidth / 5);
$('#canvas').height = Math.round(window.innerHeight / 5);
window.onresize = function() {
  $('#canvas').style.width = window.innerWidth.toString() + 'px';
  $('#canvas').style.height = window.innerHeight.toString() + 'px';
  $('#canvas').width = Math.round(window.innerWidth / 5);
  $('#canvas').height = Math.round(window.innerHeight / 5);
}
// function for loading images
function loadImage(image) {
  images[image] = new Image();
  images[image].src = 'images/' + image + '.png';
}
// loading screen
loadImage('loading');
images['loading'].onload = function() {
  ctx.drawImage(images['loading'], 0, 0);
}
// load image assets
loadImage('dead');
loadImage('deadtext');
for (var i = 0; i < 4; i++) {
  entityFrames['player' + i + '/still'] = 1;
  entityFrames['player' + i + '/jump'] = 1;
  entityFrames['player' + i + '/crouch'] = 1;
  loadImage('player' + i + '/still0');
  loadImage('player' + i + '/jump0');
  loadImage('player' + i + '/crouch0');
  if (i == 0) {
    entityFrames['player' + i + '/left'] = 3;
    entityFrames['player' + i + '/right'] = 3;
    for (var j = 0; j < 3; j++) {
      loadImage('player' + i + '/left' + j);
      loadImage('player' + i + '/right' + j);
    }
  }
  else {
    entityFrames['player' + i + '/left'] = 2;
    entityFrames['player' + i + '/right'] = 2;
    for (var j = 0; j < 2; j++) {
      loadImage('player' + i + '/left' + j);
      loadImage('player' + i + '/right' + j);
    }
  }
}
loadImage('box0');
loadImage('box1');
loadImage('box2');
entityFrames['box'] = 3;
// join game
request('http://' + address + '/join?entity=' + name + '&player=' + player, function(data) {
  if (data == 'entity already exists') {
    alert('There is already a player with name ' + name + '!');
    document.location.href = 'index.html';
  }
  else {
    theme = data;
    // load theme-specific assets
    loadImage(theme);
    loadImage(theme + 'platform');
    loadImage(theme + 'enemyleft');
    loadImage(theme + 'enemyright');
    themesong.src = 'audio/' + theme + '.wav';
    themesong.loop = true;
    themesong.play();
    images[theme].onload = function() {
      // inital fetch
      fetchloop(function() {
        // start fetch loop
      setInterval(fetchloop, 1000 / 30);
      // start game loop
      gameloop = setInterval(loop, fpslimit);
      // start animation loop
      setInterval(function() {
        animationFrame++;
      }, 125);
      });
    }
  }
});
// game loop
function loop() {
  if (entities.hasOwnProperty(name)) {
    // client-side prediction
    if (leftDown) {
      entities[name].x--;
    }
    if (rightDown) {
      entities[name].x++;
    }
    // increment fps counter
    fpscounter++;
    // draw background
    ctx.drawImage(images[theme], 0, 0);
    ctx.drawImage(images[theme], 200, 0);
    ctx.drawImage(images[theme], 0, 200);
    ctx.drawImage(images[theme], 200, 200);
    // draw speech
    var textLines = speechBox.split('\n');
    var textY = 10;
    for (var i = 0; i < textLines.length; i++) {
      ctx.fillText(textLines[i], 5, textY);
      textY += 10;
    }
    // draw platforms
    for (var i = 0; i < platforms.length; i++) {
      ctx.drawImage(images[theme + 'platform'], Math.round(platforms[i].x - entities[name].x + (window.innerWidth / 10) + 14), Math.round(platforms[i].y));
    }
    // draw entities and nametags
    for (var entity in entities) {
      ctx.drawImage(images[entities[entity].frame + (animationFrame % entityFrames[entities[entity].frame])], Math.round((entities[entity].x - entities[name].x) + (window.innerWidth / 10)), Math.round(entities[entity].y - 34));
      ctx.fillText(entity, Math.round((entities[entity].x - entities[name].x) + (window.innerWidth / 10)), Math.round(entities[entity].y - 34));
    }
    // draw FPS indicator if wanted
    if (showFps) {
      ctx.fillText('FPS: ' + fps, 10, 10);
    }
  }
  // if we died or got kicked
  else {
    // stop the game from running
    clearInterval(gameloop);
    // display red background
    ctx.drawImage(images['dead'], 0, 0);
    // stop theme song
    themesong.pause();
    // wait 1 second
    setTimeout(function() {
      // display death message
      ctx.drawImage(images['deadtext'], (window.innerWidth / 10) - 70, window.innerHeight / 10);
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
  request('http://' + address + '/getentities', function(data) {
    entities = JSON.parse(data);
    try {
      fetched();
    }
    catch(err){}
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
  if (event.code == 'KeyW') {
    request('http://' + address + '/jump?entity=' + name, function() {});
  }
  if (event.code == 'KeyA') {
    leftDown = true;
    request('http://' + address + '/leftdown?entity=' + name, function() {});
  }
  if (event.code == 'KeyD') {
    rightDown = true;
    request('http://' + address + '/rightdown?entity=' + name, function() {});
  }
  if (event.code == 'KeyS') {
    request('http://' + address + '/crouchdown?entity=' + name, function() {});
  }
  }
}
document.onkeyup = function(event) {
  if (event.code == 'KeyA') {
    leftDown = false;
    request('http://' + address + '/leftup?entity=' + name, function() {});
  }
  if (event.code == 'KeyD') {
    rightDown = false;
    request('http://' + address + '/rightup?entity=' + name, function() {});
  }
  if (event.code == 'KeyS') {
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
// throw nearest entity on click
$('#canvas').onclick = function(event) {
  var rect = $('#canvas').getBoundingClientRect();
  var clickX = Math.floor(((event.clientX - rect.left) - (window.innerWidth / 2)) / 50);
  var clickY = Math.floor(((event.clientY - rect.top) - (window.innerHeight / 2)) / 50);
  request('http://' + address + '/throw?entity=' + name + '&x=' + clickX + '&y=' + clickY, function() {});
}
// fps management
setInterval(function() {
  fps = fpscounter;
  fpscounter = 0;
}, 1000);
$('#fpslimiter').oninput = function() {
  if ($('#fpslimiter').value == 301) {
    $('#maxfps').innerHTML = 'Unlimited';
    fpslimit = 0;
  }
  else {
    $('#maxfps').innerHTML = $('#fpslimiter').value;
    fpslimit = 1000 / parseInt($('#fpslimiter').value);
  }
  clearInterval(gameloop);
  gameloop = setInterval(loop, fpslimit);
}