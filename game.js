var ctx = $('#canvas').getContext('2d');
var fpscounter = 0;
var fpslimit = 0;
var mike = new Image();
mike.src = 'mike2.png';
var platform = new Image();
platform.src = 'platform.png';
var platforms = [{x: 1000, y: 200}, {x: 600, y: 400}, {x: 200, y: 600}, {x: 0, y: 800}, {x: 200, y: 800}, {x: 400, y: 800}, {x: 600, y: 800}, {x: 800, y: 800}, {x: 1000, y: 800}];
var x = 101;
var y = 100;
var yvelocity = 0;
var adown = false;
var ddown = false;
function loop() {
  fpscounter++;
  y += yvelocity;
  $('#canvas').width = $('#canvas').width;
  var condition = false;
  for (var i = 0; i < platforms.length; i++) {
    ctx.drawImage(platform, platforms[i].x - x + 570, platforms[i].y);
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
  ctx.drawImage(mike, 500, y - 150);
  if (adown) {
    x-= 5;
  }
  if (ddown) {
    x += 5;
  }
}
document.onkeydown = function(event) {
  if (yvelocity == 0) {
    if (event.code == 'KeyW') {
      yvelocity = -20;
    }
  }
  if (event.code == 'KeyA') {
    adown = true;
    mike.src = 'mike2.png';
  }
  if (event.code == 'KeyD') {
    ddown = true;
    mike.src = 'mike.png';
  }
}
var gameloop = setInterval(loop, fpslimit);
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
