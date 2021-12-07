class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  init() {
    const image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };
    image.src = '/assets/background/StartingRoom.png';

    const x = 7;
    const y = 4;

    const shadow = new Image(); 
    shadow.onload = () => {
      this.ctx.drawImage(
        shadow, 
        0, 
        0,
        16,
        16,
        x * 16 + 2,
        y * 16 + 12,
        16,
        16
      );
    }
    shadow.src = '/assets/actors/Shadow.png'

    const hero = new Image(); 
    hero.onload = () => {
      this.ctx.drawImage(
        hero, 
        0, 
        0,
        16,
        16,
        x * 16,
        y * 16,
        16,
        16
      );
    }
    hero.src = '/assets/actors/characters/GreenNinja/SpriteSheet.png'
  }
}