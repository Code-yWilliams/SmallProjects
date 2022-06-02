class TextEditorApp {
  constructor() {
    this.$toolButtons = $('#toolbar button');
    this.bindEventListeners();
  }

  bindEventListeners() {
    const app = this;
    this.$toolButtons.click(function(e) {
      let methodName = e.currentTarget.id;
      let argumentValue;
      if (methodName === 'createlink') {
        argumentValue = prompt('Enter a link URL:');
      }
      document.execCommand(methodName, false, argumentValue);
    });
  }
}

$(function() {
  const app = new TextEditorApp();
});