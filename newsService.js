import customHttp from './http.js';
import formService from './formService.js';

const newsService = () => {
    const apiKey = '8f6ecc34024d4a669e57eab1cdf2310c';
    const baseUrl = 'https://api.worldnewsapi.com/search-news';  

    const http = customHttp();

    const form = formService();

    const news_container = document.querySelector('.news-container .container .row');

    const fetchNews = (country = 'ru', q = null, fn) => {
        let language = "ru";
        if (country === 'us') {
            language = "en";
        }
        const params = {
            "api-key": apiKey,
            "source-countries": country,
            "language": language,
            "sort": "publish-time",
            "sort-direction": "DESC",
            "number": 25
        };
        if (q) {
            params.text = q;
        }
        const url_params = new URLSearchParams(params).toString();
        const url = `${baseUrl}?${url_params}`;
        http.get(url, fn);
    }

    const loadNews = () => {
        const countrySelected = form.country.value;
        const searchText = form.search.value;

        showLoader(news_container);
        fetchNews(countrySelected, searchText, onGetResponse);
    }

    function onGetResponse(err, res) {
        hideLoader();
        //console.log(res);

        if (err) {
            showErrorMessage(err, 'error-msg');
            return false;
        }

        if (!res.news.length) {
            showErrorMessage('Found nothing, sorry...', 'error-msg');
            return false;            
        }
        renderNews(res.news);
    }

    function renderNews(news) {              
        let fragment = '';
        news.forEach(element => {
            const el = renderNewsRow(element);
            fragment += el;
        });
        
        clearContainer(news_container);
        news_container.insertAdjacentHTML('afterbegin', fragment);
    }

    function renderNewsRow({id, title, text, url, image, publish_date, language, source_country}) {
        const img = image ? image : './noimage.jpg';
        const short_title = (title.length > 80) ? title.substr(0, 80) + '...' : title;

        return `
            <div class="col s6">
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="${img}" alt="${url}">
                        <span class="card-title">${title}</span>
                    </div>   
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${short_title}<i class="material-icons right">more_vert</i></span>
                        <p><a href="${url}">${publish_date}</a></p>                            
                    </div> 
                    <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">${short_title}<i class="material-icons right">close</i></span>
                        <p>${text}</p>
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
        fetchNews, 
        loadNews, 
    };
}

export default newsService;