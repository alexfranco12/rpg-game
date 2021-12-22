class SceneTransition {
  constructor() {
    this.element = null;
  }
  
  init(container, callback) {
    this.createElement();
    container.appendChild(this.element);

    this.element.addEventListener("animationend", () => {
      callback();
    }, { once: true })
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("SceneTransition")
  }

  fadeOut() {
    this.element.classList.add("fade-out");
    this.element.addEventListener("animationend", () => {
      this.element.remove();
    }, { once: true })
  }
}