$(function(e) {
  let $form = $('form');
  $form.on('submit', function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    let data = Object.fromEntries(formData);
    let firstOperand = parseFloat(data['first-number']);
    let secondOperand = parseFloat(data['second-number']);
    let operator = data['operator'];
    let result = compute(firstOperand, operator, secondOperand);
    $('#result').text(result)
  });

});

function compute(firstOperand, operator, secondOperand) {
  if (Number.isNaN(firstOperand)) firstOperand = 0;
  if (Number.isNaN(secondOperand)) secondOperand = 0;


  switch (operator) {
    case '+':
      return add(firstOperand, secondOperand);
      break;
    case '-':
      return subtract(firstOperand, secondOperand);
      break;
    case '/':
      return divide(firstOperand, secondOperand);
      break;
    case '*':
      return multiply(firstOperand, secondOperand);
      break;
  }
}

function add(firstOperand, secondOperand) {
  return String(firstOperand + secondOperand)
}

function subtract(firstOperand, secondOperand) {
  return String(firstOperand - secondOperand);
}

function divide(firstOperand, secondOperand) {
  return String(firstOperand / secondOperand);
}

function multiply(firstOperand, secondOperand) {
  return String(firstOperand * secondOperand);
}

