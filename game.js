var searchParams = new URL(document.location.href).searchParams;
var dedicated = searchParams.get('dedicated') == 'true';
var player = parseInt(searchParams.get('player'));
var address = searchParams.get('address');
var name = searchParams.get('name');
var ctx = $('#canvas').getContext('2d');
var images = {};
for (var i = 0; i < 4; i++) {
  images['player' + i + 'left'] = new Image();
  images['player' + i + 'left'].src = 'player' + i + 'left.png';
  images['player' + i + 'right'] = new Image();
  images['player' + i + 'right'].src = 'player' + i + 'right.png';
}
images['player']
var platform = new Image();
platform.src = 'platform.png';
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
    request('http://localhost:25568/leave?lennetlobbyid=' + address + '&entity=' + name, function(data) {
      document.location.href = 'index.html';
    });
  }
}
if (dedicated) {
  request('http://' + address + '/join?entity=' + name + '&player=' + player, function(data) {});
}
else {
  request('http://localhost:25568/join?lennetlobbyid=' + address + '&entity=' + name + '&player=' + player, function(data) {
    if (data == '404 lobby ' + address + ' not found') {
      alert('Could not find game: ' + data);
      document.location.href = 'index.html';
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
    request('http://localhost:25568/getentities?lennetlobbyid=' + address, function(data) {
      entities = JSON.parse(data);
      console.log(entities);
    });
    request('http://localhost:25568/getplatforms?lennetlobbyid=' + address, function(data) {
      platforms = JSON.parse(data);
    });
  }
  for (var entity in entities) {
    if (entity == name) {
      for (var j = 0; j < platforms.length; j++) {
        ctx.drawImage(platform, platforms[j].x - entities[entity].x + 114, platforms[j].y);
      }
      ctx.drawImage(images[entities[entity].frame], 100, entities[entity].y - 34);
    }
    else {
      ctx.drawImage(images[entities[entity].frame], (entities[entity].x - entities[name].x) + 100, entities[entity].y - 34);
    }
  }
}
document.onkeydown = function(event) {
  if (!event.repeat) {
  if (event.code == 'KeyW') {
    if (dedicated) {
      request('http://' + address + '/jump?entity=' + name, function() {});
    }
    else {
      request('http://localhost:25568/jump?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
  if (event.code == 'KeyA') {
    if (dedicated) {
      request('http://' + address + '/leftdown?entity=' + name, function() {});
    }
    else {
      request('http://localhost:25568/leftdown?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
  if (event.code == 'KeyD') {
    if (dedicated) {
      request('http://' + address + '/rightdown?entity=' + name, function() {});
    }
    else {
      request('http://localhost:25568/rightdown?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
  }
}
platform.onload = function() {
  gameloop = setInterval(loop, fpslimit);
}
document.onkeyup = function(event) {
  if (event.code == 'KeyA') {
    if (dedicated) {
      request('http://' + address + '/leftup?entity=' + name, function() {});
    }
    else {
      request('http://localhost:25568/leftup?lennetlobbyid=' + address + '&entity=' + name, function() {});
    }
  }
  if (event.code == 'KeyD') {
    if (dedicated) {
      request('http://' + address + '/rightup?entity=' + name, function() {});
    }
    else {
      request('http://localhost:25568/rightup?lennetlobbyid=' + address + '&entity=' + name, function() {});
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
