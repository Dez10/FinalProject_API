// Constants
const API_KEY = "dea5019f7f916a679bd081c6903a37e1";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&api_key=" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?api_key=" + API_KEY;

// Genres array
const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
];

// DOM Elements
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
const overlayContent = document.getElementById("overlay-content");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

// Variables for pagination and state
let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 100;
let selectedGenres = [];
let activeSlide = 0;
let totalVideos = 0;

// Get initial movies
getMovies(API_URL);

// Navigation Functions
function showHomePage() {
  document.getElementById('home-link').classList.add('active');
  document.getElementById('search-results').classList.remove('active');
  document.getElementById('search-results').classList.add('hidden');
  search.value = ''; // Clear search input
  selectedGenres = []; // Clear selected genres
  setGenre(); // Reset genre selections
  getMovies(API_URL); // Load popular movies
}
function showSearchResults(searchTerm) {
  document.getElementById('home-link').classList.remove('active');
  document.getElementById('search-results').classList.remove('hidden');
  document.getElementById('search-results').classList.add('active');
  document.getElementById('search-results').textContent = `Search Results: "${searchTerm}"`;
}


// Function to fetch movies
function getMovies(url) {
    lastUrl = url;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.results.length !== 0){
                showMovies(data.results);
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;

                if(current) {
                    current.innerText = currentPage;
                }

                if(prev && next) {
                    if(currentPage <= 1){
                        prev.classList.add('disabled');
                        next.classList.remove('disabled');
                    }else if(currentPage >= totalPages){
                        prev.classList.remove('disabled');
                        next.classList.add('disabled');
                    }else{
                        prev.classList.remove('disabled');
                        next.classList.remove('disabled');
                    }
                }

                if(tagsEl) {
                    tagsEl.scrollIntoView({behavior : 'smooth'});
                }
            }else{
                main.innerHTML= `<h1 class="no-results">No Results Found</h1>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            main.innerHTML = `<h1 class="no-results">Error loading movies. Please try again.</h1>`;
        });
}

// Function to display movies
function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : "https://placehold.co/400x600/png"}" 
                 alt="${title}"
                 loading="lazy">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" data-id="${id}">Know More</button>
            </div>
        `;

        main.appendChild(movieEl);

        // Add event listener for "Know More" button
        const button = movieEl.querySelector('.know-more');
        if (button) {
            button.addEventListener('click', () => {
                openNav(movie);
            }, { passive: true });
        }
    });
}

// Genre Functions
function setGenre() {
    if (!tagsEl) return;
    tagsEl.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    
    genres.forEach(genre => {
        const tag = document.createElement("div");
        tag.classList.add("tag");
        tag.id = genre.id;
        tag.innerText = genre.name;
        tag.addEventListener("click", () => {
            if (selectedGenres.includes(genre.id)) {
                selectedGenres = selectedGenres.filter(id => id !== genre.id);
            } else {
                selectedGenres.push(genre.id);
            }
            console.log(selectedGenres);
            highlightSelection();
            getMovies(API_URL + '&with_genres=' + encodeURIComponent(selectedGenres.join(',')));
        }, { passive: true });
        fragment.appendChild(tag);
    });

    tagsEl.appendChild(fragment);
    addClearButton();
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    });

    if (selectedGenres.length !== 0) {
        selectedGenres.forEach(id => {
            const highlightedTag = document.getElementById(id);
            if (highlightedTag) {
                highlightedTag.classList.add('highlight');
            }
        });
    }
}

function addClearButton() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight');
    } else {
        const clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear ×';
        clear.addEventListener('click', () => {
            selectedGenres = [];
            setGenre();
            getMovies(API_URL);
        }, { passive: true });
        tagsEl?.appendChild(clear);
    }
}

// Video Overlay Functions
function openNav(movie) {
    if (!overlayContent) return;
    
    overlayContent.innerHTML = '<div class="loading">Loading...</div>';
    document.getElementById("myNav").style.width = "100%";

    fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {
            if (videoData && videoData.results.length > 0) {
                showVideos(videoData.results);
            } else {
                overlayContent.innerHTML = `<h1 class="no-results">No Videos Found</h1>`;
            }
        })
        .catch(error => {
            console.error('Error loading videos:', error);
            overlayContent.innerHTML = `<h1 class="no-results">Error Loading Videos</h1>`;
        });
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

function showVideos(videos) {
    if (!overlayContent) return;

    activeSlide = 0;
    totalVideos = videos.length;

    let youtubeVideos = videos.filter(video => video.site === "YouTube");
    
    if (youtubeVideos.length === 0) {
        overlayContent.innerHTML = `<h1 class="no-results">No YouTube Videos Available</h1>`;
        return;
    }

    overlayContent.innerHTML = `
        <h1 class="no-results">${youtubeVideos[0].name}</h1>
        <br/>
        
        ${youtubeVideos.map((video, idx) => `
            <iframe 
                class="embed ${idx === 0 ? 'show' : 'hide'}"
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/${video.key}" 
                title="${video.name}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
            ></iframe>
        `).join('')}
        
        <br/>
        
        <div class="dots">
            ${youtubeVideos.map((_, idx) => `
                <span class="dot ${idx === 0 ? 'active' : ''}">${idx + 1}</span>
            `).join('')}
        </div>
    `;
}

// Video Navigation Functions
function navigateVideo(direction) {
    activeSlide = (activeSlide + direction + totalVideos) % totalVideos;
    updateVideoDisplay();
}

function updateVideoDisplay() {
    const embedElements = document.querySelectorAll('.embed');
    const dots = document.querySelectorAll('.dot');
    
    embedElements.forEach((embed, idx) => {
        embed.classList.toggle('show', idx === activeSlide);
        embed.classList.toggle('hide', idx !== activeSlide);
    });

    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeSlide);
    });
}

// Utility Functions
function getColor(vote) {
    if(vote >= 8) return "green";
    if(vote >= 5) return "orange";
    return "red";
}

// Event Listeners
document.getElementById('home-link').addEventListener('click', (e) => {
  e.preventDefault();
  showHomePage();
});

if (form) {
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = search?.value?.trim() ?? '';

      if (searchTerm) {
          selectedGenres = []; // Clear genres when searching
          highlightSelection();
          getMovies(searchURL + '&query=' + encodeURIComponent(searchTerm));
          showSearchResults(searchTerm); // Show search results in nav
      } else {
          showHomePage(); // If search is empty, show home page
      }
  }, { passive: false });
}

if (prev) {
    prev.addEventListener('click', (e) => {
        e.preventDefault();
        if (prevPage > 0) {
            pageCall(prevPage);
        }
    }, { passive: false });
}

if (next) {
    next.addEventListener('click', (e) => {
        e.preventDefault();
        if (nextPage <= totalPages) {
            pageCall(nextPage);
        }
    }, { passive: false });
}

if (leftArrow) {
    leftArrow.addEventListener('click', () => navigateVideo(-1));
}

if (rightArrow) {
    rightArrow.addEventListener('click', () => navigateVideo(1));
}

// Pagination Function
function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length -1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setGenre();
    getMovies(API_URL);
});
