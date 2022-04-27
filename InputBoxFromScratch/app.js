(function() {
  let cursorID;
  let clearedCursorID;

  document.addEventListener('DOMContentLoaded', function(e) {
    let contentDiv = document.querySelector('.content');
    let textField = document.querySelector('.text-field');

    document.addEventListener('click', function(e) {
      if (e.target === textField) {
        textField.classList.add('focused');
        if (clearedCursorID === cursorID) {
          cursorID = setInterval(function() {
            textField.classList.toggle('cursor');
          }, 500);
        }
      } else {
        textField.classList.remove('focused');
        textField.classList.remove('cursor');
        clearInterval(cursorID);
        clearedCursorID = cursorID
      }
    });

    document.addEventListener('keydown', function(e) {
      if (textField.classList.contains('focused')) {
        if (e.key === 'Backspace') {
          let content = contentDiv.textContent
          let contentLength = content.length
          contentDiv.textContent = content.slice(0, contentLength - 1);
        } else if (event.key.length === 1) {
          contentDiv.textContent += e.key;
        }
      }
    });

  });
})();