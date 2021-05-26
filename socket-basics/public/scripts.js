const socketMain = io('http://localhost:9000');
const socketAdmin = io('http://localhost:9000/admin');

socketMain.on('messageToClients', (message) => {
  document.querySelector('#messages').innerHTML += `<li>${message.text}</li>`;
});

socketMain.on('joined', (msg) => {
  console.log(msg);
});

socketAdmin.on('welcome', (msg) => {
  console.log(msg);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socketMain.emit('messageToServer', { text: newMessage });
});
