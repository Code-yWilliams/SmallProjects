document.addEventListener('DOMContentLoaded', function() {
  let templates = {};
  compileTemplates();
  registerPartials();

  let animalsDiv = document.querySelector('#exotic-animals');
  animalsDiv.innerHTML = templates['photos'](data);
  bindEventListeners();

  function compileTemplates() {
    let templateScripts = document.querySelectorAll("[data-type='handlebars-template']")
    templateScripts.forEach(template => {
      let name = template.getAttribute('id');
      templates[name] = Handlebars.compile(template.innerHTML);
    })
  }

  function registerPartials() {
    let templateScripts = document.querySelectorAll("[data-type='handlebars-partial']")
    templateScripts.forEach(partial => {
      let name = partial.getAttribute('id');
      templates[name] = Handlebars.compile(partial.innerHTML);
      Handlebars.registerPartial(name, partial.innerHTML);
    })
  }

  function bindEventListeners() {
    let images = document.querySelectorAll('img');
    images.forEach(image => {
      let timeoutID;
      let caption = image.nextElementSibling;

      image.addEventListener('mouseenter', function(e) {
        timeoutID = setTimeout(() => {
          caption.classList.remove('hidden');
          caption.classList.add('visible');
        }, 2000);
      });

      image.addEventListener('mouseleave', function(e) {
        clearTimeout(timeoutID);
        caption.classList.remove('visible');
        caption.classList.add('hidden');
      });
    })
  }
});