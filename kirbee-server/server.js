let connectCounter = 0;
let tooSoon = true;

const io = require('socket.io')(3006, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', function(socket) {
  console.log('client connect - ', socket.id);
  connectCounter++;
  console.log(connectCounter);
  io.sockets.emit('p', connectCounter);
  if(connectCounter === 2) socket.emit('player 2');
  if(connectCounter === 1) socket.emit('player 1');

  socket.on('reconnect', (attemptNumber) => {
    console.log('client reconnect - ', socket.id);
  });

  socket.on('disconnect', () => {
    connectCounter--
    console.log(connectCounter);
    console.log('client disconnect - ', socket.id);
    io.sockets.emit('p', connectCounter);
    socket.broadcast.emit('other player disconnected');
  });

  socket.on('ping', () => {
    console.log('ping received');
    socket.emit('pong');
  });

  socket.on('play', () => {
    tooSoon = true;
    const min = 3;
    const max = 10;
    const rand = Math.floor(Math.random() * (max - min + 1) + min); //Generate Random number between 5 - 10
    console.log('Wait for ' + rand + ' seconds');
    setTimeout(myFunction, rand * 1000);
    tooSoon = false;
    io.sockets.emit('!');
  })

  socket.on('slash', () => {
      if(tooSoon) {
        socket.emit('ToSoonLose');
        socket.broadcast.emit('ToSoonWin');
      } else {
        socket.emit('Win')
        socket.broadcast.emit('Lose');
      }
  })

});
