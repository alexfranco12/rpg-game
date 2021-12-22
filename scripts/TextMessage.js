class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
    
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = (`
      <p class="TextMessage__p"></p>
      <button class="TextMessage__button">Next</button>
    `)

    // typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage__p"),
      text: this.text,
    })

    // close message
    this.element.querySelector("button").addEventListener("click", () => {
      this.done();
    })

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    })
  }
}