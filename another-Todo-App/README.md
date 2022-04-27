
# ASSUMPTIONS FOR TODO APPLICATION LOGIC

- ID numbers don't have to reflect the number of todo items in existence (next ID number increases even if a todo item is deleted)
- 'completed' property cannot be explicitly set to true when initializing a new Todo object. It must be changed via the 'update' method
  on the todoList object
- todo data used for creating todo objects can only contain 'title', 'month', 'year', and 'description' properties with string values and do not require
  any content validation (e.g. application does not check if a given month value corresponds to an integer between 1 and 12)
- todo data used for updating existing todo objects will only contain string values, with exception for completed property values which are boolean values
- to prevent other objects from accessing its collection directly, todoList's collection is private
- Todo.prototype.isWithinMonthYear accepts arguments of any type, but will only return true if the values provided are strings that match the month & year values
  of the calling object. The method assumes it will be invoked with valid arguments and does not perform validation
- to allow todoManager to interface with todoList and access its private Todo object collection, todoList must have a method (filter) that provides copies of its
  Todo objects
- if todo data contains any property names that are invalid (valid property names are title, month, year & description), it will not add a new Todo object to
  its collection
- the application only requires one todoList and one todoManager, so each of these objects is a singleton.

  
  