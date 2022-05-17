var find = require('local-devices');
var isPortReachable = require('is-port-reachable');
var cp = require('child_process');

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
function joinGame1(address) {
  $('#dedicated').checked = true;
  $('#address').value = address;
  player1();
}
function joinGame2(address) {
  $('#dedicated').checked = true;
  $('#address').value = address;
  player2();
}
function joinGame3(address) {
  $('#dedicated').checked = true;
  $('#address').value = address;
  player3();
}
function joinGame4(address) {
  $('#dedicated').checked = true;
  $('#address').value = address;
  player4();
}