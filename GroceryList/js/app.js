$().ready(function(e) {
  $('form').on('submit', function(e) {
    e.preventDefault();
    let itemName = $('#name').val() || 'N/A';
    console.log(itemName);
    let itemQuantity = parseFloat($('#quantity').val()) || 1;
    let listItem = $(document.createElement('li'));
    listItem.text(`${itemQuantity} ${itemName}`);
    let groceryList = $('#grocery-list');
    groceryList.append(listItem);
    $('form').trigger('reset');
  });
});

