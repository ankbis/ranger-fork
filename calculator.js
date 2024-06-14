class Calculator {
  constructor() {
    this.display = document.getElementById('display');
    this.buttons = document.getElementById('buttons');
    this.currentValue = '';
    this.createButtons();
    this.bindEvents();
  }

  createButtons() {
    const buttons = [
      '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+', '='
    ];
    buttons.forEach(button => {
      const btn = document.createElement('button');
      btn.innerText = button;
      btn.addEventListener('click', () => this.handleButtonClick(button));
      this.buttons.appendChild(btn);
    });
  }

  bindEvents() {
    document.addEventListener('keydown', event => this.handleKeyPress(event.key));
  }

  handleButtonClick(button) {
    switch (button) {
      case '=':
        this.evaluate();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        this.currentValue += ` ${button} `;
        this.updateDisplay();
        break;
      default:
        this.currentValue += button;
        this.updateDisplay();
    }
  }

  handleKeyPress(key) {
    if (/[\d\./\*\-\+]/.test(key)) {
      this.handleButtonClick(key);
    } else if (key === 'Enter') {
      this.handleButtonClick('=');
    }
  }

  evaluate() {
    const result = eval(this.currentValue);
    this.currentValue = result.toString();
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.value = this.currentValue;
  }
}

new Calculator();
