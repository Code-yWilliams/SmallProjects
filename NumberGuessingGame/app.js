document.addEventListener('DOMContentLoaded', function(e) {
  let magicNumber = Math.floor(Math.random() * 100) + 1;
  let inputArea = document.getElementById('guess');
  let form = document.querySelector('form');
  let messageElement = document.querySelector('#message');
  let guessButton = document.querySelector('.enabled-guess-button');
  let newGameLink = document.querySelector('a');
  let message;
  let guessCount = 0;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let guess = parseInt(inputArea.value, 10);

    if (isValidGuess(guess)) {
      guessCount += 1;
      if (guess < magicNumber) {
        message = `The number is higher than ${guess}.`;
      } else if (guess > magicNumber) {
        message = `The number is lower than ${guess}.`;
      } else {
        let guessOrGuesses = guessCount === 1 ? 'guess' : 'guesses';
        message = `You got it! The number is ${guess}. It took you ${guessCount} ${guessOrGuesses}`;
        guessButton.disabled = true;
        guessButton.setAttribute('class', 'disabled-guess-button');
      }
    } else {
      message = 'Ivalid guess! Please guess a number between 1 and 100';
    }

    inputArea.value = "";
    messageElement.textContent = message;
  });

  newGameLink.addEventListener('click', function(e) {
    e.preventDefault();
    magicNumber = Math.floor(Math.random() * 100) + 1;
    guessCount = 0;
    message = "Guess the magic number!";
    messageElement.textContent = message;
    guessButton.disabled = false;
    guessButton.setAttribute('class', 'enabled-guess-button');
  });
});

function isValidGuess(int) {
  return int >= 1 && int <= 100;
}