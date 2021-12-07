class GameObject {
  constructor(config) {
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || '/assets/actors/characters/GreenNinja/SpriteSheet.png',
    });
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  init() {

  }

  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    setTimeout(() => {
      this.doBehaviorEvent(map)
    }, 10)
  }

  async doBehaviorEvent(map) {
    // honor other important events first or exit if no behaviors
    if(map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) return

    // setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // create event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig })
    await eventHandler.init();

    // setting next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    this.doBehaviorEvent(map);
  }

  update() {

  }
}