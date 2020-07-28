class Namespace {
  constructor(id, title, image, endpoint) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(roomObj) {
    this.rooms.push(roomObj);
  }
}

module.exports = Namespace;
