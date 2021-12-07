class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = (`
      <p class="TextMessage__p">${this.text}</p>
      <button class="TextMessage__button">Next</button>
    `)

    this.element.querySelector("button").addEventListener("click", () => {
      // close message
      this.done();
    })

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener.unbind();
      this.done();
    })
  }
}