class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve);
    })
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(document.querySelector(".game-container"));
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const who = this.map.gameObjects[this.event.faceHero];
      who.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction)
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    });
    message.init( document.querySelector(".game-container") )
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior({
      map: this.map,
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    });

    // set up a handler to complete when correct person is done standing, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandingComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior({
      map: this.map,
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true,
    });

    // set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)
  }

  changeMap(resolve) {
    const transition = new SceneTransition();
    transition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap(window.OverworldMaps[this.event.map], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      });
      resolve();

      transition.fadeOut();
    })
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }
}