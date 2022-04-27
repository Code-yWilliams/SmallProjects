import debounce from './debounce.js';

class Autocomplete {
  constructor(inputElement, url) {
    this.input = inputElement;
    this.url = url;

    this.listUI = null;
    this.overlay = null;

    this.wrapInput();
    this.createUI();
    this.valueChanged = debounce(this.valueChanged.bind(this), 300);
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
    this.input.addEventListener('input', this.valueChanged.bind(this));
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
    this.listUI.addEventListener('mousedown', this.handleMousedown.bind(this));
  }

  valueChanged(inputEvent) {
    let value = this.input.value;
    this.previousValue = value;

    if (value.length > 0) {
      this.fetchMatches(value, matches => {
        this.visible = true;
        this.matches = matches;
        this.bestMatchIndex = 0;
        this.selectedIndex = null;
        this.draw();
      });
    } else {
      this.reset();
    }
  }

  handleKeydown(keydownEvent) {
    switch (keydownEvent.key) {
      case 'ArrowDown':
        keydownEvent.preventDefault();
        if (this.selectedIndex === null || this.selectedIndex === this.matches.length - 1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex += 1
        }
        this.bestMatchIndex = null;
        this.draw();
        break;
      case 'ArrowUp':
        keydownEvent.preventDefault();
        if (this.selectedIndex === null || this.selectedIndex === 0) {
          this.selectedIndex = this.matches.length - 1;
        } else {
          this.selectedIndex -= 1;
        }
        this.bestMatchIndex = null;
        this.draw();
        break;
      case 'Tab':
        if (this.bestMatchIndex !== null && this.matches.length > 0) {
          this.input.value = this.matches[this.bestMatchIndex].name;
          keydownEvent.preventDefault();
        }
        this.reset();
        break;
      case 'Escape':
        this.input.value = this.previousValue;
        this.reset();
        break;
      case 'Enter':
        if (this.selectedIndex !== null) {
          this.input.value = this.matches[this.selectedIndex].name;
          this.reset();
        }
        break;
    }
  }

  handleMousedown(mousedownEvent) {
    if (mousedownEvent.target.classList.contains('autocomplete-ui-choice')) {
      this.input.value = mousedownEvent.target.textContent;
      this.reset();
    }
  }

  draw() {
    while (this.listUI.lastChild) {
      this.listUI.removeChild(this.listUI.lastChild);
    }
    
    if (this.bestMatchIndex !== null && this.matches.length > 0 && this.visible) {
      let selected = this.matches[this.bestMatchIndex];
      this.overlay.textContent = this.generateOverlayContent(this.input.value, selected);
    } else {
      this.overlay.textContent = '';
    }

    this.matches.forEach((match, index) => {
      let li = document.createElement('li');
      li.classList.add('autocomplete-ui-choice');

      if (index === this.selectedIndex) {
        li.classList.add('selected');
      }

      li.textContent = match.name;
      this.listUI.appendChild(li);
    });
  }

  generateOverlayContent(value, bestMatch) {
    let end  = bestMatch.name.substr(value.length);
    return value + end;
  }

  reset() {
    this.visible = false;
    this.matches = [];
    this.bestMatchIndex = null;
    this.selectedIndex = null;
    this.previousValue = null;

    this.draw();
  }

  fetchMatches(query, callback) {
    let request = new XMLHttpRequest();


    request.addEventListener('load', function() {
      callback(request.response);
    });

    request.open('GET', `${this.url}${encodeURIComponent(query)}`);
    request.responseType = 'json';
    request.send();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  let input = document.querySelector('input');
  let url = '/countries?matching=';
  let autocomplete = new Autocomplete(input, url);
});