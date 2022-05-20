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
var lennetServer = 'throbots.ddns.net';
      function player1() {
        if ($('#dedicated').checked) {
          document.location.href = 'game.html?name=' + $('#name').value + '&player=0&address=' + $('#address').value;
        }
        else {
          document.location.href = 'game.html?name=' + $('#name').value + '&player=0&address=' + lennetServer + ':65' + $('#address').value;
        }
      }
      function player2() {
       if ($('#dedicated').checked) {
          document.location.href = 'game.html?name=' + $('#name').value + '&player=1&address=' + $('#address').value;
        }
        else {
          document.location.href = 'game.html?name=' + $('#name').value + '&player=1&address=' + lennetServer + ':65' + $('#address').value;
        }
      }
      function player3() {
        if ($('#dedicated').checked) {
          document.location.href = 'game.html?name=' + $('#name').value + '&player=2&address=' + $('#address').value;
        }
        else {
          document.location.href = 'game.html?name=' + $('#name').value + '&player=2&address=' + lennetServer + ':65' + $('#address').value;
        }
      }
      function player4() {
        if ($('#dedicated').checked) {
          document.location.href = 'game.html?name=' + $('#name').value + '&player=3&address=' + $('#address').value;
        }
        else {
          document.location.href = 'game.html?name=' + $('#name').value + '&player=3&address=' + lennetServer + ':65' + $('#address').value;
        }
      }
      $('#dedicated').onclick = function() {
        if ($('#dedicated').checked) {
          $('#address').placeholder = 'Address';
        }
        else {
          $('#address').placeholder = 'Lobby ID';
        }
      }
      function newGame() {
        request('http://' + lennetServer + ':25568/getlennetlobbyid', function(data) {
          alert('Lobby ID to join: ' + data);
        });
      }
      var ngui = require('nw.gui');
      var nwin = ngui.Window.get();
      document.onkeydown = function(event) {
        if (event.code == 'F11') {
          nwin.toggleFullscreen();
        }
      }