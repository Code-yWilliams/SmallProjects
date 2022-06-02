$(function() {
  let $modal = $('#modal');
  let $modalLayer = $('#modal-layer');
  let $modalCloseButton = $('#close-button');
  let $modalTitle = $('#modal h3');
  let $modalImage = $('#modal img');
  let $modalText = $('#modal p');
  let $teamLinks = $('#team li a');

  let $modalAndLayer = $('#modal, #modal-layer');
  hideModal();
  $modalAndLayer.attr('class', '');
  
  $teamLinks.on('click', showModal);
  $modalLayer.on('click', hideModal);
  $modalCloseButton.on('click', hideModal);
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      hideModal(e);
    }
  })


  function showModal(e) {
    e.preventDefault()
    $modal.show();
    $modalLayer.show();
    let $clickedLink = $(e.target).closest('a');
    console.log($clickedLink);
    $modalTitle.text($clickedLink.data('name'));
    let imageSrc = $clickedLink.data('image-source');
    $modalImage.attr('src', imageSrc);
    $modalImage.attr('alt', $clickedLink.data('name'));
    $modalText.text($clickedLink.data('text'));
    $modal.animate({
      opacity: '1',
      visibility: 'visible',
    }, 500);
  }

  function hideModal(e) {
    if (e) e.preventDefault();
 
    $modalTitle.text('');
    $modalImage.attr('src', '');
    $modalImage.attr('alt', '');
    $modalText.text('');
    $modal.animate({
      opacity: '0',
      visibility: 'hidden',
    }, 0);
    $modal.hide();
    $modalLayer.hide();
  }
})