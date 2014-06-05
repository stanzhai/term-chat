var Canvas = require('term-canvas')
  , size = process.stdout.getWindowSize();

var canvas = new Canvas(size[0], size[1] - 1)
  , ctx = canvas.getContext('2d');

process.on('SIGINT', function(){
  ctx.reset();
  process.nextTick(function(){
    process.exit();
  });
});

process.on('SIGWINCH', function(){
  size = process.stdout.getWindowSize();
  canvas.width = size[0];
  canvas.height = size[1] - 1;
});

function ChatLog() {
  this.lines = [];
}

ChatLog.prototype.write = function(line) {
  this.lines.push(line);
  for (var i = 0; i < this.lines.length - canvas.height + 1; i++) {
    this.lines.shift();
  };
  this.draw();
  return this;
};

ChatLog.prototype.draw = function(){
  // clear chat rect region, 
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  var h = canvas.height + 1;
  var w = canvas.width;
  for (var y = 0; y < h; ++y) {
    for (var x = 0; x < w; ++x) {
      ctx.moveTo(0 + x, 0 + y);
      ctx.write('\033[0m ');
    }
  }

  var y = 0;
  ctx.save();

  // lines 
  this.lines.forEach(function(line){
    ctx.fillText(line, 0, y += 1);
  });
  ctx.restore();
  ctx.moveTo(0, canvas.height + 1);
};

module.exports = ChatLog;
