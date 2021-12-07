class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {}

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;
    
    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = true;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    )
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let obj = this.gameObjects[key];
      obj.id = key;

      // TODO: determine if this object should acually be mounted

      
      obj.mount(this);
    })
  }

  async startCutScene(events) {
    // start a cutscene loop
    this.isCutscenePlaying = true;
    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(obj => {
      obj.doBehaviorEvent(this)
    })
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(obj => {
      return `${obj.x}, ${obj.y}` === `${nextCoords.x}, ${nextCoords.y}`
    })

    if (!this.isCutscenePlaying && match && match.talking.length > 0) {
      this.startCutScene(match.talking[0].events)
    }
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x}, ${y}`] || false;
  }

  addWall(x, y) {
    this.walls[`${x}, ${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x}, ${y}`];
  }

  updateWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  StartingRoom: {
    // load in map
    lowerSrc: "/assets/background/StartingRoomLower.png",
    upperSrc: "/assets/background/StartingRoomUpper.png",
    // load in game objects to canvas
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(5),
      }),
      villager: new Person({
        x: utils.withGrid(12),
        y: utils.withGrid(8),
        src: '/assets/actors/characters/Villager/SpriteSheet.png',
        behaviorLoop: [
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "stand", direction: "down", time: 1000},
          {type: "walk", direction: "down"},
          {type: "walk", direction: "down"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "up"},
          {type: "walk", direction: "up"},
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "I'm busy!"},
              {type: "textMessage", text: "Kick rocks.."},
            ]
          }
        ]
      }),
    },
    walls: {
      // walls
      [utils.asGridCoords(5, 2)]: true,
      [utils.asGridCoords(6, 2)]: true,
      [utils.asGridCoords(7, 2)]: true,
      [utils.asGridCoords(8, 2)]: true,
      [utils.asGridCoords(9, 2)]: true,
      [utils.asGridCoords(10, 2)]: true,
      [utils.asGridCoords(11, 2)]: true,
      [utils.asGridCoords(12, 2)]: true,
      [utils.asGridCoords(13, 2)]: true,
      [utils.asGridCoords(14, 2)]: true,
      [utils.asGridCoords(15, 2)]: true,
      [utils.asGridCoords(16, 2)]: true,
      [utils.asGridCoords(16, 3)]: true,
      [utils.asGridCoords(16, 4)]: true,
      [utils.asGridCoords(16, 5)]: true,
      [utils.asGridCoords(16, 6)]: true,
      [utils.asGridCoords(16, 7)]: true,
      [utils.asGridCoords(16, 8)]: true,
      [utils.asGridCoords(16, 9)]: true,
      [utils.asGridCoords(16, 10)]: true,
      [utils.asGridCoords(16, 11)]: true,
      [utils.asGridCoords(15, 11)]: true,
      [utils.asGridCoords(14, 11)]: true,
      [utils.asGridCoords(13, 11)]: true,
      [utils.asGridCoords(12, 11)]: true,
      [utils.asGridCoords(11, 11)]: true,
      [utils.asGridCoords(10, 11)]: true,
      [utils.asGridCoords(9, 11)]: true,
      [utils.asGridCoords(8, 11)]: true,
      [utils.asGridCoords(7, 11)]: true,
      [utils.asGridCoords(6, 11)]: true,
      [utils.asGridCoords(5, 11)]: true,
      [utils.asGridCoords(5, 10)]: true,
      [utils.asGridCoords(5, 9)]: true,
      [utils.asGridCoords(5, 8)]: true,
      [utils.asGridCoords(5, 7)]: true,
      [utils.asGridCoords(5, 6)]: true,
      [utils.asGridCoords(5, 5)]: true,
      [utils.asGridCoords(5, 4)]: true,
      [utils.asGridCoords(5, 3)]: true,

      // objects
      [utils.asGridCoords(6, 3)]: true,
      [utils.asGridCoords(7, 3)]: true,
      [utils.asGridCoords(8, 3)]: true,
      [utils.asGridCoords(15, 4)]: true,
    }
  },
}