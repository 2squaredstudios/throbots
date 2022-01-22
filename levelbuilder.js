var fs = require('fs');
var ctx = $('#canvas').getContext('2d');
var platforms = [];
var entities = {};
var rect = $('#canvas').getBoundingClientRect();
var background = new Image();
var platform = new Image();
var mousepos = {x: 0, y: 0};
background.src = 'images/' + $('input[name="theme"]:checked').value + '.png';
platform.src = 'images/' + $('input[name="theme"]:checked').value + 'platform.png';
background.onload = function() {
  ctx.drawImage(background, 0, 0);
  ctx.drawImage(background, 200, 0);
  ctx.drawImage(background, 400, 0);
  ctx.drawImage(background, 600, 0);
  ctx.drawImage(background, 800, 0);
}
setInterval(function() {
  if (!background.src.includes($('input[name="theme"]:checked').value)) {
    background.src = 'images/' + $('input[name="theme"]:checked').value + '.png';
    platform.src = 'images/' + $('input[name="theme"]:checked').value + 'platform.png';
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
  ctx.drawImage(platform, mousepos.x, mousepos.y);
});
document.onmousemove = function(event) {
  mousepos = {x: (event.clientX - rect.left) / 2, y: (event.clientY - rect.top) / 2};
}
$('#canvas').onclick = function(event) {
  platforms.push({x: Math.round((event.clientX - rect.left) / 2), y: Math.round((event.clientY - rect.top) / 2)});
}
function save() {
  fs.writeFile(prompt('Enter world file'), JSON.stringify({title: $('#name').value, entities: entities, platforms: platforms, theme: $('input[name="theme"]:checked').value}), function(err) {
    if (err) {
      alert('Error writing file!');
    }
    else {
      alert('File saved!');
    }
  });
}
function load() {
  fs.readFile(prompt('Enter world file'), function(err, data) {
    if (err) {
      alert('Error reading file!');
    }
    else {
      var level = JSON.parse(data);
      $('input[value="' + level.theme + '"]').checked = true;
      platforms = level.platforms;
      entities = level.entities;
      $('#name').value = level.title;
      alert('File loaded!');
    }
  });
}
