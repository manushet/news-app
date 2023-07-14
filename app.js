import newsService from './newsService.js';
import formService from './formService.js';

document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  news.loadNews();
});

const news = newsService();
news.loadNews();

const form = formService();

form.form.addEventListener("submit", (e) => {
  e.preventDefault();
  news.loadNews();
});

