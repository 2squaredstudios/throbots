var address = new URL(document.location.href).searchParams.get('address');
var player = parseInt(new URL(document.location.href).searchParams.get('player'));
var ctx = $('#canvas').getContext('2d');
var fpscounter = 0;
var dir = 'right';
var fpslimit = 0;
var playerFrames = [
  {
    left: new Image(),
    right: new Image()
  },
  {
    left: new Image(),
    right: new Image()
  },
  {
    left: new Image(),
    right: new Image()
  },
  {
    left: new Image(),
    right: new Image()
  }
]
playerFrames[0].left.src = 'player0left.png';
playerFrames[0].right.src = 'player0right.png';
playerFrames[1].left.src = 'player1left.png';
playerFrames[1].right.src = 'player1right.png';
playerFrames[2].left.src = 'player2left.png';
playerFrames[2].right.src = 'player2right.png';
playerFrames[3].left.src = 'player3left.png';
playerFrames[3].right.src = 'player3right.png';
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
  }
  if (!condition) {
    yvelocity += 0.5;
  }
  for (var i = 0; i < positions.length; i++) {
    if (i == player) {
      for (var j = 0; j < platforms.length; j++) {
        ctx.drawImage(platform, platforms[j].x - positions[i].x + 570, platforms[j].y);
      }
      ctx.drawImage(playerFrames[i][positions[i].dir], 500, positions[i].y - 170);
    }
    else {
      ctx.drawImage(playerFrames[i][positions[i].dir], (positions[i].x - positions[player].x) + 500, positions[i].y - 170);
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
platform.onload = function() {
  gameloop = setInterval(loop, fpslimit);
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
