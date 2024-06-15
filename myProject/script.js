window.onload = function () {
  window.scrollTo(0, 0);
}

window.addEventListener('scroll', function () {
  var header = document.querySelector('.header');
  var scrollPosition = window.scrollY;

  if (scrollPosition > 70) { // Header 70px'den fazla ise
    header.classList.add('fixed');
  } else {
    header.classList.remove('fixed');
  }
});




// hamburger menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const header = document.querySelector(".header");
const body = document.body;

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  header.classList.toggle("active");

  if (header.classList.contains("active")) {
    header.style.backgroundColor = "#19232e";
    body.style.overflow = "hidden";
  } else {
    header.style.backgroundColor = "transparent";
    body.style.overflow = "";
  }
}



// films.json ---- swiper

document.addEventListener('DOMContentLoaded', function () {

  // fetch data from the JSON file and generate the swiper.html
  fetch('films.json')
    .then(response => response.json())
    .then(data => {
      const swiperHTML = `
        <div class="swiper mySwiper">
          <div class="swiper-wrapper">
            ${data.map(movie => `
              <div class="swiper-slide">
                <img src="${movie.Images[0]}" alt="${movie.Title}" class="movie-poster">
                <div class="movie-details">
                  <h2>${movie.Title}</h2>
                  <p>${movie.Genre}</p>
                  <p>${movie.Plot}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // sdd swiper.html to page
      document.querySelector('.swiper-container').innerHTML = swiperHTML;

      // start swiper
      const swiper = new Swiper('.mySwiper', {
        // ...
      });
    })
    .catch(error => console.error('Error:', error));
});



// movies api
// api
const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

// film genres
const genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
]

const movies = document.getElementById('movies');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

// pagination
var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 50;


var selectedGenre = [] // films genres array
setGenre();

// setGenre()
function setGenre() {
  tagsEl.innerHTML = '';
  genres.forEach(genre => { // for - each genres
    const m_tags = document.createElement('div');
    m_tags.classList.add('tag');
    m_tags.id = genre.id;
    m_tags.innerText = genre.name;
    m_tags.addEventListener('click', () => { // click for tag
      if (selectedGenre.length == 0) {  // if selected genres is not on array
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) { // include
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          })
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre)
      getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(','))) // The API request for the selected genres
      highlightSelection()
    })
    tagsEl.append(m_tags);
  })

}

// highlightSelection()
function highlightSelection() {
  const tags = document.querySelectorAll('.tag'); //  all tags with the '.tag' class
  tags.forEach(tag => {
    tag.classList.remove('highlight') // remove .highlight class from all tags.
  })
  clearBtn() // call the function if needed
  if (selectedGenre.length != 0) {
    selectedGenre.forEach(id => {
      const hightlightedTag = document.getElementById(id);
      hightlightedTag.classList.add('highlight');
    })
  }
}

// clearBtn()
function clearBtn() {
  let clearBtn = document.getElementById('clear'); // #clear 
  if (clearBtn) {
    clearBtn.classList.add('highlight')
  } else {
    let clear = document.createElement('div');
    clear.classList.add('tag', 'highlight');
    clear.id = 'clear';
    clear.innerText = 'Clear';
    clear.addEventListener('click', () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    })
    tagsEl.append(clear);
  }
}


// for searching
document.getElementById('search-icon').addEventListener('click', () => {
  const searchTerm = search.value.trim();
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + '&query=' + searchTerm);
  } else {
    getMovies(API_URL);
  }
})


document.addEventListener('DOMContentLoaded', () => {
  getMovies(API_URL); // call getMovies() when the page loaded
  handleResize(); // screen size
});

window.addEventListener('resize', handleResize);

function handleResize() {
  const movieElements = document.querySelectorAll('.movie');
  const totalMovies = movieElements.length;

  // for 601px -768px
  if (window.matchMedia("(min-width: 601px) and (max-width: 768px)").matches) {
    const moviesPerPage = 6;
    for (let i = 0; i < totalMovies; i++) {
      if (i >= moviesPerPage) {
        movieElements[i].style.display = 'none';
      } else {
        movieElements[i].style.display = 'block';
      }
    }
  }
  // for 481px -600px
  else if (window.matchMedia("(min-width: 481px) and (max-width: 600px)").matches) {
    const moviesPerPage = 4;
    for (let i = 0; i < totalMovies; i++) {
      if (i >= moviesPerPage) {
        movieElements[i].style.display = 'none';
      } else {
        movieElements[i].style.display = 'block';
      }
    }
  }
  // for 480px and below
  else if (window.matchMedia("(max-width: 480px)").matches) {
    const moviesPerPage = 2; // 
    for (let i = 0; i < totalMovies; i++) {
      if (i >= moviesPerPage) {
        movieElements[i].style.display = 'none';
      } else {
        movieElements[i].style.display = 'block';
      }
    }
  }
  // for other size
  else {
    for (let i = 0; i < totalMovies; i++) {
      movieElements[i].style.display = 'block';
    }
  }
}

function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results); // if there are results, call showMovies()
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if (currentPage <= 1) {
          prev.classList.add('disabled');
          next.classList.remove('disabled');
        } else if (currentPage >= totalPages) {
          prev.classList.remove('disabled');
          next.classList.add('disabled');
        } else {
          prev.classList.remove('disabled');
          next.classList.remove('disabled');
        }

        tagsEl.scrollIntoView({ behavior: 'smooth' });

        handleResize();

      } else {
        movies.innerHTML = `<h1 class="no-results">No Data Available</h1>`;
      }
    });
}



// showMovies()
function showMovies(data) {
  movies.innerHTML = '';

  data.forEach(movie => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement('div');
    const addFavButtons = document.querySelectorAll('.add-fav');
    movieEl.classList.add('movie');

    // set the inner HTML of the movie element 
    movieEl.innerHTML = `
      <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${vote_average}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>About</h3>
        ${overview}
        <br/> 
        <div class="button-container">
          <button class="know-more" id="${id}">More...</button>
          <button class="add-fav"><i class="fa-regular fa-heart"></i></button>
        </div>
      </div>
    `;
    movies.appendChild(movieEl);

    // add More... button with an event listener
    document.getElementById(id).addEventListener('click', () => {
      console.log(id);
      openNav(movie);
    });

    // add Fav button and LS
    addFavButtons.forEach(button => {
      const movieEl = button.closest('.movie');
      const movieId = movieEl.querySelector('.know-more').id;
      const key = 'movie_' + movieId;

      if (localStorage.getItem(key)) {
        button.innerHTML = '<i class="fa-solid fa-heart"></i>';
        button.disabled = true;
      }
      button.addEventListener('click', () => {
        const movieEl = button.closest('.movie');

        // get films details
        const movieTitle = movieEl.querySelector('h3').innerText;
        const movieId = movieEl.querySelector('.know-more').id;

        // key for local storage
        const key = 'movie_' + movieId;

        // if added before, change icon
        if (localStorage.getItem(key)) {
          button.innerHTML = '<i class="fa-solid fa-heart"></i>';
          return;
        }

        // get favs from LS
        let favMovies = JSON.parse(localStorage.getItem('favMovies')) || [];

        const newMovie = { id: movieId, title: movieTitle, poster_path, vote_average, overview };
        favMovies.push(newMovie);
        localStorage.setItem('favMovies', JSON.stringify(favMovies));
        localStorage.setItem(key, true);

        // alert
        alert('Added to favorites!');

        // change button 
        button.innerHTML = '<i class="fa-solid fa-heart"></i>';
        button.disabled = true;
      });
    });
  });
};


// create overlayContent when click know more button
const overlayContent = document.getElementById('overlay-content');

// openNav()
function openNav(movie) {
  let id = movie.id;
  document.body.style.overflow = 'hidden';
  // api request to fetch the videos of the movie
  fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY)
    .then(res => res.json())
    .then(videoData => {
      console.log(videoData);

      if (videoData) {
        document.getElementById("navigation").style.width = "100%";
        if (videoData.results.length > 0) {
          var embed = [];
          // create an iframe for each video
          videoData.results.forEach((video, idx) => {
            let { name, key, site } = video

            if (site == 'YouTube') { // create an iframe for YouTube video
              embed.push(`
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              `)
            }
          })

          // create content, add to overlayContent
          var content = `
            <h1 class="no-results">${movie.original_title}</h1>
            <br/>
            ${embed.join('')}
          `
          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos(); // show the videos

          // hide .header.fixed elements
          document.querySelectorAll('.header.fixed').forEach(element => {
            element.style.display = 'none';
          });
        } else { // if there aren't result, write 
          overlayContent.innerHTML = `<h1 class="no-results">No Video Available</h1>`
        }
      }
    })
}


// closeNav()
function closeNav() {
  document.getElementById("navigation").style.width = "0%";
}

// variables for the active slide index and total number of videos
var activeSlide = 0;
var totalVideos = 0;

// showVideos()
function showVideos() {
  let embedClasses = document.querySelectorAll('.embed');

  // determine the total number of videos
  totalVideos = embedClasses.length;

  embedClasses.forEach((embedTag, idx) => {
    if (activeSlide == idx) {  // if the active slide matches the current video index
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')

    } else { // if the active slide doesn't matche the current video index
      embedTag.classList.add('hide');
      embedTag.classList.remove('show')
    }
  })

}



// when the prev page button clicked
prev.addEventListener('click', () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
})

// when the next page button clicked
next.addEventListener('click', () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
})


// pageCall()
function pageCall(page) {
  const url = new URL(lastUrl); // parse the last URL
  const params = new URLSearchParams(url.search);  // search params

  params.set('page', page); // update the 'page' parameter with the new page number
  url.search = params.toString(); // update the search params

  getMovies(url.toString());   // call the getMovies function 

}


// connect to TVMaze API and get data
fetch('https://api.tvmaze.com/shows')
  .then(response => response.json())
  .then(data => {
    const shows = data;

    // set the inner HTML of the Carousel
    let carouselContent = '';
    shows.forEach(show => {
      carouselContent += `
        <div class="item" onclick="openMovieModal(${show.id})">
          <div class="cards">
            <div class="card-img">
              <a href="#"><img src="${show.image.medium}" alt="${show.name}"></a>
            </div>
            <div class="card-title">
              <h3 class="tv-title">${show.name}</h3>
              <p class="tv-kind">${show.genres.join(', ')}</p>
            </div>
          </div>
        </div>
      `;
    });

    // choose Carousel element and add content
    const carousel = document.querySelector('.owl-carousel');
    carousel.innerHTML = carouselContent;

    // start Owl Carousel
    $('.owl-carousel').owlCarousel({
      items: 4,
      loop: true,
      autoplay: true,
      autoplayTimeout: 3000,
      responsive: {
        0: {
          items: 1
        },
        480: {
          items: 2
        },
        601: {
          items: 3
        },
        1024: {
          items: 4
        }
      }
    });
  })
  .catch(error => {
    console.error('Hata:', error);
  });


// openMovieModal()

function openMovieModal(showId) {
  fetch(`https://api.tvmaze.com/shows/${showId}`)
    .then(response => response.json())
    .then(show => {
      if (show) {
        document.getElementById("tvSeriesDetailsModalLabel").innerText = show.name;
        document.getElementById("tvSeriesModalImage").src = show.image ? show.image.medium : '';
        document.getElementById("tvSeriesModalSummary").innerHTML = show.summary ? show.summary : 'No summary available';
        document.getElementById("tvSeriesModalRuntime").innerText = show.runtime ? show.runtime : 'N/A';
        document.getElementById("tvSeriesModalRating").innerText = show.rating.average ? show.rating.average : 'N/A';
        document.getElementById("tvSeriesModalLanguage").innerText = show.language ? show.language : 'N/A';
        document.getElementById("tvSeriesModalStatus").innerText = show.status ? show.status : 'N/A';
        document.getElementById("tvSeriesModalEnded").innerText = show.premiered ? show.premiered : 'Ongoing';

        const tvSeriesDetailsModal = new bootstrap.Modal(document.getElementById("tvSeriesDetailsModal"));
        tvSeriesDetailsModal.show();
      }
    })
    .catch(error => {
      console.error('Hata:', error);
    });
}




