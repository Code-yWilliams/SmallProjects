let initialTodoSet = [
  {
    title: 'Buy Milk',
    month: '1',
    year: '2017',
    description: 'Milk for baby',
  },
  
  {
    title: 'Buy Apples',
    month: '',
    year: '2017',
    description: 'An apple a day keeps the doctor away',
  },

  {
    title: 'Buy Veggies',
    month: '',
    year: '',
    description: 'For the daily fiber needs',
  },

  {
    title: 'Buy chocolate',
    month: '1',
    year: '',
    description: 'For the cheat day',
  },
];

const Todo = (function() {
  let currentID = 1;

  function nextID() {
    return currentID++
  };
  
  function todoConstructor(todoDataObject) {
    this.id = nextID();
    this.completed = false;
    ['title', 'month', 'year', 'description'].forEach(propName => {
      let propValue = todoDataObject[propName];
      this[propName] = propValue;
    });
  }

  return todoConstructor;
})();

Todo.prototype.isWithinMonthYear = function(month, year) {
  return this.month === month && this.year === year;
};

const todoList = (function(initialTodoSet) {
  let todoObjects = [];

  const VALID_TODO_DATA_PROPS = Object.freeze(['title', 'completed', 'month',
                                 'year', 'description']);

  function isValidTodoData(todoData) {
    let propNames = Object.getOwnPropertyNames(todoData);
    return propNames.every(propName => {
      let propValue = todoData[propName];
      return VALID_TODO_DATA_PROPS.includes(propName) &&
             (typeof propValue === 'string' || 
             (propName === 'completed' && typeof propValue === 'boolean'));
    });
  };

  let list = {
    add(todoDataObject) {
      if (isValidTodoData(todoDataObject)) {
        let newTodo = new Todo(todoDataObject);
        todoObjects.push(newTodo);
        return true;
      } else {
        return false;
      }
    },

    delete(id) {
      let itemToDelete = todoObjects.find(todo => todo.id === id);
      let indexToDelete = todoObjects.indexOf(itemToDelete);
      if (indexToDelete !== -1) {
        todoObjects.splice(indexToDelete, 1);
        return true;
      } else {
        return false;
      }
    },

    update(id, newTodoData) {
      let itemToUpdate = todoObjects.find(todo => todo.id === id);
      if (isValidTodoData(newTodoData) && itemToUpdate) {
        Object.assign(itemToUpdate, newTodoData);
        return true;
      } else {
        return false;
      }
    },

    get(id) {
      let itemToReturn = todoObjects.find(todo => todo.id === id);
      if(itemToReturn) {
        return Object.assign(Object.create(Todo.prototype), itemToReturn);
      } else {
        return false;
      }
    },

    filter(callback) {
      let result = [];
      todoObjects.forEach(todo => {
        let item = Object.assign(Object.create(Todo.prototype), todo);
        if (callback(item)) {
          result.push(item);
        }
      });
      return result;
    },
  };

  initialTodoSet.forEach(todo => {
    list.add(todo);
  });

  return list;
})(initialTodoSet);

const todoManager = (function(list) {
  let manager = {
    all() {
      return list.filter(todo => true);
    },
  
    allCompleted() {
      return list.filter(todo => {
        return todo.completed;
      });
    },
  
    allWithinMonthYear(month, year) {
      return list.filter(todo => {
        return todo.isWithinMonthYear(month, year);
      });
    },
  
    allCompletedWithinMonthYear(month, year) {
      return list.filter(todo => {
        return todo.completed && todo.isWithinMonthYear(month, year);
      });
    },
  };

  return manager;
})(todoList);
