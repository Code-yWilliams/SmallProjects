document.addEventListener('DOMContentLoaded', function(e) {
  let templates = {};
  initHandlebars();
  let photosData;
  renderAllPhotos().then(() => {
                     bindPhotoNavEventListeners();
                     renderPhotoInfo(photosData[0].id);
                     renderPhotoComments(photosData[0].id)
                 }).then(() => {
                   bindLikeEventListener();
                   bindFavoriteEventListener();
                   bindCommentEventListener();
                 });

  async function renderAllPhotos() {
    let response = await fetch('/photos');
    photosData = await response.json();
    let slidesDiv = document.querySelector('#slides');
    slidesDiv.innerHTML = templates['photos']({ photos: photosData });
  }

  function renderPhoto(photoIndex) {
    let targetFigure = document.querySelector(`#slides figure[data-id='${photoIndex}']`);
    targetFigure.classList.remove('hidden');
    targetFigure.classList.add('visible');
  }

  function renderPhotoInfo(photoIndex) {
    let photoData = photosData.find(photo => {
      return photo.id === photoIndex;
    });
    let header = document.querySelector('header');
    header.innerHTML = templates['photo_information'](photoData);
  }

  async function renderPhotoComments(photoIndex) {
    let path = `/comments?photo_id=${photoIndex}`
    let response = await fetch(path);
    let commentsJSON = await response.json();
    let commentsList = document.querySelector('#comments ul');
    commentsList.innerHTML = templates['photo_comments']({ comments: commentsJSON });
  }

  function bindLikeEventListener() {
    document.addEventListener('click', likeEventHandler);
  }

  function likeEventHandler(e) {
    if (e.target.classList.contains('like', 'button')) {
      e.preventDefault();
      let currentPhoto = document.querySelector('.visible');
      let currentPhotoId = parseInt(currentPhoto.dataset.id);
      let data = JSON.stringify({ photo_id: currentPhotoId });
      let path = 'photos/like';
      fetch(path, { method: 'POST',
                    body: data,
                    headers: { 'Content-Type': 'application/json' },
                   })
                   .then(response => response.json())
                   .then(json => {
                     let likesCount = json.total;
                     let likeButton = e.target;
                     likeButton.textContent = `♡ ${likesCount} Likes`;
                   });
    }
  }

  function bindFavoriteEventListener() {
    document.addEventListener('click', favoriteEventHandler);
  }

  function favoriteEventHandler(e) {
    if (e.target.classList.contains('favorite', 'button')) {
      e.preventDefault();
      let currentPhoto = document.querySelector('.visible');
      let currentPhotoId = parseInt(currentPhoto.dataset.id);
      let data = JSON.stringify({ photo_id: currentPhotoId });
      let path = 'photos/favorite';
      fetch(path, { method: 'POST',
                    body: data,
                    headers: { 'Content-Type': 'application/json' },
                  })
                  .then(response => response.json())
                  .then(json => {
                    let favoritesCount = json.total;
                    let favoriteButton = e.target;
                    favoriteButton.textContent = `☆ ${favoritesCount} Favorites`;
                  });
                }
  }

  function bindCommentEventListener() {
    let form = document.querySelector('form');
    form.addEventListener('submit', commentEventHandler);
  }

  function commentEventHandler(e) {
    e.preventDefault()
    let form = document.querySelector('form');
    let formData = new FormData(form);
    let dataObject = {};
    formData.forEach((value, key) => dataObject[key] = value);
    let dataJSON = JSON.stringify(dataObject);
    let path = 'comments/new';
    fetch(path, { method: 'POST',
                  body: dataJSON,
                  headers: { 'Content-Type': 'application/json' },
                })
                .then(response => response.json())
                .then(json => {
                  let comment = templates['photo_comment'](json);
                  let commentsList = document.querySelector('#comments ul');
                  commentsList.insertAdjacentHTML('beforeend', comment);
                  form.reset();
                });
  }

  function bindPhotoNavEventListeners() {
    let prevButton = document.querySelector('.prev');
    let nextButton = document.querySelector('.next');
    [prevButton, nextButton].forEach(button => {
      button.addEventListener('click', photoNavEventHandler)
    });
  }

  function photoNavEventHandler(e) {
    e.preventDefault();
    let currentPhoto = document.querySelector('.visible');
    let currentPhotoId = parseInt(currentPhoto.dataset.id);
    let maxPhotoId = maxBy(photosData, 'id');
    let nextPhotoId = currentPhotoId + 1 > maxPhotoId ? 1 : currentPhotoId + 1;
    let prevPhotoId = currentPhotoId - 1 || maxPhotoId;
    let targetPhotoId;
    
    if (e.currentTarget.classList.contains('prev')) {
      targetPhotoId = prevPhotoId;
    } else if (e.currentTarget.classList.contains('next')) {
      targetPhotoId = nextPhotoId;
    }

    renderPhoto(targetPhotoId);
    currentPhoto.classList.remove('visible');
    currentPhoto.classList.add('hidden');
    renderPhotoInfo(targetPhotoId);
    renderPhotoComments(targetPhotoId);
  }

  function initHandlebars() {
    compileTemplates();
    registerPartials();
    registerHelpers();
  }

  function compileTemplates() {
    let htmlTemplates = document.querySelectorAll("script[type='text/x-handlebars']");
    htmlTemplates.forEach(template => {
      let id = template.getAttribute('id');
      let html = template.innerHTML;
      templates[id] = Handlebars.compile(html);
      if (template.dataset.type !== 'partial') template.remove();
    });
  }

  function registerPartials() {
    let htmlPartials = document.querySelectorAll("script[data-type='partial']");
    htmlPartials.forEach(partial => {
      let id = partial.getAttribute('id');
      let html = partial.innerHTML;
      Handlebars.registerPartial(id, html);
      partial.remove();
    });
  }

  function registerHelpers() {
    Handlebars.registerHelper('isFirstId', function(id) {
      return id === 1;
    })
  }
});

function maxBy(arr, callback) {
  return Math.max(...arr.map(typeof callback === 'function' ? callback : value => value[callback]));
}
