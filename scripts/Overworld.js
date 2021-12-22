class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  async init() {
    const container = document.querySelector(".game-container")

    // Title Screen
    this.titleScreen = new TitleScreen({
      // progress: this.progress
    });
    const useSaveFile = await this.titleScreen.init(container);

    // game HUD
    // this.hud = new Hud();
    // this.hud.init(container);

    this.startMap(window.OverworldMaps.DOJO);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();
    
    this.startGameLoop();

    // starting cutscene
    // this.map.startCutscene([]);
  };

  startMap(mapConfig, heroInitialState=null) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();

    if (heroInitialState) {
      this.map.gameObjects.hero.x = heroInitialState.x;
      this.map.gameObjects.hero.y = heroInitialState.y;
      this.map.gameObjects.hero.direction = heroInitialState.direction;
    }
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        // hero position has changed
        this.map.checkForFootstepCutscene();
      }
    })
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // determine if there is a person to talk to
      this.map.checkForActionCutscene();
    })

    new KeyPressListener("Escape", () => {
      if (!this.map.isCutscenePlaying) {
        this.map.startCutscene([
          { type: "pause" }
        ])
      }
    })
  }

  startGameLoop() {
    const step = () => {
      // clear canvas after each frame
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

      if (!this.map.isPaused) {
        requestAnimationFrame(() => {
          step();
        });
      };
    };
    step();
  };
}