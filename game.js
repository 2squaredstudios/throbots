var ctx = $('#canvas').getContext('2d');
var mike = new Image();
mike.src = 'mike.png';
mike.onload = function() {
  ctx.drawImage(mike, 100, 100);
}
