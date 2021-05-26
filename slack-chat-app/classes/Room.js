class Room {
  constructor(id, title, namespace, isPrivateRoom = false) {
    this.id = id;
    this.title = title;
    this.namespace = namespace;
    this.isPrivateRoom = isPrivateRoom;
    this.history = [];
  }

  addMessage(message) {
    this.history.push(message);
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;
