class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 65;
    this.timeout = null;
    this.isDone = false;
  }

  init() {
    let characters = [];
    this.text.split('').forEach(character => {
      // create a span for each character in text message
      let span = document.createElement("span");
      span.textContent = character;
      this.element.appendChild(span)

      characters.push({
        span,
        delayAfter: character === " " ? 0 : this.speed
      })
    });

    this.revealOneCharacter(characters);
  }

  revealOneCharacter(message) {
    const next = message.splice(0, 1)[0];
    next.span.classList.add("revealed")

    if (message.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(message)
      }, next.delayAfter)
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll("span").forEach(s => {
      s.classList.add('revealed')
    })
  }
}