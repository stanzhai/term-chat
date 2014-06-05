var net = require('net');

var clients = {};
var server = net.createServer(function(c) { //'connection' listener

  var name = null;
  
  c.on('data', function (data) {
    var obj = JSON.parse(data);
    if (obj.opt == 'login') {
      name = obj.name;
      clients[name] = c;
    } else if (obj.opt == 'users') {
      var users = [];
      for (var key in clients) {
        if (key != name) {
          users.push({name: key, ip: clients[key].remoteAddress});
        }
      }
      c.write(JSON.stringify({ opt:'users', users: users}));
    } else if (obj.opt == 'message') {
      var to = obj.to;
      // 没有指定消息接收者，则发送广播消息
      if (!to) {
        for (var key in clients) {
          if (key != name) {
            clients[key].write(JSON.stringify({opt: 'message', msg: obj.msg, from: name }));
          }
        }
      } else if (!(to in clients)) {
        c.write(JSON.stringify({opt: 'error', msg: to + '不在线了！'}));
      } else {
        clients[to].write(JSON.stringify({opt: 'message', msg: obj.msg, from: name }));
      }
    }
  });
  c.on('end', function() {
    if (name) {
      delete clients[name];
    }
  });
  c.on('error', function() {
    if (name) {
      delete clients[name];
    }
  });

});

server.listen(8124, function() { //'listening' listener
  console.log('server bound');
});