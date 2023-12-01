const net = require('net');

const clients = [];

const server = net.createServer(socket => {
  const username = `User${clients.length + 1}`;
  clients.push({ socket, username });

  const broadcastMessage = (sender, message) => {
    // console.log("sender",sender);
    clients.forEach(client => {
      if (client !== sender) {
        client.socket.write(`${client.username}: ${message}`);
      }
    });
  };

  broadcastMessage(socket, `${username} has joined the chat.`);

  socket.on('data', data => {
    const message = data.toString().trim();
    if (message) {
      broadcastMessage(socket, message);
    }
  });
  
  socket.on('error', err => {
    if (socket.username) {
    //   console.error(`Client ${socket.username} (${socket.remoteAddress}:${socket.remotePort}) disconnected.`);
    } else {
    //   console.error(`Unknown client disconnected. Error: ${err.message}`);
    }
  });
  
  socket.on('close', () => {
    const index = clients.findIndex(client => client.socket === socket);
    if (index !== -1) {
      const disconnectedUser = clients.splice(index, 1)[0];
      broadcastMessage(socket, `${disconnectedUser.username} has left the chat.`);
    }
  });

  
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
