/* 
 * manages the animations of the sprites in the game 
*/
class Sprite {
  constructor(config) {
    // load sprite to canvas
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    // load shadow to canvas
    this.shadow = new Image();
    this.useShadow = true;
    if (this.useShadow) {
      this.shadow.src = '/assets/actors/Shadow.png'
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    // configure animation & initial state
    this.animations = config.animations || {
      "idle-up"   : [ [1, 0] ],
      "idle-down" : [ [0, 0] ],
      "idle-left" : [ [2, 0] ],
      "idle-right": [ [3, 0] ],
      "walk-up"   : [ [1, 1], [1, 2], [1, 3], [1, 0] ],
      "walk-down" : [ [0, 1], [0, 2], [0, 3], [0, 0] ],
      "walk-left" : [ [2, 1], [2, 2], [2, 3], [2, 0] ],
      "walk-right": [ [3, 1], [3, 2], [3, 3], [3, 0] ],
    }
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    // cadence of animations
    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    // reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation != key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    // downtick progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // start next animation
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;
    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y + utils.withGrid(6) - cameraPerson.y;

    this.isShadowLoaded && ctx.drawImage(
      this.shadow, 0, 0, 16, 16, x+2, y+12, 16, 16 
    )

    const [frameX, frameY] = this.frame;
    this.isLoaded && ctx.drawImage( 
      this.image, frameX * 16, frameY * 16, 16, 16, x, y, 16, 16 
    );

    this.updateAnimationProgress()
  }
}