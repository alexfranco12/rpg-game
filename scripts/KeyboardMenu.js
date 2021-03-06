class KeyboardMenu {
  constructor(config={}) {
    this.options = [] // set by updater method
    this.up = null;
    this.down = null;
    this.prevFocus = null;
    this.descriptionContainer = config.descriptionContainer || null
  }

  init(container) {
    this.createElement();
    (this.descriptionContainer || container).appendChild(this.descriptionElement);
    container.appendChild(this.element)

    this.up = new KeyPressListener("ArrowUp", () => {
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(e => {
        return e.dataset.button < current && !e.disabled;
      })
      prevButton?.focus();
    })
    
    this.down = new KeyPressListener("ArrowDown", () => {
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(e => {
        return e.dataset.button > current && !e.disabled;
      })
      nextButton?.focus();
    })
  }

  setOptions(options) {
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled ? "disabled" : "";
      return (`
        <div class="option">
          <button 
            ${disabledAttr}
            data-button="${index}" 
            data-description="${option.description}"
            > ${option.label}
          </button>
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>
      `)
    }).join("");

    this.element.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        const chosenOption = this.options[ Number(button.dataset.button) ];
        chosenOption.handler();
      })
      button.addEventListener("mouseenter", () => {
        button.focus();
      })
      button.addEventListener("focus", () => {
        this.prevFocus = button;
        this.descriptionElementText.innerText = button.dataset.description
      })
    })

    setTimeout(() => {
      this.element.querySelector("button[data-button]:not([disabled])").focus();
    }, 100)

  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("KeyboardMenu");

    // description box element
    this.descriptionElement = document.createElement("div");
    this.descriptionElement.classList.add("DescriptionBox");
    this.descriptionElement.innerHTML = (`<p>description information.</p>`);
    this.descriptionElementText = this.descriptionElement.querySelector("p");
  }

  end() {
    // remove menu element and description element from ui
    this.element.remove();
    this.descriptionElement.remove();

    // clean up bindings
    this.up.unbind();
    this.down.unbind();
  }
}