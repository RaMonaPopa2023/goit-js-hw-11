export function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <div class="info-card">
      <a href="${largeImageURL}" data-lightbox="gallery" data-title="${tags}">
        <img src="${webformatURL}" class="info-img" alt="${tags}" loading="lazy" />
      </a>
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
    </div>
  `;
}
export function updateNewsList(markup) {
  function initializeLightbox() {
    const lightbox = new SimpleLightbox('.info-card a', {
      captionsData: 'title',
    });
    lightbox.refresh();
  }

  const articlesWrapper = document.getElementById('articlesWrapper');
  articlesWrapper.innerHTML += markup;
  initializeLightbox();
}
