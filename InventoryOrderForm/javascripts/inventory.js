let inventory;

(function() {
  inventory = {
    lastId: 0,
    collection: [],
    setDate: function() {
      let date = new Date();
      document.querySelector('#order_date').textContent = date.toUTCString();
    },
    cacheTemplate: function() {
      let iTemplate = document.querySelector('#inventory_item');
      this.template = Handlebars.compile(iTemplate.innerHTML);
      iTemplate.remove()
    },
    add: function() {
      this.lastId++;
      let item = {
        id: this.lastId,
        name: "",
        stock_number: "",
        quantity: 1
      };
      this.collection.push(item);

      return item;
    },
    remove: function(idx) {
      this.collection = this.collection.filter(function(item) {
        return item.id !== idx;
      });
    },
    get: function(id) {
      let found_item;

      this.collection.forEach(function(item) {
        if (item.id === id) {
          found_item = item;
          return false;
        }
      });

      return found_item;
    },
    update: function(item) {
      let id = this.findID(item);
      let storedItem = this.get(id);
      storedItem.name = item.querySelector("[name^=item_name]").value;
      storedItem.stock_number = item.querySelector("[name^=item_stock_number]").value;
      storedItem.quantity = item.querySelector("[name^=item_quantity]").value;
    },
    deleteItem: function(e) {
      e.preventDefault();
      let item = this.findParent(e);
      item.remove()

      this.remove(this.findID(item));
    },
    findID: function(item) {
      return +item.querySelector("input[type=hidden]").value
    },
    updateItem: function(e) {
      let item = this.findParent(e);
      this.update(item);
    },
    findParent: function(e) {
      return e.target.closest("tr");
    },
    newItem: function(e) {
      e.preventDefault();
      let item = this.add();
      let itemRow = document.createElement('tr');
      let newTemplate = this.template(item);
      itemRow.innerHTML = newTemplate
      let inventoryTableBody = document.querySelector('#inventory');
      inventoryTableBody.appendChild(itemRow);
    },
    bindEvents: function() {
      let self = this;
      document.querySelector('#add_item').addEventListener('click', this.newItem.bind(this));
      document.querySelector('#inventory').addEventListener('click', function(e) {
        if (e.target === document.querySelector('a.delete')) {
          self.deleteItem.call(self, e);
        }
      });
      document.querySelector('#inventory').addEventListener('blur', function(e) {
        if (e.target.tagName === 'INPUT') {
          console.log(true);
          self.updateItem.call(self, e);
        }
      }, true);
    },
    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    }
  };
})();

document.addEventListener('DOMContentLoaded', function(e) {
  inventory.init.call(inventory);
});
