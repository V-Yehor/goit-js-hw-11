import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const list = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

loadBtn.classList.add('ishidden');

const baseUrl = 'https://pixabay.com/api/';
const API_KEY = '39772594-ca36ede13ec9fedd73f09e8f7';
const per_page = 40;
let page = 1;
let searchQuery = '';

form.addEventListener('submit', onFormSubmit);
loadBtn.addEventListener('click', onLoadBntClick);

async function onFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();
  page = 1;
  list.innerHTML = '';
  loadBtn.classList.add('ishidden');
  if (!searchQuery) {
    loadBtn.classList.add('ishidden');
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }
  const { hits, totalHits } = await searchImages(searchQuery);
  loadBtn.classList.remove('ishidden');

  if (hits.length === 0) {
    loadBtn.classList.add('ishidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (totalHits < per_page) {
    loadBtn.classList.add('ishidden');
  } else {
    loadBtn.classList.remove('ishidden');
  }
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  renderMarkup(hits);
}

async function searchImages(searchQuery, page = 1) {
  const { data } = await axios.get(
    `${baseUrl}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${per_page}&page=${page}`
  );
  return data;
}

function renderMarkup(serchArr) {
  const markup = serchArr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div>`
    )
    .join('');
  list.insertAdjacentHTML('beforeend', markup);
}

async function onLoadBntClick(event) {
  page += 1;
  const { hits, totalHits } = await searchImages(searchQuery, page);
  const totalpage = Math.ceil(totalHits / per_page);
  renderMarkup(hits);

  if (page > totalpage) {
    loadBtn.classList.add('ishidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
