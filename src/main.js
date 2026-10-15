const search = document.querySelector('#search-input');
const category = document.querySelector('#category');
const articles = [...document.querySelectorAll('[data-post]')];
const empty = document.querySelector('#no-results');
const count = document.querySelector('#result-count');

function filterPosts() {
  const query = (search?.value || '').trim().toLocaleLowerCase();
  const selected = category?.value || '';
  let visible = 0;
  for (const article of articles) {
    article.hidden = !((article.dataset.search || '').includes(query) && (!selected || article.dataset.category === selected));
    if (!article.hidden) visible++;
  }
  if (empty) empty.hidden = visible > 0;
  if (count) count.textContent = `${visible} 篇文章`;
}
if (search) {
  search.value = new URLSearchParams(location.search).get('q') || '';
  search.addEventListener('input', filterPosts);
}
category?.addEventListener('change', filterPosts);
if (search || category) filterPosts();
