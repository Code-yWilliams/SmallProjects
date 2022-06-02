class CalculatorApp {
  constructor() {
    let screenElements = document.querySelectorAll('.screen');
    screenElements.forEach(element => this[element.id] = element);

    this.controlButtons = document.querySelectorAll('.control');
    this.operatorButtons = document.querySelectorAll('.operator');
    this.digitButtons = document.querySelectorAll('.digit');
    this.equalsButton = document.querySelector('#equals');

    this.equation = '';
    this.equationModified = false;
  }

  bindEventListeners() {
    this.bindDigitEventListeners();
    this.bindControlEventListeners();
    this.bindOperatorEventListeners();
    this.bindEqualsEventListener();
  }

  bindDigitEventListeners() {
    const app = this;
    this.digitButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        let clickedDigit = e.target.textContent;
        app.addToEntryWindow(clickedDigit);
      });
    });
  }

  addToEntryWindow(digit) {
    // clear entry window value from previous operation if there was a previous operation
    this.clearEntryIfNewInput()

    let entryWindowValue = this.entryWindow.textContent;
    
    // only allow one decimal point per entry/operand
    if (digit === '.' && entryWindowValue.includes('.')) return;

    // dont allow leading 0 except when before a decimal. Capture sign before getting rid of leading 0
    let sign = '';
    if ((entryWindowValue === '0' || entryWindowValue === '-0') && digit !== '.') {
      sign = entryWindowValue[0] === '-' ? '-' : '';
      entryWindowValue = '';
    }

    // dont allow an input/operand that exceeds the width of the entry window
    let newEntryWindowValue;
    if (entryWindowValue.length === 18) {
      newEntryWindowValue = entryWindowValue;
    } else {
      newEntryWindowValue = sign + entryWindowValue + digit; // add sign that was captured above
    }
    
    // set updated entry value / operand
    this.entryWindow.textContent = newEntryWindowValue;
  }

  bindControlEventListeners() {
    const app = this;
    this.controlButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        let methodName = e.target.id;
        if (methodName === 'negative') app.clearEntryIfNewInput();
        app[methodName]();
      });
    })
  }

  initialize() {
    this.bindEventListeners();
  }

  clearEntry() {
    this.entryWindow.textContent = '0';
  }

  clearEntryIfNewInput() {
    if (this.equationModified) {
      this.clearEntry();
      this.equationModified = false;
    }
  }

  clear() {
    this.clearEntry();
    this.equation = '';
    this.operationWindow.textContent = '';
  }

  negative() {
    let entryWindowValue = this.entryWindow.textContent;
    let newEntryWindowValue;
    if (entryWindowValue[0] === '-') {
      newEntryWindowValue = entryWindowValue.slice(1);
    } else {
      newEntryWindowValue = '-' + entryWindowValue;
    }
    this.entryWindow.textContent = newEntryWindowValue;
  }

  bindOperatorEventListeners() {
    const app = this;
    this.operatorButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        let entryWindowValue = app.entryWindow.textContent;
        app.equation += entryWindowValue;

        let operation = e.target.id;
        app[operation]();
      
        app.operationWindow.textContent = app.equation;
        app.equationModified = true;
      });
    })
  }

  bindEqualsEventListener() {
    const app = this;
    this.equalsButton.addEventListener('click', function(e) {
      let entryWindowValue = app.entryWindow.textContent;
      app.equation += entryWindowValue
      let result = eval(app.equation);
      app.clear();
      app.entryWindow.textContent = result;
    });
  }

  add() {
    this.equation += ' + ';
  }

  subtract() {
    this.equation += ' - ';
  }

  multiply() {
    this.equation += ' * ';
  }

  divide() {
    this.equation += ' / ';
  }

  modulo() {
    this.equation += ' % ';
  }
}

document.addEventListener('DOMContentLoaded', function(e) {
  const app = new CalculatorApp();
  app.initialize();
});