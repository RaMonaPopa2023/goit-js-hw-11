import PhotosApi from './PhotosApi.js';
import { createMarkup, updateNewsList } from './markup.js';
import LoadMoreBtn from './LoadMoreBtn.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.getElementById('search-form');
const photosApi = new PhotosApi();
let currentPage = 1;
let totalHits = 0;
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});
const imagesPerPage = 40;
let initialRequestMade = false;

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchPhotos);

async function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const inputValue = form.searchQuery.value;
  resetPage();
  clearNewsList();
  loadMoreBtn.show();

  try {
    const response = await photosApi.searchPhotos(
      inputValue,
      currentPage,
      imagesPerPage
    );

    if (Array.isArray(response)) {
      if (response.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        if (!initialRequestMade) {
          initialRequestMade = true;
          totalHits = response.totalHits;
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }

        const markup = response.reduce(
          (markup, article) => createMarkup(article) + markup,
          ''
        );
        updateNewsList(markup);
        loadMoreBtn.enable();
      }
    } else {
      throw new Error('Invalid API response');
    }
  } catch (err) {
    onError(err);
  }
}

function fetchNextPage() {
  currentPage++;
  fetchPhotos();
}

function resetPage() {
  currentPage = 1;
}
function fetchPhotos() {
  loadMoreBtn.disable();

  if (currentPage * imagesPerPage >= totalHits) {
    loadMoreBtn.hide();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  return photosApi
    .searchPhotos(form.searchQuery.value, currentPage, imagesPerPage)
    .then(response => {
      if (!Array.isArray(response)) throw new Error('Invalid API response');

      if (response.length === 0) throw new Error('No data');

      const markup = response.reduce(
        (markup, article) => createMarkup(article) + markup,
        ''
      );
      updateNewsList(markup);
      loadMoreBtn.enable();
      currentPage++;
    })
    .catch(onError);
}

function onError(err) {
  console.error(err);
  updateNewsList(`<p>Nu am gasit rezultate </p>`);
}

function clearNewsList() {
  document.getElementById('articlesWrapper').innerHTML = '';
}

function updateNewsList(markup) {
  document
    .getElementById('articlesWrapper')
    .insertAdjacentHTML('beforeend', markup);
}
