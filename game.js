var searchParams = new URL(document.location.href).searchParams;
var dedicated = searchParams.get('dedicated') == 'true';
var player = parseInt(searchParams.get('player'));
var address = searchParams.get('address');
var name = searchParams.get('name');
var ctx = $('#canvas').getContext('2d');
var fs = require('fs');
var runScript = require('./speech.js');
var speechBox = '';
var theme = '';
var images = {};
function loadImage(image) {
  images[image] = new Image();
  images[image].src = 'images/' + image + '.png'
}
for (var i = 0; i < 4; i++) {
  loadImage('player' + i + 'left');
  loadImage('player' + i + 'right');
}
for (var i = 0; i < 3; i++) {
  loadImage('box' + i);
}
var fpscounter = 0;
var fpslimit = 0;
var platforms = [];
var entities = {};
function disconnect() {
  if (dedicated) {
    request('http://' + address + '/leave?entity=' + name, function(data) {
      document.location.href = 'index.html';
    });
  }
  else {
    request('http://34.71.49.178:25568/leave?lennetlobbyid=' + address + '&entity=' + name, function(data) {
      document.location.href = 'index.html';
    });
  }
}
if (dedicated) {
  request('http://' + address + '/join?entity=' + name + '&player=' + player, function(data) {
    if (data == 'entity already exists') {
      alert('There is already a player with name ' + name + '!');
      document.location.href = 'index.html';
    }
    else {
      theme = data;
      loadImage(theme);
      loadImage(theme + 'platform');
      loadImage(theme + 'enemyleft');
      loadImage(theme + 'enemyright');
      var themesong = new Audio();
      themesong.src = 'audio/' + theme + '.wav';
      themesong.loop = true;
      themesong.play();
      images[theme].onload = function() {
        gameloop = setInterval(loop, fpslimit);
      }
    }
  });
}
else {
  request('http://34.71.49.178:25568/join?lennetlobbyid=' + address + '&entity=' + name + '&player=' + player, function(data) {
    if (data == '404 lobby ' + address + ' not found') {
      alert('Could not find game: ' + data);
      document.location.href = 'index.html';
    }
    else if (data == 'entity already exists') {
      alert('There is already a player with name ' + name + '!');
      document.location.href = 'index.html';
    }
    else {
      theme = data;
      loadImage(theme);
      loadImage(theme + 'platform');
      loadImage(theme + 'enemyleft');
      loadImage(theme + 'enemyright');
      var themesong = new Audio();
      themesong.src = 'audio/' + theme + '.wav';
      themesong.loop = true;
      themesong.play();
      images[theme].onload = function() {
        gameloop = setInterval(loop, fpslimit);
      }
    }
  });
}
function loop() {
  $('#canvas').width = $('#canvas').width;
  fpscounter++;
  if (dedicated) {
    request('http://' + address + '/getentities', function(data) {
      entities = JSON.parse(data);
    });
    request('http://' + address + '/getplatforms', function(data) {
      platforms = JSON.parse(data);
    });
  }
  else {
    request('http://34.71.49.178:25568/getentities?lennetlobbyid=' + address, function(data) {
      entities = JSON.parse(data);
    });
    request('http://34.71.49.178:25568/getplatforms?lennetlobbyid=' + address, function(data) {
      platforms = JSON.parse(data);
    });
  }
  ctx.drawImage(images[theme], 0, 0);
  var textLines = speechBox.split('\n');
  var textY = 10;
  for (var i = 0; i < textLines.length; i++) {
    ctx.fillText(textLines[i], 5, textY);
    textY += 10;
  }
  for (var i = 0; i < platforms.length; i++) {
    ctx.drawImage(images[theme + 'platform'], platforms[i].x - entities[name].x + 114, platforms[i].y);
  }
  for (var entity in entities) {
    ctx.drawImage(images[entities[entity].frame], (entities[entity].x - entities[name].x) + 100, entities[entity].y - 34);
    ctx.fillText(entity, (entities[entity].x - entities[name].x) + 100, entities[entity].y - 34);
  }
}
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
  if (event.code == 'KeyW') {
    if (dedicated) {
      request('http://' + address + '/jump?entity=' + name, function() {});
    }
    else {
      request('http://34.71.49.178:25568/jump?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
  if (event.code == 'KeyA') {
    if (dedicated) {
      request('http://' + address + '/leftdown?entity=' + name, function() {});
    }
    else {
      request('http://34.71.49.178:25568/leftdown?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
  if (event.code == 'KeyD') {
    if (dedicated) {
      request('http://' + address + '/rightdown?entity=' + name, function() {});
    }
    else {
      request('http://34.71.49.178:25568/rightdown?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
  }
}
document.onkeyup = function(event) {
  if (event.code == 'KeyA') {
    if (dedicated) {
      request('http://' + address + '/leftup?entity=' + name, function() {});
    }
    else {
      request('http://34.71.49.178:25568/leftup?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
  if (event.code == 'KeyD') {
    if (dedicated) {
      request('http://' + address + '/rightup?entity=' + name, function() {});
    }
    else {
      request('http://34.71.49.178:25568/rightup?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
}
setInterval(function() {
  $('#fps').innerHTML = fpscounter;
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
