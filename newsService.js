import customHttp from './http.js';
import formService from './formService.js';

const newsService = () => {
    const apiKey = '78aabb27d13b4aed94bd1dc5ac2ac5d6';
    const baseUrl = 'https://newsapi.org/v2/';

    const http = customHttp();

    const form = formService();

    const news_container = document.querySelector('.news-container .container .row');

    const fetchTopHeadlines = (country = 'ru', fn) => {
        http.get(`${baseUrl}/top-headlines?country=${country}&apiKey=${apiKey}`, fn);
    }

    const fetchAllNews = (query, fn) => {
        http.get(`${baseUrl}/everything?q=${query}&apiKey=${apiKey}`, fn);
    }

    const loadNews = () => {
        const countrySelected = form.country.value;
        const searchText = form.search.value;

        console.log(countrySelected, searchText);

        showLoader(news_container);

        if (!searchText) {
            fetchTopHeadlines(countrySelected, onGetResponse);
        }
        else {
            fetchAllNews(searchText, onGetResponse);
        }
    }

    function onGetResponse(err, res) {
        hideLoader();
        if (err) {
            showErrorMessage(err, 'error-msg');
            return false;
        }

        if (!res.articles.length) {
            showErrorMessage('Found nothing, sorry...', 'error-msg');
            return false;            
        }
        renderNews(res.articles);
    }

    function renderNews(news) {        
        console.log(news);
        
        let fragment = '';
        news.forEach(element => {
            const el = renderNewsRow(element);
            fragment += el;
        });
        
        clearContainer(news_container);
        news_container.insertAdjacentHTML('afterbegin', fragment);
    }

    function renderNewsRow({author, content, description, publishedAt, source, title, url, urlToImage}) {
        const img = urlToImage ? urlToImage : './noimage.jpg';
        const short_title = title ? title.substr(0, 80) + '...' : '';
        const news_desc = description ? description : title;
        return `
            <div class="col s6">
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="${img}" alt="${title || ''}">
                        <span class="card-title">${title || ''}</span>
                    </div>   
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${short_title || ''}<i class="material-icons right">more_vert</i></span>
                        <p><a href="${url}">${author}, ${publishedAt}</a></p>                            
                    </div> 
                    <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">${short_title || ''}<i class="material-icons right">close</i></span>
                        <p>${news_desc || ''}</p>
                    </div>   
                </div>         
            </div>
        `;
    }

    function showErrorMessage(msg, type = "success") {
        M.toast({html: msg, classes: type});
    }

    function clearContainer(container) {
        container.innerHtml = "";
    }

    function showLoader(container) {
        const loader = `
            <div class="progress">
                <div class="indeterminate"></div>
            </div>
        `;
        container.insertAdjacentHTML('beforeEnd', loader);
    }

    function hideLoader() {
        const loader = document.querySelector(".progress");
        if (loader) {
            loader.remove();
        }
    }    

    return {
        fetchTopHeadlines, 
        fetchAllNews, 
        loadNews, 
    };
}

export default newsService;