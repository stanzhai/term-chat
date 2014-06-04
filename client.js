var net = require('net')
  , eadline = require('readline')
  , colors = require('colors')
  , List = require('term-list');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var menu = new List({ marker: '>'.red + ' ', markerLength: 2 });
menu.on('keypress', function(key, index) {
  if (key.name === 'return') {
    if (index == -4) {
      open('https://github.com/stanzhai/luoo-down');
    }
    if (index < 0 || isDownloading != -1) {
      return;
    }
  } else if (key.name === 'q') {
    client.end();
    return menu.stop();
  }
});

function login () {
  var ask = '请输入您的昵称：';
  rl.question(ask, function(answer) {
    client.write(JSON.stringify({ opt: 'login', name: answer}));
    rl.close();
  });
}

var client = net.connect({host: 'zhaishidan.cn', port: 8124}, login);

client.on('data', function(data) {
  var obj = JSON.parse(data);
  if (obj.opt == 'users') {
    for (var i = 0; i < obj.users.length; i++) {
      var user = obj.users[i];
      menu.add(i, (i + 1) + '. ' + user.name.green + ' [' + user.ip.red + ']');
    };
  } else if (obj.opt == 'message') {

  }
});
client.on('end', function() {
  console.log('client disconnected');
});

