class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
  }

  init(container) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve))
    })
  }

  getOptions(resolve) {
    // const saveFile = this.progress.getSaveFile();

    return [
      {
        label: "New Game",
        description: "Start a new ninja adventure!",
        handler: () => {
          this.close();
          resolve();
        }
      },
      // saveFile ? {
      //   label: "Continue Game",
      //   description: "Continue your previous pizza adventure!",
      //   handler: () => {
      //     this.close();
      //     resolve(saveFile);
      //   }
      // } : null
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = (`
      <video autoplay muted loop id="background-video">
        <source 
          src="./assets/images/animated_japan.mp4" 
          type="video/mp4">
      </video>
      <div class="content">
        <h1>Ninja Survival Game</h1>
      </div>
    `)
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }
}