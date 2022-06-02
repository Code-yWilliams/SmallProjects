document.addEventListener('DOMContentLoaded', function() {
  const messageContainer = document.querySelector('#message');
  const wordSpacesContainer = document.querySelector('#spaces');
  const guessContainer = document.querySelector('#guesses');
  const playAgain = document.querySelector('#replay');
  const apples = document.querySelector('#apples');

  class Game {
    constructor() {
      this.reset();
    }
  
    randomWord = (function() {
      let words = ['spaghetti', 'conservative', 'unparalleled', 'obsequious', 'frightened'];
    
      return function () {
        let randomIndex = Math.floor(Math.random() * words.length);
        let randomWord = words[randomIndex];
        words = words.filter((word) => word !== randomWord);
        return randomWord;
      }
    })();
  
    addGuess(letter) {
      if (!this.isCorrectGuess(letter) && !this.wasAlreadyGuessed(letter)) {
        this.wrongGuessCount += 1;
        apples.className = `guess_${this.wrongGuessCount}`;
      }

      if (this.outOfGuesses()) {
        this.unbindKeyPressListener();
        playAgain.style.display = 'inline';
        document.body.style.backgroundColor = '#FFCCCB'
        return this.displayMessage("No more apples. You lose!");
      }

      this.drawGuess(letter);

      if (!this.wasAlreadyGuessed(letter)) {
        this.allGuesses.push(letter);
      }

      if (this.solved()) {
        this.unbindKeyPressListener();
        document.body.style.backgroundColor = '#ADD8E6'
        playAgain.style.display = 'inline';
        return this.displayMessage('Woohoo! You win!');
      }
    }

    displayMessage(message) {
      messageContainer.textContent = message;
    }

    drawSpaces(word) {
      for (let i = 1; i <= word.length; i++) {
        let spaceSpan = document.createElement('span');
        wordSpacesContainer.appendChild(spaceSpan)
      }
    }

    drawGuess(letter) {
      let wordSpaces = wordSpacesContainer.querySelectorAll('span');

      if (this.isCorrectGuess(letter) && !this.wasAlreadyGuessed(letter)) { 
        this.indexesOfLetter(letter).forEach(index => {
          let space = wordSpaces[index];
          space.textContent = letter;
          space.classList.add('solved');
        })
      }

      if (!this.wasAlreadyGuessed(letter)) {
        let guessSpan = document.createElement('span');
        guessSpan.textContent = letter;
        guessContainer.appendChild(guessSpan);
      }
    }

    isCorrectGuess(letter) {
      return this.magicWord.includes(letter);
    }

    wasAlreadyGuessed(letter) {
      return this.allGuesses.includes(letter);
    }

    outOfGuesses() {
      return this.wrongGuessCount === this.maxWrongGuessCount;
    }

    indexesOfLetter(letter) {
      let result = [];
      for (let i = 0; i < this.magicWord.length; i++) {
        if (this.magicWord[i] === letter) {
          result.push(i);
        }
      }
      return result;
    }

    reset() {
      document.body.style.backgroundColor = '#FFFFFF'
      this.bindKeyPressListener();
      playAgain.style.display = 'none';
      this.emptyGuessContainer();
      this.emptyWordSpaceContainer();

      this.magicWord = this.randomWord();
      console.log(this.magicWord);
      
      if (this.magicWord === undefined) {
        this.displayMessage("Sorry, I've run out of words!");
        this.unbindKeyPressListener();
      } else {
        this.allGuesses = [];
        this.wrongGuessCount = 0;
        this.maxWrongGuessCount = 6;
        this.drawSpaces(this.magicWord);
        this.displayMessage('If you run out of apples before guessing the word, you lose!')
      }
    }

    solved() {
      let spaces = Array.from(wordSpacesContainer.querySelectorAll('span'));
      return spaces.every(space => {
        return space.classList.contains('solved');
      });
    }

    emptyWordSpaceContainer() {
      let spaces = wordSpacesContainer.querySelectorAll('span');
      spaces.forEach(spanSpace => spanSpace.remove());
    }

    emptyGuessContainer() {
      let guesses = guessContainer.querySelectorAll('span');
      guesses.forEach(guessSpan => guessSpan.remove())
    }

    KeyPressListener = function(e) {
      let key = e.key.toLowerCase();
      console.log(key);
      if (key.length === 1) {
        game.addGuess(key);
      }
    }

    bindKeyPressListener() {
      document.addEventListener('keydown', this.KeyPressListener);
    }

    unbindKeyPressListener() {
      document.removeEventListener('keydown', this.KeyPressListener);
    }
  }

  let game = new Game();

  playAgain.addEventListener('click', function(e) {
    e.preventDefault();
    game.reset();
  });

});