class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {}

    this.width = config.width;
    this.height = config.height;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;
    
    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    // flags
    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    )
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let obj = this.gameObjects[key];
      obj.id = key;
      
      // TODO: reset position of NPC to original spot
      // TODO: determine if this object should acually be mounted
      obj.mount(this);
    })
  }

  async startCutscene(events) {
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
    Object.values(this.gameObjects).forEach(obj => obj.doBehaviorEvent(this))
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x}, ${hero.y}`]
    if (!this.isCutscenePlaying && match) {
      const relevantScenario = match.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(obj => {
      return `${obj.x}, ${obj.y}` === `${nextCoords.x}, ${nextCoords.y}`
    })

    if (!this.isCutscenePlaying && match && match.talking.length > 0) {
      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) { return true }
    else { return this.walls[`${x}, ${y}`] || false; }
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
  Home: {
    // load in map
    lowerSrc: "/assets/background/StartingRoomLower.png",
    upperSrc: "/assets/background/StartingRoomUpper.png",
    // map dimensions
    height: utils.withGrid(14),
    width: utils.withGrid(22),
    // load in game objects to canvas
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(13),
        y: utils.withGrid(5),
      }),
      Royama: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(4),
        src: '/assets/actors/characters/Villager/SpriteSheet.png',
        behaviorLoop: [
          {type: "stand", direction: "up", time: 0},
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "Go enjoy the world!", faceHero: "Royama"},
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

      // doorway
      // [utils.asGridCoords(10, 11)]: true,

      // objects
      [utils.asGridCoords(7, 3)]: true, // bookshelves
      [utils.asGridCoords(8, 3)]: true,
      [utils.asGridCoords(9, 3)]: true,
      [utils.asGridCoords(10, 3)]: true, // open chest
      [utils.asGridCoords(14, 3)]: true, // crate
      [utils.asGridCoords(7, 6)]: true, // chair
      [utils.asGridCoords(8, 6)]: true, // table
      [utils.asGridCoords(9, 6)]: true, // chair
      [utils.asGridCoords(15, 7)]: true, // plant
      [utils.asGridCoords(6, 9)]: true, // vase
    },
    cutsceneSpaces: {
      // [utils.asGridCoords(10, 10)]: [
      //   {
      //     required: ['TALKED_TO_ROYAMA'],
      //     events: []
      //   },
      //   {
      //     events: [
      //       {who: "hero", type: "stand", direction: "up", time: 0},
      //       {who: "Royama", type: "walk", direction: "right"},
      //       {who: "Royama", type: "walk", direction: "right"},
      //       {who: "Royama", type: "walk", direction: "down"},
      //       {
      //         type: "textMessage", 
      //         text: "Hey! Before you head out into town I should explain some things to you."
      //       },
      //       {
      //         type: "textMessage", 
      //         text: "To explore the town, use the 'W', 'A', 'S', and 'D' keys on your keyboard. If you would like to chat to any of the villagers, press 'ENTER' to spark up a conversation. Good luck!"
      //       },
      //       {who: "Royama", type: "walk", direction: "up"},
      //       {who: "Royama", type: "walk", direction: "left"},
      //       {who: "hero", type: "stand", direction: "up", time: 0},
      //       {who: "hero", type: "addStoryFlag", flag: "TALKED_TO_ROYAMA"},
      //     ]
      //   },
      // ],
      [utils.asGridCoords(10, 11)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "Outside",
              x: utils.withGrid(21),
              y: utils.withGrid(3),
              direction: "down"
            },
          ]
        }
      ]
    }
  },
  Outside: {
    // load in map
    lowerSrc: "/assets/background/OutsideLower.png",
    upperSrc: "/assets/background/OutsideUpper.png",
    // map dimensions
    height: utils.withGrid(20),
    width: utils.withGrid(32),
    // load in game objects to canvas
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(21),
        y: utils.withGrid(3),
      }),
      Kenkyusha: new Person({
        x: utils.withGrid(21),
        y: utils.withGrid(8),
        src: '/assets/actors/characters/Villager/SpriteSheet.png',
        behaviorLoop: [
          {type: "stand", direction: "down", time: 2000},
          {type: "stand", direction: "left", time: 3000},
          {type: "stand", direction: "down", time: 2000},
          {type: "stand", direction: "up", time: 1000},
          {type: "stand", direction: "down", time: 1000},
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "Hi! Glad you are finally out and about. You and Hinata were really going at it in practice yesterday. These kimonos are going to need a second wash.", faceHero: "Kenkyusha"},
              {type: "textMessage", text: "Oh.. and I was supposed to let you know your Grandfather is waiting for you at the Dojo. Make sure you go see him.", faceHero: "Kenkyusha"},
            ]
          }
        ]
      }),
      Takashita: new Person({
        x: utils.withGrid(13),
        y: utils.withGrid(8),
        src: '/assets/actors/characters/Villager2/SpriteSheet.png',
        behaviorLoop: [
          {type: "stand", direction: "right", time: 4000},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "stand", direction: "up", time: 1000},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "stand", direction: "up", time: 2000},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "down"},
          {type: "stand", direction: "down", time: 1000},
          {type: "walk", direction: "up"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "I'm busy!", faceHero: "Takashita"},
              {type: "textMessage", text: "Kick rocks.."},
            ]
          }
        ]
      })
    },
    walls: {
      // large gate
      [utils.asGridCoords(0, 18)]: true,
      [utils.asGridCoords(1, 18)]: true,
      [utils.asGridCoords(2, 18)]: true,
      [utils.asGridCoords(3, 18)]: true,
      [utils.asGridCoords(4, 18)]: true,
      [utils.asGridCoords(5, 18)]: true,
      [utils.asGridCoords(6, 18)]: true,
      [utils.asGridCoords(7, 18)]: true,
      [utils.asGridCoords(8, 18)]: true,
      [utils.asGridCoords(9, 18)]: true,
      [utils.asGridCoords(10, 18)]: true,
      [utils.asGridCoords(11, 18)]: true,
      [utils.asGridCoords(12, 18)]: true,
      [utils.asGridCoords(13, 18)]: true,
      [utils.asGridCoords(14, 18)]: true,
      [utils.asGridCoords(15, 18)]: true,
      [utils.asGridCoords(16, 18)]: true,
      [utils.asGridCoords(17, 18)]: true,
      [utils.asGridCoords(18, 18)]: true,
      [utils.asGridCoords(19, 18)]: true,
      [utils.asGridCoords(20, 18)]: true,
      [utils.asGridCoords(21, 18)]: true,
      [utils.asGridCoords(22, 18)]: true,
      [utils.asGridCoords(23, 18)]: true,
      [utils.asGridCoords(24, 18)]: true,
      [utils.asGridCoords(25, 18)]: true,
      [utils.asGridCoords(26, 18)]: true,
      [utils.asGridCoords(27, 18)]: true,
      [utils.asGridCoords(28, 18)]: true,
      [utils.asGridCoords(29, 18)]: true,
      [utils.asGridCoords(30, 18)]: true,
      [utils.asGridCoords(31, 18)]: true,

      // fences
      [utils.asGridCoords(4, 0)]: true,
      [utils.asGridCoords(4, 1)]: true,
      [utils.asGridCoords(4, 2)]: true,
      [utils.asGridCoords(5, 2)]: true,
      [utils.asGridCoords(6, 2)]: true,
      [utils.asGridCoords(7, 2)]: true,
      [utils.asGridCoords(8, 2)]: true,
      [utils.asGridCoords(9, 2)]: true,
      [utils.asGridCoords(10, 2)]: true,
      [utils.asGridCoords(11, 2)]: true,
      [utils.asGridCoords(12, 2)]: true,
      [utils.asGridCoords(13, 2)]: true,

      [utils.asGridCoords(25, 2)]: true,
      [utils.asGridCoords(26, 2)]: true,
      [utils.asGridCoords(27, 2)]: true,
      [utils.asGridCoords(28, 2)]: true,
      [utils.asGridCoords(29, 2)]: true,
      [utils.asGridCoords(30, 2)]: true,
      [utils.asGridCoords(31, 2)]: true,

      [utils.asGridCoords(26, 4)]: true,
      [utils.asGridCoords(27, 4)]: true,
      [utils.asGridCoords(28, 4)]: true,
      [utils.asGridCoords(29, 4)]: true,
      [utils.asGridCoords(30, 4)]: true,
      [utils.asGridCoords(31, 4)]: true,
      [utils.asGridCoords(26, 5)]: true,
      [utils.asGridCoords(25, 5)]: true,
      [utils.asGridCoords(25, 6)]: true,
      [utils.asGridCoords(24, 6)]: true,
      [utils.asGridCoords(24, 7)]: true,
      [utils.asGridCoords(24, 8)]: true,
      [utils.asGridCoords(24, 9)]: true,
      [utils.asGridCoords(25, 9)]: true,
      [utils.asGridCoords(26, 9)]: true,
      [utils.asGridCoords(27, 9)]: true,
      [utils.asGridCoords(28, 9)]: true,
      [utils.asGridCoords(29, 9)]: true,
      [utils.asGridCoords(30, 9)]: true,
      [utils.asGridCoords(31, 9)]: true,

      // houses
      [utils.asGridCoords(14, 1)]: true,
      [utils.asGridCoords(15, 1)]: true,
      [utils.asGridCoords(16, 1)]: true,
      [utils.asGridCoords(17, 1)]: true,
      [utils.asGridCoords(18, 1)]: true,
      [utils.asGridCoords(14, 2)]: true,
      [utils.asGridCoords(15, 2)]: true,
      [utils.asGridCoords(16, 2)]: true, // door
      [utils.asGridCoords(17, 2)]: true,
      [utils.asGridCoords(18, 2)]: true,

      [utils.asGridCoords(20, 1)]: true,
      [utils.asGridCoords(21, 1)]: true,
      [utils.asGridCoords(22, 1)]: true,
      [utils.asGridCoords(23, 1)]: true,
      [utils.asGridCoords(24, 1)]: true,
      [utils.asGridCoords(20, 2)]: true,
      // [utils.asGridCoords(21, 2)]: true, // door
      [utils.asGridCoords(22, 2)]: true,
      [utils.asGridCoords(23, 2)]: true,
      [utils.asGridCoords(24, 2)]: true,

      [utils.asGridCoords(10, 10)]: true,
      [utils.asGridCoords(11, 10)]: true,
      [utils.asGridCoords(12, 10)]: true,
      [utils.asGridCoords(13, 10)]: true,
      [utils.asGridCoords(10, 11)]: true,
      [utils.asGridCoords(11, 11)]: true,
      [utils.asGridCoords(12, 11)]: true,
      [utils.asGridCoords(13, 11)]: true,
      [utils.asGridCoords(10, 12)]: true,
      [utils.asGridCoords(11, 12)]: true,
      [utils.asGridCoords(12, 12)]: true,
      [utils.asGridCoords(13, 12)]: true,

      [utils.asGridCoords(26, 10)]: true,
      [utils.asGridCoords(27, 10)]: true,
      [utils.asGridCoords(28, 10)]: true,
      [utils.asGridCoords(26, 11)]: true,
      [utils.asGridCoords(27, 11)]: true, // door
      [utils.asGridCoords(28, 11)]: true,

      [utils.asGridCoords(21, 16)]: true,
      [utils.asGridCoords(22, 16)]: true,
      [utils.asGridCoords(23, 16)]: true,
      [utils.asGridCoords(24, 16)]: true,
      [utils.asGridCoords(25, 16)]: true,
      [utils.asGridCoords(21, 17)]: true,
      [utils.asGridCoords(22, 17)]: true,
      [utils.asGridCoords(23, 17)]: true,
      [utils.asGridCoords(24, 17)]: true,
      [utils.asGridCoords(25, 17)]: true,

      [utils.asGridCoords(27, 16)]: true,
      [utils.asGridCoords(28, 16)]: true,
      [utils.asGridCoords(29, 16)]: true,
      [utils.asGridCoords(30, 16)]: true,
      [utils.asGridCoords(31, 16)]: true,
      [utils.asGridCoords(27, 17)]: true,
      [utils.asGridCoords(28, 17)]: true,
      [utils.asGridCoords(29, 17)]: true,
      [utils.asGridCoords(30, 17)]: true,
      [utils.asGridCoords(31, 17)]: true,

      // flag
      [utils.asGridCoords(23, 3)]: true,

      // pond
      [utils.asGridCoords(3, 11)]: true,
      [utils.asGridCoords(4, 11)]: true,
      [utils.asGridCoords(5, 11)]: true,
      [utils.asGridCoords(6, 11)]: true,
      [utils.asGridCoords(7, 12)]: true,
      [utils.asGridCoords(3, 12)]: true,
      [utils.asGridCoords(4, 12)]: true,
      [utils.asGridCoords(5, 12)]: true,
      [utils.asGridCoords(6, 12)]: true,
      [utils.asGridCoords(7, 12)]: true,

      // wood tower
      [utils.asGridCoords(1, 15)]: true,
      [utils.asGridCoords(2, 15)]: true,
      [utils.asGridCoords(3, 15)]: true,
      [utils.asGridCoords(1, 14)]: true,
      [utils.asGridCoords(2, 14)]: true,
      [utils.asGridCoords(3, 14)]: true,

      // river
      [utils.asGridCoords(7, 11)]: true,
      [utils.asGridCoords(8, 11)]: true,
      [utils.asGridCoords(9, 11)]: true,
      [utils.asGridCoords(9, 10)]: true,
      [utils.asGridCoords(9, 9)]: true,
      [utils.asGridCoords(10, 9)]: true,
      [utils.asGridCoords(11, 9)]: true,
      [utils.asGridCoords(12, 9)]: true,
      [utils.asGridCoords(13, 9)]: true,
      [utils.asGridCoords(14, 9)]: true,
      [utils.asGridCoords(18, 9)]: true,
      [utils.asGridCoords(19, 9)]: true,
      [utils.asGridCoords(20, 9)]: true,
      [utils.asGridCoords(21, 9)]: true,
      [utils.asGridCoords(22, 9)]: true,
      [utils.asGridCoords(23, 9)]: true,
      [utils.asGridCoords(23, 8)]: true,
      [utils.asGridCoords(23, 7)]: true,
      [utils.asGridCoords(23, 6)]: true,
      [utils.asGridCoords(24, 5)]: true,
      [utils.asGridCoords(25, 4)]: true,
      [utils.asGridCoords(26, 4)]: true,
      [utils.asGridCoords(27, 4)]: true,
      [utils.asGridCoords(28, 4)]: true,
      [utils.asGridCoords(29, 4)]: true,
      [utils.asGridCoords(30, 4)]: true,
      [utils.asGridCoords(30, 3)]: true,
      [utils.asGridCoords(31, 3)]: true,

      // tree line
      [utils.asGridCoords(0, 0)]: true,
      [utils.asGridCoords(1, 0)]: true,
      [utils.asGridCoords(2, 0)]: true,
      [utils.asGridCoords(3, 0)]: true,
      [utils.asGridCoords(0, 1)]: true,
      [utils.asGridCoords(1, 1)]: true,
      [utils.asGridCoords(2, 1)]: true,
      [utils.asGridCoords(0, 2)]: true,
      [utils.asGridCoords(0, 3)]: true,
      [utils.asGridCoords(0, 4)]: true,
      [utils.asGridCoords(0, 5)]: true,
      [utils.asGridCoords(1, 5)]: true,
      [utils.asGridCoords(0, 6)]: true,
      [utils.asGridCoords(0, 7)]: true,
      [utils.asGridCoords(1, 7)]: true,
      [utils.asGridCoords(0, 8)]: true,
      [utils.asGridCoords(0, 9)]: true,
      [utils.asGridCoords(1, 9)]: true,
      [utils.asGridCoords(0, 10)]: true,
      [utils.asGridCoords(0, 11)]: true,
      [utils.asGridCoords(0, 12)]: true,
      [utils.asGridCoords(0, 13)]: true,
      [utils.asGridCoords(0, 14)]: true,
      [utils.asGridCoords(0, 15)]: true,
      [utils.asGridCoords(0, 16)]: true,
      [utils.asGridCoords(0, 17)]: true,
      

      // market
      [utils.asGridCoords(9, 7)]: true,
      [utils.asGridCoords(10, 7)]: true,
      [utils.asGridCoords(11, 7)]: true,
      [utils.asGridCoords(12, 7)]: true,
      [utils.asGridCoords(13, 7)]: true,
      [utils.asGridCoords(14, 7)]: true,
      [utils.asGridCoords(14, 8)]: true,

      // clothes hanger
      [utils.asGridCoords(19, 8)]: true,
      [utils.asGridCoords(20, 8)]: true,
      [utils.asGridCoords(22, 8)]: true,

      // objects
      [utils.asGridCoords(4, 8)]: true, // water well
      [utils.asGridCoords(8, 10)]: true,
      [utils.asGridCoords(22, 6)]: true,
      [utils.asGridCoords(12, 3)]: true,
      [utils.asGridCoords(13, 3)]: true,
      [utils.asGridCoords(17, 3)]: true, // boxes
      [utils.asGridCoords(18, 3)]: true, // boxes
      [utils.asGridCoords(25, 1)]: true, // scarecrow
      [utils.asGridCoords(31, 14)]: true, // stump

    },
    cutsceneSpaces: {
      [utils.asGridCoords(21, 2)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "Home",
              x: utils.withGrid(10),
              y: utils.withGrid(11),
              direction: "up"
            },
          ]
        }
      ],
      [utils.asGridCoords(31, 12)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "OUTSIDE2",
              x: utils.withGrid(0),
              y: utils.withGrid(12),
              direction: "right",
            },
          ]
        }
      ],
      [utils.asGridCoords(31, 13)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "OUTSIDE2",
              x: utils.withGrid(0),
              y: utils.withGrid(13),
              direction: "right",
            },
          ]
        }
      ]
    }
  },
  OUTSIDE2: {
    // load in map
    lowerSrc: "/assets/background/TownCenterLower.png",
    upperSrc: "/assets/background/TownCenterUpper.png",
    // map dimensions
    height: utils.withGrid(20),
    width: utils.withGrid(32),
    // load in game objects to canvas
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(0),
        y: utils.withGrid(12),
      }),
    },
    walls: {
      // houses
      [utils.asGridCoords(18, 1)]: true,
      [utils.asGridCoords(19, 1)]: true,
      [utils.asGridCoords(20, 1)]: true,
      [utils.asGridCoords(21, 1)]: true,
      [utils.asGridCoords(22, 1)]: true,
      [utils.asGridCoords(23, 1)]: true,
      [utils.asGridCoords(18, 2)]: true,
      [utils.asGridCoords(19, 2)]: true,
      // [utils.asGridCoords(20, 2)]: true, // door
      // [utils.asGridCoords(21, 2)]: true, // door
      [utils.asGridCoords(22, 2)]: true,
      [utils.asGridCoords(23, 2)]: true,

      [utils.asGridCoords(0, 3)]: true,
      [utils.asGridCoords(1, 3)]: true,
      [utils.asGridCoords(2, 3)]: true,
      [utils.asGridCoords(3, 3)]: true,
      [utils.asGridCoords(0, 5)]: true,
      [utils.asGridCoords(1, 5)]: true,
      [utils.asGridCoords(2, 5)]: true, // door
      [utils.asGridCoords(3, 5)]: true,

      [utils.asGridCoords(14, 6)]: true,
      [utils.asGridCoords(15, 6)]: true,
      [utils.asGridCoords(16, 6)]: true,
      [utils.asGridCoords(17, 6)]: true,
      [utils.asGridCoords(18, 6)]: true,
      [utils.asGridCoords(14, 7)]: true,
      [utils.asGridCoords(15, 7)]: true,
      [utils.asGridCoords(16, 7)]: true,
      [utils.asGridCoords(17, 7)]: true,
      [utils.asGridCoords(18, 7)]: true,

      [utils.asGridCoords(21, 6)]: true,
      [utils.asGridCoords(22, 6)]: true,
      [utils.asGridCoords(23, 6)]: true,
      [utils.asGridCoords(24, 6)]: true,
      [utils.asGridCoords(21, 7)]: true,
      [utils.asGridCoords(22, 7)]: true, // door
      [utils.asGridCoords(23, 7)]: true,
      [utils.asGridCoords(24, 7)]: true,

      [utils.asGridCoords(26, 6)]: true,
      [utils.asGridCoords(27, 6)]: true,
      [utils.asGridCoords(28, 6)]: true,
      [utils.asGridCoords(26, 7)]: true,
      [utils.asGridCoords(27, 7)]: true,
      [utils.asGridCoords(28, 7)]: true,

      [utils.asGridCoords(16, 10)]: true,
      [utils.asGridCoords(17, 10)]: true,
      [utils.asGridCoords(18, 10)]: true,
      [utils.asGridCoords(16, 11)]: true,
      [utils.asGridCoords(17, 11)]: true,
      [utils.asGridCoords(18, 11)]: true,

      [utils.asGridCoords(26, 10)]: true,
      [utils.asGridCoords(27, 10)]: true,
      [utils.asGridCoords(28, 10)]: true,
      [utils.asGridCoords(29, 10)]: true,
      [utils.asGridCoords(26, 11)]: true,
      [utils.asGridCoords(27, 11)]: true,
      [utils.asGridCoords(28, 11)]: true,
      [utils.asGridCoords(29, 11)]: true,

      // river
      [utils.asGridCoords(0, 3)]: true,
      [utils.asGridCoords(1, 3)]: true,
      [utils.asGridCoords(2, 3)]: true,
      [utils.asGridCoords(0, 4)]: true,
      [utils.asGridCoords(1, 4)]: true,
      [utils.asGridCoords(2, 4)]: true,
      [utils.asGridCoords(3, 2)]: true,
      [utils.asGridCoords(4, 2)]: true,

      // pond
      [utils.asGridCoords(2, 0)]: true,
      [utils.asGridCoords(3, 0)]: true,
      [utils.asGridCoords(4, 0)]: true,
      [utils.asGridCoords(5, 0)]: true,
      [utils.asGridCoords(6, 0)]: true,
      [utils.asGridCoords(2, 1)]: true,
      [utils.asGridCoords(3, 1)]: true,
      [utils.asGridCoords(4, 1)]: true,
      [utils.asGridCoords(5, 1)]: true,
      [utils.asGridCoords(6, 1)]: true,

      // cemetary
      [utils.asGridCoords(6, 7)]: true,
      [utils.asGridCoords(6, 8)]: true,
      [utils.asGridCoords(6, 9)]: true,
      [utils.asGridCoords(6, 10)]: true,
      [utils.asGridCoords(6, 11)]: true,
      [utils.asGridCoords(7, 11)]: true,
      // [utils.asGridCoords(8, 11)]: true, // door
      [utils.asGridCoords(9, 11)]: true,
      [utils.asGridCoords(10, 11)]: true,
      [utils.asGridCoords(7, 7)]: true,
      [utils.asGridCoords(8, 7)]: true,
      [utils.asGridCoords(9, 7)]: true,
      [utils.asGridCoords(10, 7)]: true,
      [utils.asGridCoords(11, 7)]: true,
      [utils.asGridCoords(11, 8)]: true,
      [utils.asGridCoords(11, 9)]: true,
      [utils.asGridCoords(11, 10)]: true,
      [utils.asGridCoords(11, 11)]: true,
      [utils.asGridCoords(8, 8)]: true, // statue
      [utils.asGridCoords(9, 8)]: true, // statue

      // large gate
      [utils.asGridCoords(0, 18)]: true,
      [utils.asGridCoords(1, 18)]: true,
      [utils.asGridCoords(2, 18)]: true,
      [utils.asGridCoords(3, 18)]: true,
      [utils.asGridCoords(4, 18)]: true,
      [utils.asGridCoords(5, 18)]: true,
      [utils.asGridCoords(6, 18)]: true,
      [utils.asGridCoords(7, 18)]: true,
      [utils.asGridCoords(8, 18)]: true,
      [utils.asGridCoords(9, 18)]: true,
      [utils.asGridCoords(10, 18)]: true,
      [utils.asGridCoords(11, 18)]: true,
      [utils.asGridCoords(12, 18)]: true,
      [utils.asGridCoords(13, 18)]: true,
      [utils.asGridCoords(14, 18)]: true,
      [utils.asGridCoords(15, 18)]: true,
      [utils.asGridCoords(16, 18)]: true,
      [utils.asGridCoords(17, 18)]: true,
      [utils.asGridCoords(18, 18)]: true,
      [utils.asGridCoords(19, 18)]: true,
      [utils.asGridCoords(20, 18)]: true,
      [utils.asGridCoords(21, 18)]: true,
      [utils.asGridCoords(22, 18)]: true,
      [utils.asGridCoords(23, 18)]: true,
      [utils.asGridCoords(24, 18)]: true,
      [utils.asGridCoords(25, 18)]: true,
      [utils.asGridCoords(26, 18)]: true,
      [utils.asGridCoords(27, 18)]: true,
      [utils.asGridCoords(28, 18)]: true,
      [utils.asGridCoords(29, 18)]: true,
      [utils.asGridCoords(30, 18)]: true,
      [utils.asGridCoords(30, 0)]: true,
      [utils.asGridCoords(30, 1)]: true,
      [utils.asGridCoords(30, 2)]: true,
      [utils.asGridCoords(30, 3)]: true,
      [utils.asGridCoords(30, 4)]: true,
      [utils.asGridCoords(30, 5)]: true,
      [utils.asGridCoords(30, 6)]: true,
      [utils.asGridCoords(30, 7)]: true,
      [utils.asGridCoords(30, 8)]: true,
      [utils.asGridCoords(30, 9)]: true,
      [utils.asGridCoords(30, 10)]: true,
      [utils.asGridCoords(30, 11)]: true,
      [utils.asGridCoords(30, 12)]: true,
      [utils.asGridCoords(30, 13)]: true,
      [utils.asGridCoords(30, 14)]: true,
      [utils.asGridCoords(30, 15)]: true,
      [utils.asGridCoords(30, 16)]: true,
      [utils.asGridCoords(30, 17)]: true,

      // fences
      [utils.asGridCoords(14, 0)]: true,
      [utils.asGridCoords(14, 1)]: true,
      [utils.asGridCoords(15, 1)]: true,
      [utils.asGridCoords(16, 1)]: true,
      [utils.asGridCoords(17, 1)]: true,
      [utils.asGridCoords(24, 1)]: true,
      [utils.asGridCoords(25, 1)]: true,
      [utils.asGridCoords(26, 1)]: true,
      [utils.asGridCoords(27, 1)]: true,
      [utils.asGridCoords(27, 0)]: true,

      [utils.asGridCoords(0, 9)]: true,
      [utils.asGridCoords(1, 6)]: true,
      [utils.asGridCoords(1, 7)]: true,
      [utils.asGridCoords(1, 8)]: true,
      [utils.asGridCoords(1, 9)]: true,

      // bushes
      [utils.asGridCoords(4, 11)]: true,
      [utils.asGridCoords(5, 11)]: true,
      [utils.asGridCoords(12, 7)]: true,
      [utils.asGridCoords(13, 7)]: true,
      [utils.asGridCoords(28, 0)]: true,
      [utils.asGridCoords(29, 0)]: true,
      [utils.asGridCoords(24, 2)]: true,
      [utils.asGridCoords(9, 0)]: true,
      [utils.asGridCoords(10, 0)]: true,

      // trees
      [utils.asGridCoords(6, 1)]: true,
      [utils.asGridCoords(7, 1)]: true,
      [utils.asGridCoords(8, 1)]: true,
      [utils.asGridCoords(9, 1)]: true,
      [utils.asGridCoords(12, 1)]: true,
      [utils.asGridCoords(13, 1)]: true,
      

      // crates
      [utils.asGridCoords(19, 10)]: true,
      [utils.asGridCoords(20, 10)]: true,
      [utils.asGridCoords(21, 10)]: true,
      [utils.asGridCoords(22, 10)]: true,
      [utils.asGridCoords(22, 11)]: true,
      [utils.asGridCoords(25, 10)]: true,
      [utils.asGridCoords(25, 2)]: true,
      [utils.asGridCoords(26, 2)]: true,
      [utils.asGridCoords(4, 5)]: true,

      // objects
      [utils.asGridCoords(25, 7)]: true, // sign
      [utils.asGridCoords(22, 13)]: true,
      [utils.asGridCoords(19, 14)]: true,
      [utils.asGridCoords(21, 14)]: true,
      [utils.asGridCoords(22, 14)]: true,
      [utils.asGridCoords(15, 10)]: true, // flower
      [utils.asGridCoords(16, 12)]: true, // cart
      [utils.asGridCoords(17, 12)]: true, // cart
      [utils.asGridCoords(12, 6)]: true,
      [utils.asGridCoords(13, 6)]: true,
      [utils.asGridCoords(24, 14)]: true, // twig
      [utils.asGridCoords(27, 16)]: true,
      [utils.asGridCoords(27, 17)]: true,
      [utils.asGridCoords(28, 16)]: true,
      [utils.asGridCoords(29, 16)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoords(20, 2)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "DOJO",
              x: utils.withGrid(10),
              y: utils.withGrid(12),
              direction: "up"
            },
          ]
        }
      ],
      [utils.asGridCoords(21, 2)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "DOJO",
              x: utils.withGrid(11),
              y: utils.withGrid(12),
              direction: "up"
            },
          ]
        }
      ],
      [utils.asGridCoords(0, 12)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "Outside",
              x: utils.withGrid(31),
              y: utils.withGrid(12),
              direction: "left",
            },
          ]
        }
      ],
      [utils.asGridCoords(0, 13)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "Outside",
              x: utils.withGrid(31),
              y: utils.withGrid(13),
              direction: "left",
            },
          ]
        }
      ],
    }
  },
  DOJO: {
    // load in map
    lowerSrc: "/assets/background/DojoLower.png",
    upperSrc: "/assets/background/DojoUpper.png",
    // map dimensions
    height: utils.withGrid(14),
    width: utils.withGrid(22),
    // load in game objects to canvas
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(13),
        y: utils.withGrid(5),
      }),
      Amaya: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(6),
        src: '/assets/actors/characters/OldMan3/SpriteSheet.png',
        behaviorLoop: [
          {type: "stand", direction: "down", time: 1000},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "down"},
          {type: "stand", direction: "down", time: 5000},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "up"},
          {type: "stand", direction: "up", time: 6000},
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "Hi!", faceHero: "Amaya"},
            ]
          }
        ]
      }),
    },
    walls: {
      [utils.asGridCoords(1, 1)]: true,
      [utils.asGridCoords(2, 1)]: true,
      [utils.asGridCoords(3, 1)]: true,
      [utils.asGridCoords(4, 1)]: true,
      [utils.asGridCoords(5, 1)]: true,
      [utils.asGridCoords(6, 1)]: true,
      [utils.asGridCoords(7, 1)]: true,
      [utils.asGridCoords(8, 1)]: true,
      [utils.asGridCoords(9, 1)]: true,
      [utils.asGridCoords(10, 1)]: true,
      [utils.asGridCoords(11, 1)]: true,
      [utils.asGridCoords(12, 1)]: true,
      [utils.asGridCoords(13, 1)]: true,
      [utils.asGridCoords(14, 1)]: true,
      [utils.asGridCoords(15, 1)]: true,
      [utils.asGridCoords(16, 1)]: true,
      [utils.asGridCoords(17, 1)]: true,
      [utils.asGridCoords(18, 1)]: true,
      [utils.asGridCoords(19, 1)]: true,
      [utils.asGridCoords(20, 1)]: true,
      [utils.asGridCoords(20, 2)]: true,
      [utils.asGridCoords(20, 3)]: true,
      [utils.asGridCoords(20, 4)]: true,
      [utils.asGridCoords(20, 5)]: true,
      [utils.asGridCoords(20, 6)]: true,
      [utils.asGridCoords(20, 7)]: true,
      [utils.asGridCoords(20, 8)]: true,
      [utils.asGridCoords(20, 9)]: true,
      [utils.asGridCoords(20, 10)]: true,
      [utils.asGridCoords(20, 11)]: true,
      [utils.asGridCoords(1, 2)]: true,
      [utils.asGridCoords(1, 3)]: true,
      [utils.asGridCoords(1, 4)]: true,
      [utils.asGridCoords(1, 5)]: true,
      [utils.asGridCoords(1, 6)]: true,
      [utils.asGridCoords(1, 7)]: true,
      [utils.asGridCoords(1, 8)]: true,
      [utils.asGridCoords(1, 9)]: true,
      [utils.asGridCoords(1, 10)]: true,
      [utils.asGridCoords(1, 11)]: true,
      [utils.asGridCoords(1, 12)]: true,
      [utils.asGridCoords(2, 12)]: true,
      [utils.asGridCoords(3, 12)]: true,
      [utils.asGridCoords(4, 12)]: true,
      [utils.asGridCoords(5, 12)]: true,
      [utils.asGridCoords(6, 12)]: true,
      [utils.asGridCoords(7, 12)]: true,
      [utils.asGridCoords(8, 12)]: true,
      [utils.asGridCoords(9, 12)]: true,
      // [utils.asGridCoords(10, 12)]: true, // door
      // [utils.asGridCoords(11, 12)]: true, // door
      [utils.asGridCoords(12, 12)]: true,
      [utils.asGridCoords(13, 12)]: true,
      [utils.asGridCoords(14, 12)]: true,
      [utils.asGridCoords(15, 12)]: true,
      [utils.asGridCoords(16, 12)]: true,
      [utils.asGridCoords(17, 12)]: true,
      [utils.asGridCoords(18, 12)]: true,
      [utils.asGridCoords(19, 12)]: true,
      [utils.asGridCoords(20, 12)]: true,

      // pillars
      [utils.asGridCoords(4, 4)]: true,
      [utils.asGridCoords(17, 4)]: true,
      [utils.asGridCoords(4, 9)]: true,
      [utils.asGridCoords(17, 9)]: true,

      // dummies
      [utils.asGridCoords(6, 5)]: true,
      [utils.asGridCoords(15, 6)]: true,
      [utils.asGridCoords(12, 3)]: true,

      // stool
      [utils.asGridCoords(5, 3)]: true,

      // other itemsa
      [utils.asGridCoords(3, 1)]: true,
      [utils.asGridCoords(3, 2)]: true,
      
    },
    cutsceneSpaces: {
      [utils.asGridCoords(10, 12)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "OUTSIDE2",
              x: utils.withGrid(20),
              y: utils.withGrid(2),
              direction: "down"
            },
          ]
        }
      ],
      [utils.asGridCoords(11, 12)]: [
        {
          events: [
            {
              type: "changeMap", 
              map: "OUTSIDE2",
              x: utils.withGrid(21),
              y: utils.withGrid(2),
              direction: "down"
            },
          ]
        }
      ],
    }
  },
}