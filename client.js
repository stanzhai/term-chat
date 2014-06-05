var net = require('net')
  , eadline = require('readline')
  , colors = require('colors')
  , List = require('term-list')
  , readline = require('readline')
  , ChatLog = require('./chat');

var chatLog = new ChatLog();
var from = ''
  , to = '';

var rl = readline.createInterface({input: process.stdin, output: process.stdout });

function getUsers () {

};
function login () {
  var ask = 'your name:';
  rl.question(ask, function(answer) {
    var info = answer.split(',');
    from = info[0];
    if (info.length != 1) {
      to = info[1];
    }
    client.write(JSON.stringify({ opt: 'login', name: from}));
    chat();
  });
}

function chat() {
  rl.question(from + '->' + (to || 'all') + ':', function(answer) {
    chatLog.write(from + ':' + answer);
    client.write(JSON.stringify({ opt: 'message', from: from, to: to, msg: answer}));
    chat();
  });
}

var client = net.connect({host: 'zhaishidan.cn', port: 8124}, function () {
  client.write(JSON.stringify({ opt: 'users' }));
});

client.on('data', function(data) {
  var obj = JSON.parse(data);
  if (obj.opt == 'users') {
    chatLog.write('current online:');
    for (var i = 0; i < obj.users.length; i++) {
      var user = obj.users[i];
      chatLog.write((i + 1) + '. ' + user.name.green + ' [' + user.ip.red + ']');
    };
    login();
  } else if (obj.opt == 'message') {
    chatLog.write(obj.from + ':' + obj.msg);
  }
});

client.on('end', function() {
  console.log('client disconnected');
});

