import debounce from './debounce.js';

class Autocomplete {

  constructor(apiURL, inputElement) {
    this.input = inputElement
    this.url = apiURL;

    this.listUI = null;
    this.overlay = null;

    this.visible = false;
    this.matches = [];

    this.wrapInput();
    this.createUI();
    this.valueChanged = debounce(this.valueChanged.bind(this));
    this.bindEvents();
    this.reset();
  }

  wrapInput() {
    let wrapper = document.createElement('div');
    wrapper.classList.add('autocomplete-wrapper');
    this.input.parentNode.appendChild(wrapper);
    wrapper.appendChild(this.input);
  }

  createUI() {
    let listUI = document.createElement('ul');
    listUI.classList.add('autocomplete-ui');
    this.input.parentNode.appendChild(listUI);
    this.listUI = listUI;

    let overlay = document.createElement('div');
    overlay.classList.add('autocomplete-overlay');
    overlay.style.width = `${this.input.clientWidth}px`;
    this.input.parentNode.appendChild(overlay);
    this.overlay = overlay;
  }

  bindEvents() {
    this.input.addEventListener('input', this.valueChanged);
    this.input.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('click', this.optionClicked.bind(this));
  }

  optionClicked(e) {
    if (e.target.classList.contains('autocomplete-ui-choice')) {
      let countryName = e.target.textContent;
      this.input.value = countryName;
      this.reset();
    }
  }

  valueChanged(e) {
    let value = this.input.value;
    this.previousVal = value;
    if (value.length > 0) {
      this.fetchMatches(value, matches => {
        this.visible = true;
        this.matches = matches;
        this.bestMatchIdx = 0;
        this.selectedIdx = null;
        this.draw();
      });
    } else {
      this.reset();
    }
  }

  keydown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (this.selectedIdx === null || this.selectedIdx === this.matches.length - 1) {
          this.selectedIdx = 0;
        } else {
          this.selectedIdx += 1;
        }
        this.bestMatchIdx = null;
        this.draw();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (this.selectedIdx === null || this.selectedIdx === 0) {
          this.selectedIdx = this.matches.length - 1;
        } else {
          this.selectedIdx -= 1;
        }
        this.bestMatchIdx = null;
        this.draw();
        break;
      case 'Tab':
        e.preventDefault();
        if (this.bestMatchIdx !== null) {
          let bestMatch = this.matches[this.bestMatchIdx];
          this.input.value = bestMatch.name;
        }
        this.reset();
        break;
      case 'Enter':
        this.reset();
        break;
      case 'Escape':
        this.input.value = this.previousVal;
        this.reset();
        break;    
    }
  }

  fetchMatches(query, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', `${this.url}${encodeURIComponent(query)}`);
    request.addEventListener('load', function(e) {
      callback(request.response);
    });
    request.responseType = 'json';
    request.send();
  }

  draw() {
    while (this.listUI.lastChild) {
      this.listUI.lastChild.remove();
    }

    if (this.visible !== true) {
      this.overlay.textContent = '';
      return;
    }

    if (this.matches[this.bestMatchIdx]) {
      let bestMatch = this.matches[this.bestMatchIdx];
      let bestMatchName = bestMatch.name;
      this.overlay.textContent = this.generateOverlayText(bestMatchName);
    } else {
      this.overlay.textContent = '';
    }

    this.matches.forEach((match, idx) => {
      let li = document.createElement('li');
      li.classList.add('autocomplete-ui-choice');
      li.textContent = match.name;
      if (idx === this.selectedIdx) {
        li.classList.add('selected');
        this.input.value = match.name;
      }
      this.listUI.appendChild(li);
    });

  }

  generateOverlayText(matchName) {
    let inputText = this.input.value;
    return inputText + matchName.slice(inputText.length);
  }

  reset() {
    this.visible = false;
    this.matches = [];
    this.bestMatchIdx = null;
    this.selectedIdx = null;
    this.previousVal = null;
    this.draw();
  }

}

document.addEventListener('DOMContentLoaded', function() {
  let apiURL = '/countries?matching=';
  let inputElement = document.querySelector('input');
  let autocomplete = new Autocomplete(apiURL, inputElement)
});