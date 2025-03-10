
const apiKey = 'c7e03b8186d6a9df494635d40626dd17';
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieContainer = document.getElementById('movie-container');
const skeletonLoader = document.getElementById('skeleton-loader');
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2UwM2I4MTg2ZDZhOWRmNDk0NjM1ZDQwNjI2ZGQxNyIsIm5iZiI6MTc0MTIwODUwMy43NTYsInN1YiI6IjY3YzhiYmI3ODIxYzE5YjVlYmU3MTM5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fFW-0_CRg_fPggZFwTN3Y7JkrZAvYAWAzyFDXJKyRQQ'
    }
  };
  
  fetch('https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1', options)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));

// Function to fetch movie data from API
async function fetchMovieData(query) {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2UwM2I4MTg2ZDZhOWRmNDk0NjM1ZDQwNjI2ZGQxNyIsIm5iZiI6MTc0MTIwODUwMy43NTYsInN1YiI6IjY3YzhiYmI3ODIxYzE5YjVlYmU3MTM5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fFW-0_CRg_fPggZFwTN3Y7JkrZAvYAWAzyFDXJKyRQQ'
      }
    };

    const response = await fetch(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${query}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to render movie posters
function renderMoviePosters(movies) {
  const movieHTML = movies.map((movie) => {
    return `
      <div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        <div class="movie-info">
          <h2>${movie.title}</h2>
          <p>Year: ${movie.release_date}</p>
        </div>
      </div>
    `;
  }).join('');
  movieContainer.innerHTML = movieHTML;
}

// Function to handle search input change
function handleInputChange() {
  const query = searchInput.value.trim();
  if (query) {
    skeletonLoader.style.display = 'flex';
    fetchMovieData(query).then((data) => {
      if (data.results.length > 0) {
        renderMoviePosters(data.results);
        skeletonLoader.style.display = 'none';
      } else {
        movieContainer.innerHTML = '<p>No movies found.</p>';
        skeletonLoader.style.display = 'none';
      }
    });
  } else {
    movieContainer.innerHTML = '';
    skeletonLoader.style.display = 'none';
  }
}

// Function to handle search button click
function handleSearchButtonClick() {
  const query = searchInput.value.trim();
  if (query) {
    skeletonLoader.style.display = 'flex';
    fetchMovieData(query).then((data) => {
      if (data.results.length > 0) {
        renderMoviePosters(data.results);
        skeletonLoader.style.display = 'none';
      } else {
        movieContainer.innerHTML = '<p>No movies found.</p>';
        skeletonLoader.style.display = 'none';
      }
    });
  } else {
    movieContainer.innerHTML = '';
    skeletonLoader.style.display = 'none';
  }
}

// Add event listeners
searchInput.addEventListener('input', handleInputChange);
searchBtn.addEventListener('click', handleSearchButtonClick);






