var $ol = document.querySelector("ol");

function outputResult(message) {
  var $li = document.createElement("li");
  $li.innerText = message;
  $ol.appendChild($li);
  return $li;
}

function test(message, assertion) {
  var $msg = outputResult(message),
      passed = false;

  try {
    passed = assertion();
  }
  catch (e) {
    passed = false;
  }
  $msg.setAttribute("class", passed ? "pass" : "fail");
}

// Todo tests

test("Todo constructor function is defined", function() {
  return typeof Todo !== "undefined";
});

test("Todo constructor function creates todo objects that have unique id property values", function() {
  let todoA = new Todo({ title: "a" });
  let todoB = new Todo({ title: "b" });
  let todoC = new Todo({ title: "c" });
  return todoA.id !== todoB.id && todoA.id !== todoC.id && todoB.id !== todoC.id;
});

test("Todo objects contain *only* the following properties: id, title, completed, month, year, description", function() {
  let validProperties = ["id", "title", "completed", "month", "year", "description"];
  let todoA = new Todo({ title: "a", month: "1", year: "2000", description: "test", wild: "yeehaw" });
  return todoA.wild === undefined;
});

test("Todo objects have access to the shared Todo.prototype.isWithinMonthYear method", function() {
  let todoA = new Todo({ title: "a" });
  let todoB = new Todo({ title: "b" });
  let todoC = new Todo({ title: "c" });
  let todoObjects = [todoA, todoB, todoC];
  return todoObjects.every(todo => {
    return typeof todo.isWithinMonthYear === "function" && !todo.hasOwnProperty('isWithinMonthYear');
  });
}),

test("Todo.prototype.isWithinMonthYear returns true if the calling Todo item's month and year properties match the method's arguments", function() {
  let todoA = new Todo({ title: "think about waffles", month: "7", year: "2" });
  let todoB = new Todo({ title: "think about waffles", month: "7", year: "200" });
  let todoC = new Todo({ title: "think about waffles", month: "7", year: "20" });
  return todoA.isWithinMonthYear("7", "2") &&
         todoB.isWithinMonthYear("7", "200") &&
         !todoC.isWithinMonthYear("1", "20") &&
         !todoC.isWithinMonthYear("7", "11");
})

//todoList & todoManager tests

test("todoList object is defined", function() {
  return typeof todoList !== "undefined";
});

test("todoList / todoManager return a collection of Todo objects that are only copies of todoList's items", function() {
  todoManager.all().forEach(todo => {
    todo["completed"] = "CHANGED";
  });
  return todoManager.all().every(todo => {
    return todo["completed"] !== "CHANGED";
  }) && todoManager.all() !== todoManager.all();
});

test("todoList is initialized with a collection of Todo objects", function() {
  return todoManager.all().length > 0 && todoManager.all().every(todo => {
    return todo.constructor === Todo;
  })
});

test("todoList is initialized with a collection of Todo objects whose property values match the values of the initial todo set (initialTodoSet)", function() {
  console.log(initialTodoSet);
  return todoManager.all().slice(0, 4).every((todo, index) => {
    let props = ['title', 'month', 'year', 'description'];
    return props.every(propName => {
      return todo[propName] === initialTodoSet[index][propName];
    });
  });
});

test("todoList.add adds a new todo object to todoList's collection", function() {
  let todoData = {
    title: 'Buy Waffles',
    month: '1',
    year: '2033',
    description: 'Waffly yum yum',
  };
  todoList.add(todoData);
  let newestItemInList = todoManager.all()[todoManager.all().length - 1];
  return Object.getOwnPropertyNames(todoData).every(prop => {
    return newestItemInList[prop] === todoData[prop];
  })
});

test("todoList.add returns false and does not add a new Todo item to the collection if its todo data argument contains any invalid property names", function() {
  let todoData = {
    title: 'Be the waffle',
    month: '0',
    year: '0',
    description: 'I am one with the waffle',
    waffleType: 'delicious and fluffy',
  };
  let addReturnValue = todoList.add(todoData);
  let newestItem = todoManager.all()[todoManager.all().length - 1];
  console.log(newestItem.description);
  return newestItem.waffleType === undefined && newestItem.description !== "I am one with the waffle" && !addReturnValue;
});

test("todoList.delete deletes the todo item whose id matches its argument", function() {
  let todoData = {
    title: 'Eat Waffles',
    month: '9',
    year: '2007',
    description: 'OOOOOH waffle',
  };
  todoList.add(todoData);
  let todoID = todoManager.all()[todoManager.all().length - 1].id;
  todoList.delete(todoID);
  return todoManager.all().every(todo => {
    return todo.id !== todoID;
  });
});

test("todoList.delete returns false and does not alter the collection of Todo objects if its argument does not exist as an ID in the collection", function() {
  let originalListLength = todoManager.all().length;
  let deleteReturnValue = todoList.delete("a");
  let newListLength = todoManager.all().length;
  return !deleteReturnValue && originalListLength === newListLength;
});

test("todoList.update updates the property values of the existing Todo object whose id matches its first argument", function() {
  let todoData = {
    title: 'Make Waffles',
    month: '1',
    year: '2001',
    description: 'wawful',
  };
  todoList.add(todoData);
  let todoID = todoManager.all()[todoManager.all().length - 1].id;
  todoList.update(todoID, { title: 'Love Waffles'});
  return true;
});

test("todoList.update returns false and does not update the values of an exisiting Todo object when its argument does not exist as an ID in the collection", function() {
  let updateReturnValue = todoList.update("a", { title: "I hate waffles" });
  return !updateReturnValue && todoManager.all().every(todo => todo.title !== "I hate waffles");
});

test("todoList.update returns false and does not update the valyes of an existing Todo object when its second argument contains invalid property names", function() {
  let updateReturnValue = todoList.update("1", { title: "I hate waffles" });
  return !updateReturnValue && todoList.get(1).title !== "I hate waffles";
});

test("todoList.get returns the Todo object whose id property matches its argument", function() {
  let todo = todoList.get(1);
  return todo.id === 1 && todo.constructor === Todo;
});

test("todoList.get returns only a copy of the object whose id property matches its argument", function() {
  return todoList.get(1) !== todoList.get(1);
});

test("todoList.get returns false if its argument does not match the id of any Todo object in todoList's collection", function() {
  let getReturnValue = todoList.get('z');
  return !getReturnValue;
});

test("todoList.filter provides an interface to filter todoList's Todo objects according to the boolean value returned when each is passed to a callback argument", function() {
  let itemsWithOddIDs = todoList.filter(todo => todo.id % 2 === 1);
  let itemsWithEvenIDs = todoList.filter(todo => todo.id % 2 === 0);
  let allItems = todoList.filter(todo => true);
  return itemsWithOddIDs.every(todo => todo.id % 2 === 1) &&
         itemsWithEvenIDs.every(todo => todo.id % 2 === 0) &&
         allItems.length === itemsWithEvenIDs.length + itemsWithOddIDs.length;
});

test("todoList.filter does not provide direct access to the Todo items in todoList", function() {
  let todoListProps = Object.getOwnPropertyNames(todoList);
  return todoListProps.every(propName => {
    return typeof todoList[propName] === 'function';
  });
})

test("todoList.filter returns a collection of Todo objects that are only copies of todoList's Todo objects", function() {
  return todoList.filter(todo => true) !== todoList.filter(todo => true);
});

test("todoList.filter returns an empty array when none of the collection's Todo objects cause the method's callback function argument to return true", function() {
  let noMatches = todoList.filter(todo => false);
  return noMatches.length === 0 && Array.isArray(noMatches);
})

test("todoManager object is defined", function() {
  return typeof todoManager !== "undefined";
});

test("todoManager.all returns all Todo objects in todoList", function() {
  return todoManager.all().length === todoList.filter((todo) => true).length;
});

test("todoManager.allCompleted returns all Todo objects in todoList whose completed property is true", function() {
  todoList.update(1, { completed: true });
  todoList.update(2, { completed: true});
  let completed = todoManager.allCompleted();
  return completed.length === 2 &&
         completed[0].id === 1 &&
         completed[1].id === 2;
});

test("todoManager.allWithinMonthYear returns all Todo objects in todoList whose month and year properties match its arguments", function() {
  let todoDataA = { title: "June", month: '6', year: '1555' };
  let todoDataB = { title: "JuneAgain", month: '6', year: '1555' };
  let todoDataC = { title: "June", month: '6', year: '100' };
  let todoDataD = { title: "Dec", month: '12', year: '1554' };
  [todoDataA, todoDataB, todoDataC, todoDataD].forEach(datum => {
    todoList.add(datum);
  });
  let monthYearMatches = todoManager.allWithinMonthYear('6', '1555');
  return monthYearMatches.length === 2 &&
         monthYearMatches[0].title === "June" &&
         monthYearMatches[1].title === "JuneAgain";
});

test("todoManager.allCompletedWithinMonthYear returns all Todo object in todoList whose completed property is true and whose month and year properties match its arguments", function() {
  todoList.update(1, { title: "WAFFLE1", completed: true, month: '11', year: '1201' });
  todoList.update(2, { completed: true, month: '11', year: '1202' });
  todoList.update(3, { title: "WAFFLE2", completed: true, month: '11', year: '1201' });
  let completedMonthYearMatches = todoManager.allCompletedWithinMonthYear('11', '1201');
  return completedMonthYearMatches.length === 2 &&
         completedMonthYearMatches[0].title === "WAFFLE1" &&
         completedMonthYearMatches[1].title === "WAFFLE2";
});