function rewrite() {
  const h1 = document.createElement('h1');
  const h1Text = document.createTextNode("The Day's News");
  h1.appendChild(h1Text);
  const h2 = document.querySelector('h2');
  document.body.replaceChild(h1, h2);

  const article = document.createElement('article');
  article.classList.add('breaking');

  const fireParagraph = document.createElement('p');
  const fireParagraphText = document.createTextNode('Fire breaks out at the old factory');
  fireParagraph.appendChild(fireParagraphText);
  article.appendChild(fireParagraph);

  const readMoreParagraph = document.createElement('p');
  const readMoreAnchor = document.createElement('a');
  const readMoreAnchorText = document.createTextNode('Read More');
  readMoreAnchor.appendChild(readMoreAnchorText);
  readMoreAnchor.setAttribute('href', '/stories/15');
  readMoreParagraph.appendChild(readMoreAnchor);
  article.appendChild(readMoreParagraph);

  const frontPageDiv = document.querySelector('.front-page');
  frontPageDiv.insertAdjacentElement('afterbegin', article);
}