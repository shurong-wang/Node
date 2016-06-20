var net = require('net');

const PORT = 18001;
const HOST = '127.0.0.1';

var app = net.createServer(function(socket){
  console.log('someone connected');

  socket.on('data', function dataHandler(data) {
    console.log(socket.remoteAddress, socket.remotePort, 'send', data.toString());
    socket.write('server received\n');
  });

  socket.on('close', function(){
    console.log(socket.remoteAddress, socket.remotePort, 'disconnected');
  })
});
app.listen(PORT, HOST);

console.log('tcp server running on tcp://', HOST, ':', PORT);