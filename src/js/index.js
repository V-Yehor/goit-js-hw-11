import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const list = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

const baseUrl = 'https://pixabay.com/api/';
const API_KEY = '39772594-ca36ede13ec9fedd73f09e8f7';
let page = 1;

loadBtn.classList.add('ishidden');

form.addEventListener('submit', event => {
  loadBtn.classList.add('ishidden');
  event.preventDefault();
  const serchOpt = event.currentTarget.elements.searchQuery.value;
  console.log(serchOpt);
  // form.reset();
  serchImages(serchOpt);
});

async function serchImages(serchOpt, page = 1) {
  try {
    const response = await axios.get(
      `${baseUrl}?key=${API_KEY}&q=${serchOpt}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    const serchData = response.data;
    const markup = createMarkup(serchData.hits);
    const maxHits = serchData.totalHits;
    console.log(serchData);
    // console.log(maxHits);

    list.innerHTML = markup;
    loadBtn.classList.remove('ishidden');

    // loadBtn.addEventListener('click', () => {   //to fix
    //   page += 1;
    //   list.insertAdjacentHTML('beforeend', markup);
    // });

    if (serchData.hits.length === 0) {
      loadBtn.classList.add('ishidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
  }
}

function createMarkup(serchArr) {
  return serchArr
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
}
