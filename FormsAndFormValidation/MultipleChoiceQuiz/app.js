const questions = [
  {
    id: 1,
    question: "How many bones are in the average adult human body?",
    options: ["150", "206", "245", "300"],
  },
  {
    id: 2,
    question: "A flea can jump how many times higher than their own height?",
    options: ["50", "130", "115", "75"],
  },
  {
    id: 3,
    question: "Which is the world's largest amphibian?",
    options: ["Giant Salamander", "Bullfrog", "Eastern Newt", "Spotted River Frog"],
  },
  {
    id: 4,
    question: "Which is the largest man-made lake in the U.S.?",
    options: ["Lake Koocanusa", "Lake Oahe", "Lake Powell", "Lake Mead"],
  },
];

const answers = { '1': '206', '2': '130', '3': 'Giant Salamander', '4': 'Lake Mead' };

class Quiz {
  constructor(questions, answers) {
    this.questions = questions;
    this.answers = answers;
    this.templates = {};
    this.registerPartials();
    this.compileTemplates();
    this.renderQuiz();
    this.registerEventListeners();
  }

  registerPartials() {
    const partials = document.querySelectorAll('[data-template-type="partial"]');
    partials.forEach(template => {
      let name = template.id;
      Handlebars.registerPartial(name, template.innerHTML);
    });
  }

  compileTemplates() {
    const templates = document.querySelectorAll('.handlebars');
    templates.forEach(template => {
      let name = template.id;
      this.templates[name] = Handlebars.compile(template.innerHTML);
    });
  }

  renderQuiz() {
    const questionsDiv = document.querySelector('.questions');
    const data = {questions: this.questions}
    questionsDiv.innerHTML = this.templates.questions(data);
  }

  checkAnswers() {
    const form = document.querySelector('.form');
    const formData = new FormData(form);

    let results = {};
    this.questions.forEach(question => {
      let questionNumber = question.id;
      let submittedAnswer = formData.get(question.id);
      let correctAnswer = this.answers[questionNumber];

      if (submittedAnswer === null) {
        results[questionNumber] = `You didn't answer this question. Correct answer is "${correctAnswer}"`;
      } else if (submittedAnswer === correctAnswer) {
        results[questionNumber] = 'Correct!';
      } else {
        results[questionNumber] = `Wrong answer. Correct answer is "${correctAnswer}"`;
      }
    });

    this.renderResults(results);
  }

  renderResults(resultsObj) {
    for (let question in resultsObj) {
      let result = resultsObj[question];
      let questionDiv = document.querySelector(`[data-question-number="${question}"]`);
      let resultParagraph = questionDiv.querySelector('.result');
      resultParagraph.textContent = result;
      
      if (result === 'Correct!') {
        resultParagraph.classList.add('correct');
      } else {
        resultParagraph.classList.add('wrong');
      }
    }
  }

  registerEventListeners() {
    const form = document.querySelector('.form');
    form.addEventListener('submit', formSubmitEventHandler.bind(this));
    form.addEventListener('reset', formResetEventHandler.bind(this));

    const submitButton = document.querySelector('.submit-button');
    const resetButton = document.querySelector('.reset-button');

    function formSubmitEventHandler(e) {
      e.preventDefault();
      this.checkAnswers();
      submitButton.disabled = true;
      resetButton.disabled = false;
    }

    function formResetEventHandler(e) {
      this.clearResults();
      submitButton.disabled = false;
      resetButton.disabled = true;
    }
  }

  clearResults() {
    let resultParagraphs = document.querySelectorAll('.result');
    resultParagraphs.forEach(p => {
      p.textContent = "";
      p.className = "result";
    });
  }

}

document.addEventListener('DOMContentLoaded', function(e) {
  const app = new Quiz(questions, answers);
});