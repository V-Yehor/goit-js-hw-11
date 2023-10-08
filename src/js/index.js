import Notiflix from 'notiflix';
import { per_page, list, searchImages, renderMarkup } from './api';

const form = document.querySelector('#search-form');
const loadBtn = document.querySelector('.load-more');

loadBtn.classList.add('ishidden');

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

  if (hits === 0) {
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

async function onLoadBntClick(event) {
  page += 1;
  const { hits, totalHits } = await searchImages(searchQuery, page);
  const totalpage = Math.ceil(totalHits / per_page);
  renderMarkup(hits);

  if (page === totalpage) {
    loadBtn.classList.add('ishidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
