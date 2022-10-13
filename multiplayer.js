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
$('#dedicated').onclick = function () {
  if ($('#dedicated').checked) {
    $('#address').placeholder = 'Address';
  }
  else {
    $('#address').placeholder = 'Lobby ID';
  }
}
function newGame1() {
  request('http://' + lennetServer + ':25568/getlennetlobbyid', function (data) {
    alert('Lobby ID to join: ' + data + '\nShare it with your friends!');
    document.location.href = 'game.html?name=' + $('#name').value + '&player=0&address=' + lennetServer + ':65' + data;
  });
}
function newGame2() {
  request('http://' + lennetServer + ':25568/getlennetlobbyid', function (data) {
    alert('Lobby ID to join: ' + data + '\nShare it with your friends!');
    document.location.href = 'game.html?name=' + $('#name').value + '&player=1&address=' + lennetServer + ':65' + data;
  });
}
function newGame3() {
  request('http://' + lennetServer + ':25568/getlennetlobbyid', function (data) {
    alert('Lobby ID to join: ' + data + '\nShare it with your friends!');
    document.location.href = 'game.html?name=' + $('#name').value + '&player=2&address=' + lennetServer + ':65' + data;
  });
}
function newGame4() {
  request('http://' + lennetServer + ':25568/getlennetlobbyid', function (data) {
    alert('Lobby ID to join: ' + data + '\nShare it with your friends!');
    document.location.href = 'game.html?name=' + $('#name').value + '&player=3&address=' + lennetServer + ':65' + data;
  });
}
var ngui = require('nw.gui');
var nwin = ngui.Window.get();
document.onkeydown = function (event) {
  if (event.code == 'F11') {
    nwin.toggleFullscreen();
  }
}