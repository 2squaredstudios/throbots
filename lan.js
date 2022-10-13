var find = require('local-devices');
var isPortReachable = require('is-port-reachable');
async function refresh() {
  $('#games').innerHTML = '';
  $('#status').innerHTML = 'Scanning for LAN games...'
  var addresses = await find();
  for (var i = 0; i < addresses.length; i++) {
    if (await isPortReachable(25500, {host: addresses[i].ip})) {
      $('#games').innerHTML += 'Game on ' + addresses[i].ip + ': <button onclick="joinGame1(\'' + addresses[i].ip + ':25500\');">Red</button><button onclick="joinGame2(\'' + addresses[i].ip + ':25500\');">Yellow</button><button onclick="joinGame3(\'' + addresses[i].ip + ':25500\');">Green</button><button onclick="joinGame4(\'' + addresses[i].ip + ':25500\');">Blue</button><br>';
    }
  }
  if ($('#games').innerHTML == '') {
    $('#status').innerHTML = 'Finished scanning, no games found.';
  }
  else {
    $('#status').innerHTML = 'Finished scanning.';
  }
}
refresh();
function startServer(world, port) {
    process.argv = ['node', 'server.js', port, '60', world];
    require('server.js');
}
function joinGame1(address) {
  document.location.href = 'game.html?name=' + $('#name').value + '&player=0&address=' + address;
}
function joinGame2(address) {
  document.location.href = 'game.html?name=' + $('#name').value + '&player=1&address=' + address;
}
function joinGame3(address) {
  document.location.href = 'game.html?name=' + $('#name').value + '&player=2&address=' + address;
}
function joinGame4(address) {
  document.location.href = 'game.html?name=' + $('#name').value + '&player=3&address=' + address;
}