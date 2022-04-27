let intervalId;

function startCounting() {
  let number = 1;
  function logNumber() {
    console.log(number);
    number += 1
  }
  intervalId = setInterval(logNumber, 1000);
}

function stopCounting() {
  clearInterval(intervalId);
}