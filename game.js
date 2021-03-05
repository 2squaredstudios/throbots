var address = new URL(document.location.href).searchParams.get('address');
var player = parseInt(new URL(document.location.href).searchParams.get('player'));
var ctx = $('#canvas').getContext('2d');
var fpscounter = 0;
var dir = 'right';
var fpslimit = 0;
var mike = new Image();
mike.src = 'player' + player + 'right.png';
var platform = new Image();
platform.src = 'platform.png';
var platforms = [{x: 1000, y: 200}, {x: 600, y: 400}, {x: 200, y: 600}, {x: 0, y: 800}, {x: 200, y: 800}, {x: 400, y: 800}, {x: 600, y: 800}, {x: 800, y: 800}, {x: 1000, y: 800}, {x: 1200, y: 800}];
var x = 101;
var y = 100;
var positions = [];
var yvelocity = 0;
var adown = false;
var ddown = false;
function loop() {
  $('#canvas').width = $('#canvas').width;
  fpscounter++;
  y += yvelocity;
  if (adown) {
    x-= 5;
  }
  if (ddown) {
    x += 5;
  }
  request('http://' + address + '/send?player=' + player + '&x=' + x + '&y=' + y + '&dir=' + dir, function(data) {});
  request('http://' + address + '/get', function(data) {
    positions = JSON.parse(data);
  });
  var condition = false;
  for (var i = 0; i < platforms.length; i++) {
    if ((x > platforms[i].x) && (x < (platforms[i].x + 220)) && (y > platforms[i].y) && (y < (platforms[i].y + 35))) {
      if (yvelocity < 0) {
        yvelocity = 0;
        y = platforms[i].y + 36;
      }
      else {
        condition = true;
        yvelocity = 0;
        y = platforms[i].y + 1;
      }
    }
    ctx.drawImage(platform, platforms[i].x - x + 570, platforms[i].y);
  }
  if (!condition) {
    yvelocity += 0.5;
  }
  for (var i = 0; i < positions.length; i++) {
    mike.src = 'player' + i + positions[i].dir + '.png';
    if (i == player) {
      console.log(positions[i].y);
      ctx.drawImage(mike, 500, positions[i].y - 170);
    }
    else {
      ctx.drawImage(mike, positions[i].x + 500 - positions[player].x, parseInt(positions[i].y) - 170);
    }
  }
  $('#yvelocity').innerHTML = yvelocity;
}
document.onkeydown = function(event) {
  if (Math.floor(yvelocity) == 0) {
    if (event.code == 'KeyW') {
      yvelocity = -20;
    }
  }
  if (event.code == 'KeyA') {
    adown = true;
    dir = 'left';
  }
  if (event.code == 'KeyD') {
    ddown = true;
    dir = 'right';
  }
}
mike.onload = function() {
var gameloop = setInterval(loop, fpslimit);
}
document.onkeyup = function(event) {
  if (event.code == 'KeyA') {
    adown = false;
  }
  if (event.code == 'KeyD') {
    ddown = false;
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
