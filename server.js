var net = require('net');

var clients = {};
var server = net.createServer(function(c) { //'connection' listener

  var name = null;
  c.on('end', function() {
    if (name) {
      delete clients[name];
    }
  });
  c.on('data', function (data) {
    var obj = JSON.parse(data);
    if (obj.opt == 'login') {
      name = obj.name;
      clients[name] = c;
      var users = [];
      for (var key in clients) {
        if (key != name) {
          users.push(key);
        }
      }
      c.write(JSON.stringify({ opt:'users', users: users}));
    } else if (obj.opt == 'message') {
      var to = obj.to;
      if (!(to in clients)) {
        c.write(JSON.stringify({opt: 'error', msg: to + '不在线了！'}));
      } else {
        clients[to].write({opt: 'message', msg: obj.msg, from: name });
      }
    }
  });

});
server.listen(8124, function() { //'listening' listener
  console.log('server bound');
});