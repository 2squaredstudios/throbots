var searchParams = new URL(document.location.href).searchParams;
var dedicated = searchParams.get('dedicated') == 'true';
var skin = parseInt(searchParams.get('skin'));
var address = searchParams.get('address');
var name = searchParams.get('name');
var ctx = $('#canvas').getContext('2d');
var testimage = new Image();
testimage.src = 'player0left.png';
var platform = new Image();
platform.src = 'platform.png';
var fpscounter = 0;
var fpslimit = 0;
var platforms = [];
var entities = {};
if (dedicated) {
  request('http://' + address + '/join?entity=' + name, function(data) {});
}
else {
  request('http://localhost:25568/join?lennetlobbyid=' + address + '&entity=' + name, function(data) {
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
        ctx.drawImage(platform, platforms[j].x - entities[entity].x + 570, platforms[j].y);
      }
      ctx.drawImage(testimage, 500, entities[entity].y - 170);
    }
    else {
      ctx.drawImage(testimage, (entities[entity].x - entities[name].x) + 500, entities[entity].y - 170);
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
