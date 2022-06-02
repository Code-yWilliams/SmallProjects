const data = {
  todos: [
    {
      id: 1,
      name: 'Eat Breakfast'
    },
    {
      id: 2,
      name: 'Eat Lunch'
    },
    {
      id: 3,
      name: 'Eat Dinner'
    },
    {
      id: 4,
      name: 'Eat Dessert'
    },
    {
      id: 5,
      name: 'Eat Midnight Snack'
    }
  ]
}

$(function() {
  const templates = {};

  registerPartials();
  compileTemplates();
  clearTemplateScripts();
  const todoListElement = document.querySelector('#todos');
  todoListElement.innerHTML = templates['all-todos'](data);
  bindEventListeners();


  function bindEventListeners() {
    let deleteSpans = document.querySelectorAll('.remove');
    deleteSpans.forEach(span => span.addEventListener('click', deleteHandler));

    let confirmYesButton = document.querySelector('.confirm-yes');
    confirmYesButton.addEventListener('click', confirmYesHandler);

    let confirmNoButton = document.querySelector('.confirm-no');
    confirmNoButton.addEventListener('click', confirmNoHandler);

    let todoElements = document.querySelectorAll('#todos li');
    todoElements.forEach(todo => todo.addEventListener('contextmenu', contextHandler));

    document.addEventListener('click', function(e) {
      e.preventDefault();
      hideContextMenu();
    });

    document.addEventListener('contextmenu', function(e) {
      document.dispatchEvent(new Event('click'));
    });

    let contextMenu = document.querySelector('#context-menu');
    contextMenu.addEventListener('click', contextActionHandler);
  }

  function deleteHandler(e) {
    let todoId = e.target.closest('li').dataset.id;
    showPrompt(todoId);
  }

  function confirmYesHandler(e) {
    e.preventDefault();
    let prompt = document.querySelector('.confirm-prompt');
    let todoId = prompt.dataset.todoId;
    let todoElement = document.querySelector(`li[data-id='${todoId}']`);
    todoElement.remove();
    deleteData(todoId);
    hidePrompt();
  }

  function confirmNoHandler(e) {
    e.preventDefault();
    hidePrompt();
  }

  function contextHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    let contextMenu = document.querySelector('#context-menu');
    contextMenu.style.zIndex = 5;
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;

    let todoId = e.currentTarget.dataset.id;
    console.log(todoId);
    showContextMenu(todoId);
  }

  function contextActionHandler(e) {
    e.preventDefault();
    let todoId = e.currentTarget.dataset.todoId;
    if (e.target.textContent === 'Delete') {
      showPrompt(todoId);
      hideContextMenu();
    }
  }

  function showContextMenu(todoId) {
    let contextMenu = document.querySelector('#context-menu');
    contextMenu.dataset.todoId = todoId;
    contextMenu.style.display = 'inline-block';
  }

  function hideContextMenu() {
    let contextMenu = document.querySelector('#context-menu');
    contextMenu.style.display = 'none';
  }

  function deleteData(todoId) {
    // implement code for deleting a todo item from the data store (out of scope for this project)
  }

  function showPrompt(todoId) {
    let prompt = document.querySelector('.confirm-prompt');
    prompt.dataset.todoId = todoId
    prompt.style.display = 'block';
  }

  function hidePrompt() {
    let prompt = document.querySelector('.confirm-prompt');
    prompt.dataset.todoId = '';
    prompt.style.display = 'none';
  }

  function registerPartials() {
    let partialScripts = document.querySelectorAll("[data-type='partial']");
    partialScripts.forEach(partial => {
      Handlebars.registerPartial(partial.id, partial.innerHTML);
    });
  }

  function compileTemplates() {
    let templateScripts = document.querySelectorAll("[type='text/x-handlebars']");
    templateScripts.forEach(script => {
      templates[script.id] = Handlebars.compile(script.innerHTML);
    });
  }

  function clearTemplateScripts() {
    let scripts = document.querySelectorAll("[type='text/x-handlebars']");
    scripts.forEach(script => script.remove());
  }
});


