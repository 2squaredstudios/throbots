var ctx = $('#canvas').getContext('2d');
var mike = new Image();
var x = 100;
var y = 100;
var ground = 750;
var yvelocity = 0;
var adown = false;
var ddown = false;
mike.src = 'mike.png';
setInterval(function() {
  y -= yvelocity;
  $('#canvas').width = $('#canvas').width;
  ctx.drawImage(mike, x, y);
  if (y > ground) {
    yvelocity = 0;
    y = ground + 1;
  }
  else {
    yvelocity -= 0.5;
  }
  if (adown) {
    x-= 5;
  }
  if (ddown) {
    x += 5;
  }
});
document.onkeydown = function(event) {
  if (yvelocity == 0) {
    if (event.code == 'KeyW') {
      yvelocity = 20;
    }
  }
  if (event.code == 'KeyA') {
    adown = true;
  }
  if (event.code == 'KeyD') {
    ddown = true;
  }
}
document.onkeyup = function(event) {
  if (event.code == 'KeyA') {
    adown = false;
  }
  if (event.code == 'KeyD') {
    ddown = false;
  }
}
