document.addEventListener('DOMContentLoaded', function(e) {
  
  let textArea = document.querySelector('textarea');
  const MAX_CHAR_COUNT = 140;
  let charCounter = document.querySelector('.counter');
  
  function charsRemaining() {
    return MAX_CHAR_COUNT - textArea.value.length;
  }
  
  textArea.addEventListener('keydown', function(e) {
    let remaining = charsRemaining();
    charCounter.textContent = `${remaining} characters remaining.`
    if (remaining < 0) {
      textArea.style.color = 'red';
    } else {
      textArea.style.color = 'black';
    }
  });
  
});