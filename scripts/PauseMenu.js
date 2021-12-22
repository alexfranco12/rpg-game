class PauseMenu {
  constructor({ onComplete }) {
    this.onComplete = onComplete;
  }

  async init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container
    })
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element);

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })
  }

  getOptions(pageKey) {
    // case: show the first page of the options
    if (pageKey === "root") {
      return [
        {
          label: "Save",
          description: "Save your progress",
          handler: () => {
            // TODO: save game
            this.close();
          }
        },
        {
          label: "Close",
          description: "Close menu",
          handler: () => {
            this.close();
          }
        },
      ]
    }

    return [];
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    this.element.innerHTML = (`
      <h2>Pause Menu</h2>
    `)
  }
}