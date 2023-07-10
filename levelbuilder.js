var fs = require('fs');
var selection = 'platform';
var ctx = $('#canvas').getContext('2d');
var platforms = [];
var entities = {};
var end = {x: 0, y: 0};
var rect = $('#canvas').getBoundingClientRect();
var entity = new Image();
var background = new Image();
var platform = new Image();
var levelend = new Image();
var mousepos = {x: 0, y: 0};
entity.src = 'images/entitytemplate.png';
background.src = 'images/' + $('input[name="theme"]:checked').value + '.png';
platform.src = 'images/' + $('input[name="theme"]:checked').value + 'platform.png';
levelend.src = 'images/' + $('input[name="theme"]:checked').value + 'end.png';
requestAnimationFrame(loop);
function loop() {
  if (!background.src.includes($('input[name="theme"]:checked').value)) {
    background.src = 'images/' + $('input[name="theme"]:checked').value + '.png';
    platform.src = 'images/' + $('input[name="theme"]:checked').value + 'platform.png';
    levelend.src = 'images/' + $('input[name="theme"]:checked').value + 'end.png';
  }
  ctx.drawImage(background, 0, 0);
  ctx.drawImage(background, 384, 0);
  for (var i = 0; i < platforms.length; i++) {
    ctx.drawImage(platform, platforms[i].x, platforms[i].y);
  }
  for (var entityid in entities) {
    ctx.drawImage(entity, entities[entityid].x, entities[entityid].y);
  }
  try{ctx.drawImage(levelend, end.x, end.y);}catch(e){};
  if (selection == 'platform') {
    ctx.drawImage(platform, mousepos.x, mousepos.y);
  }
  if (selection == 'entity') {
    ctx.drawImage(entity, mousepos.x, mousepos.y);
  }
  if (selection == 'levelend') {
    ctx.drawImage(levelend, mousepos.x, mousepos.y);
  }
  requestAnimationFrame(loop);
};
document.onmousemove = function(event) {
  mousepos = {x: (event.clientX - rect.left) / 2, y: (event.clientY - rect.top) / 2};
}
$('#canvas').onclick = function(event) {
  var clickX = Math.round((event.clientX - rect.left) / 2);
  var clickY = Math.round((event.clientY - rect.top) / 2);
  if (selection == 'platform') {
    platforms.push({x: clickX, y: clickY});
  }
  if (selection == 'entity') {
    entities[prompt('Enter entity name')] = {x: clickX, y: clickY, yvelocity: 0, xvelocity: 0, crouchdown: false, leftdown: false, rightdown: false, frame: prompt('Enter frame'), thrown: false, pickedup: false};
  }
  if (selection == 'levelend') {
    end = {x: clickX, y: clickY};
  }
}
function save() {
  fs.writeFile(prompt('Enter world file'), JSON.stringify({title: $('#name').value, entities: entities, platforms: platforms, theme: $('input[name="theme"]:checked').value, end: end}), function(err) {
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
      end = level.end;
      $('#name').value = level.title;
      alert('File loaded!');
    }
  });
}
