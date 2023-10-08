import axios from 'axios';
const baseUrl = 'https://pixabay.com/api/';
const API_KEY = '39772594-ca36ede13ec9fedd73f09e8f7';
const per_page = 40;
const list = document.querySelector('.gallery');

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

export { per_page, list, searchImages, renderMarkup };
