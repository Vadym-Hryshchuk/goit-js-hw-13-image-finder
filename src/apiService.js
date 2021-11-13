
const API_KEY = '24229447-882d2f373c0694f721fc94563';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 12;

export default class PixabayApiService {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
    }
    fetchImages() {
        const url = `${BASE_URL}?key=${API_KEY}&image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=${PER_PAGE}`;
        return fetch(url)
            .then(response => response.json())
            .then(({ hits }) => {
                this.increasePage();
                return hits;
            });
    }
    increasePage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
}

