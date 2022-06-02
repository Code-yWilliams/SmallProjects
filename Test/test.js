$(function(e) {
  $('a').on('click', function(e) {
    let target = $(this);
    console.log(target.data('block'));
    $('article').hide().filter(`[data-block=${target.data('block')}]`).show();
  });
});