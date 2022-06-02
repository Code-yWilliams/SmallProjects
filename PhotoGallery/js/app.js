$(function() {
  let $figure = $('figure');
  let $photo = $('figure img');
  let $caption = $('figcaption');
  let $photoLinks = $('li a');

  $photoLinks.on('click', changePhoto);

  function changePhoto(e) {
    e.preventDefault();
    console.log(e.currentTarget);
    $figure.stop()
    let $selectedPhoto = $(e.currentTarget).find('img');
    let selectedPhotoSource = $selectedPhoto.attr('src');
    let selectedPhotoTitle = $selectedPhoto.attr('title');
   
    $('li img').css('border', '3px solid #ffffff');
    $selectedPhoto.css('border', '3px solid #0000FF');

    $figure.fadeOut(400, () => {
      $photo.attr('src', selectedPhotoSource);
      $caption.text(selectedPhotoTitle);
      $figure.fadeIn();
    });
  }
});