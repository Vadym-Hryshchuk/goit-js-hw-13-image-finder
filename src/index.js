import './sass/main.scss';
import imageCardMarkup from './templates/photo-card.hbs';
import PixabayApiService from './apiService';

const basicLightbox = require('basiclightbox');
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  onLoadMoreBtn: document.querySelector('.button'),
  messageField: document.querySelector('.message'),
};

const message = {
  alert: 'Не можна проводити пошук із порожнім значенням поля для вводу!',
  error: 'За Вашим запитом нічого не знайдено. Будь ласка, повторіть спробу!',
};

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.onLoadMoreBtn.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', showLightbox);

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.searchQuery = e.currentTarget.elements.query.value;

  if (pixabayApiService.searchQuery === '') {
    refs.messageField.innerText = message.alert;
    refs.onLoadMoreBtn.disabled = true;

    addGalleryBodyIsHidden();
    toggleMessageFieldIsHidden();
    addSetTimeOut(toggleMessageFieldIsHidden);
    clearGallery();
    return;
  }
  pixabayApiService.resetPage();
  pixabayApiService.fetchImages().then(hits => {
    if (hits.length !== 0) {
      removeGalleryBodyIsHidden();
      clearGallery();
      appendImageCardMarkup(hits);
      refs.onLoadMoreBtn.disabled = false;
      return;
    }
    clearGallery();
    refs.messageField.innerText = message.error;
    refs.onLoadMoreBtn.disabled = true;
    addGalleryBodyIsHidden();
    toggleMessageFieldIsHidden();
    addSetTimeOut(toggleMessageFieldIsHidden);
  });
}

function onLoadMore() {
  pixabayApiService.fetchImages().then(response => {
    appendImageCardMarkup(response);
    refs.gallery.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
}

function showLightbox(e) {
  if (e.target.nodeName === 'IMG') {
    basicLightbox.create(`<img src="${e.target.attributes.srcset.value}">`).show();
  }
}

function appendImageCardMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imageCardMarkup(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function toggleMessageFieldIsHidden() {
  refs.messageField.classList.toggle('is-hidden');
}
function addGalleryBodyIsHidden() {
  refs.gallery.classList.add('is-hidden');
}
function removeGalleryBodyIsHidden() {
  refs.gallery.classList.remove('is-hidden');
}
function addSetTimeOut(anotherFunction) {
  setTimeout(() => {
    anotherFunction();
  }, 4000);
}
