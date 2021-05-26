function joinNs(endpoint) {
  if (nsSocket) {
    nsSocket.close();
    document.querySelector('#user-input').removeEventListener('submit', formSubmission);
  }

  nsSocket = io(`http://localhost:9000${endpoint}`);

  nsSocket.on('nsRoomLoad', (nsRooms) => {
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';
    nsRooms.forEach((room) => {
      let glyph;
      room.isPrivateRoom ? (glyph = 'lock') : (glyph = 'globe');
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.title}</li>`;
    });

    Array.from(document.getElementsByClassName('room')).forEach((e) => {
      e.addEventListener('click', (event) => {
        joinRoom(event.target.innerText);
      });
    });
  });

  document.querySelector('.message-form').addEventListener('submit', formSubmission);

  nsSocket.on('messageToClients', (message) => {
    document.querySelector('#messages').innerHTML += buildListHtml(message);
  });

  function formSubmission(event) {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('messageToServer', { text: newMessage });
  }
}

function buildListHtml(msg) {
  return `
  <li>
  <div class="user-image">
    <img src="${msg.avatar}" />
  </div>
  <div class="user-message">
    <div class="user-name-time">${msg.username} <span>${msg.time}</span></div>
    <div class="message-text">${msg.text}</div>
  </div>
</li>`;
}
