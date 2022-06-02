const data = {
  languages: [
    {
      name: 'Ruby',
      description: 'Ruby is a dynamic, reflective, object-oriented, ' +
      'general-purpose programming language. It was designed and developed in the mid-1990s ' +
      'by Yukihiro Matsumoto in Japan. According to its creator, Ruby was influenced by Perl, ' +
      'Smalltalk, Eiffel, Ada, and Lisp. It supports multiple programming paradigms, ' +
      'including functional, object-oriented, and imperative. It also has a dynamic type ' +
      'system and automatic memory management.'
    },

    {
      name: 'JavaScript',
      description: 'JavaScript is a high-level, dynamic, untyped, and interpreted ' +
      'programming language. It has been standardized in the ECMAScript language ' +
      'specification. Alongside HTML and CSS, JavaScript is one of the three core ' +
      'technologies of World Wide Web content production; the majority of websites employ ' +
      'it, and all modern Web browsers support it without the need for plug-ins. JavaScript ' +
      'is prototype-based with first-class functions, making it a multi-paradigm language, ' +
      'supporting object-oriented, imperative, and functional programming styles.'
    },

    {
      name: 'Lisp',
      description: 'Lisp (historically, LISP) is a family of computer programming languages ' +
      'with a long history and a distinctive, fully parenthesized prefix notation. ' +
      'Originally specified in 1958, Lisp is the second-oldest high-level programming ' +
      'language in widespread use today. Only Fortran is older, by one year. Lisp has changed ' +
      'since its early days, and many dialects have existed over its history. Today, the best '+
      'known general-purpose Lisp dialects are Common Lisp and Scheme.'
    },

    {
      name: 'Waffle',
      description: 'Testing.'
    }
  ]
};

function first120(string) {
  if (string.length <= 120) return string;

  let result = "";
  for (let i = 0; i < 120; i++) {
    let currentChar = string[i];
    if (currentChar === '"') {
      currentChar = '\"';
    }
    result += currentChar;
  }
  return result + " ...";
}

document.addEventListener('DOMContentLoaded', function(e) {
  data.languages.forEach(language => {
    language.first120 = first120(language.description);
  });

  Handlebars.registerHelper('over120', function(description, options) {
    console.log(description);
    if (description.length > 120) {
      return options.fn(this);
    }
  });

  const templates = {};
  registerPartials();
  compileTemplates();
  let languagesDiv = document.querySelector('#languages');
  languagesDiv.innerHTML = templates.langs(data);
  bindMoreLessListeners();

  function bindMoreLessListeners() {
    let buttons = document.querySelectorAll('.view-toggle');
    buttons.forEach(button => {
      button.addEventListener('click', moreLessButtonHandler);
    })
  }

  function moreLessButtonHandler(e) {
    e.preventDefault();
    let buttonElement = e.currentTarget;
    let paragraphElement = buttonElement.parentElement.querySelector('p');
    let languageName = buttonElement.closest('.lang').dataset.lang;
    let languageData = data.languages.find(lang => lang.name === languageName);
    let description = languageData.description;
    let first120 = languageData.first120;

    if (buttonElement.classList.contains('more')) {
      paragraphElement.textContent = description;
      buttonElement.textContent = 'View Less';
      buttonElement.classList.remove('more');
      buttonElement.classList.add('less');
    } else if (buttonElement.classList.contains('less')) {
      paragraphElement.textContent = first120;
      buttonElement.textContent = 'View More';
      buttonElement.classList.remove('less');
      buttonElement.classList.add('more');
    }
  }

  function compileTemplates() {
    let templateScripts = document.querySelectorAll("[type='text/x-handlebars']");
    templateScripts.forEach(script => {
      templates[script.id] = Handlebars.compile(script.innerHTML);
    });
  }

  function registerPartials() {
    let partialScripts = document.querySelectorAll("[data-type='partial']");
    partialScripts.forEach(partial => {
      Handlebars.registerPartial(partial.id, partial.innerHTML);
    });
  }
});