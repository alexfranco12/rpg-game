class PlayerState {
  constructor() {
    this.team = {};
    this.lineup = [];
    this.items = [];
    this.storyFlags = {};
  }
}

window.playerState = new PlayerState();