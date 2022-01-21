var ctx = $('#canvas').getContext('2d');
var platforms = [];
var rect = $('#canvas').getBoundingClientRect();
var background = new Image();
var platform = new Image();
var theme = 'sky';
background.src = 'images/' + theme + '.png';
platform.src = 'images/' + theme + 'platform.png';
background.onload = function() {
  ctx.drawImage(background, 0, 0);
  ctx.drawImage(background, 200, 0);
  ctx.drawImage(background, 400, 0);
  ctx.drawImage(background, 600, 0);
  ctx.drawImage(background, 800, 0);
}
$('#canvas').onmousemove = function(event) {
  if (theme != $('input[name="theme"]:checked').value) {
    theme = $('input[name="theme"]:checked').value;
    background.src = 'images/' + theme + '.png';
    platform.src = 'images/' + theme + 'platform.png';
  }
  $('#canvas').width = $('#canvas').width;
  ctx.drawImage(background, 0, 0);
  ctx.drawImage(background, 200, 0);
  ctx.drawImage(background, 400, 0);
  ctx.drawImage(background, 600, 0);
  ctx.drawImage(background, 800, 0);
  for (var i = 0; i < platforms.length; i++) {
    ctx.drawImage(platform, platforms[i].x, platforms[i].y);
  }
  ctx.drawImage(platform, (event.clientX - rect.left) / 2, (event.clientY - rect.top) / 2);
}
$('#canvas').onclick = function(event) {
  platforms.push({x: Math.round((event.clientX - rect.left) / 2), y: Math.round((event.clientY - rect.top) / 2)});
}
function save() {
  alert(JSON.stringify({title: $('#name').value, platforms: platforms, theme: $('input[name="theme"]:checked').value}));
}
