var lennet = require('@thecoder08/lennet');
lennet.init(25568, 'screen -d -m -S throbots-instance-%PORT% node server.js %PORT% 60 world.json true');
