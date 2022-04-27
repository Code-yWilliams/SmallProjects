document.addEventListener('DOMContentLoaded', () => {
  let request = new XMLHttpRequest();
  request.open('GET', 'https://ls-230-web-store-demo.herokuapp.com/products');
  let content = document.getElementById('content');
  request.addEventListener('load', event => {
    content.innerHTML = event.target.response;
  });
  request.send();

  content.addEventListener('click', function(e) {
    if (e.target.tagName === "A") {
      e.preventDefault();
      let href = e.target.getAttribute('href');
      let request = new XMLHttpRequest();
      request.open('GET', `https://ls-230-web-store-demo.herokuapp.com${href}`);
      request.addEventListener('load', function(e) {
        content.innerHTML = request.response;
      });
      request.send();
    }
  });

  content.addEventListener('submit', function(e) {
    e.preventDefault();
    let request = new XMLHttpRequest();
    let form = e.target;
    let data = new FormData(form);
    let href = form.getAttribute('action');
    request.open('POST', `https://ls-230-web-store-demo.herokuapp.com${href}`);
    request.setRequestHeader('Authorization', 'token AUTH_TOKEN');
    request.addEventListener('load', function() {
      content.innerHTML = request.response;
    });
    request.send(data);
  });

  let r = new XMLHttpRequest();
  r.open('POST', 'https://ls-230-web-store-demo.herokuapp.com/v1/products');
  r.setRequestHeader('Content-Type', 'application/json, charset=utf-8');
  r.setRequestHeader('Authorization', 'token AUTH_TOKEN')
  let data = JSON.stringify({ name: 'Cody', sku: 'C3975W', price: 100});
  r.addEventListener('load', function(e) {
    console.log('load');
  });
  r.send(data);
});
