class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.StartingRoom);
    this.map.mountObjects();

    this.bindActionInput();

    this.directionInput = new DirectionInput();
    this.directionInput.init();
    
    this.startGameLoop();

    this.map.startCutScene([
      {who: "hero", type: "walk", direction: "right"},
      {who: "hero", type: "walk", direction: "right"},
      {who: "hero", type: "walk", direction: "right"},
      {who: "hero", type: "stand", direction: "down", time: 0},
      {who: "villager", type: "walk", direction: "left"},
      {who: "villager", type: "walk", direction: "left"},
      {who: "villager", type: "walk", direction: "up"},
      {who: "villager", type: "walk", direction: "up"},
      {type: "textMessage", text: "Hello World!"},
      {who: "villager", type: "stand", direction: "up", time: 400},
    ]);
  };

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // is there a person to talk to?
      this.map.checkForActionCutscene();
    })
  }

  startGameLoop() {
    const step = () => {
      // clear canvas after each frame
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // establish camera on hero
      const cameraPerson = this.map.gameObjects.hero;

      // update all objects
      Object.values(this.map.gameObjects).forEach(obj => {
        obj.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      })

      // draw lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // draw game objects
      Object.values(this.map.gameObjects).sort((a, b) => {
        return a.y - b.y;
      }).forEach(obj => {
        obj.sprite.draw(this.ctx, cameraPerson)
      })

      // draw upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  };
}