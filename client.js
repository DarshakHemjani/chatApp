const net = require('net');

const client = new net.Socket();

client.connect(8000, '127.0.0.1', () => {
  console.log('Connected to the server');
});

client.on('data', data => {
  console.log(data.toString());
});

process.stdin.on('data', data => {
  const message = data.toString().trim();
  if (message) {
    client.write(message);
  }
});

client.on('close', () => {
  console.log('Connection to the server closed');
});
