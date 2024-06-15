document.addEventListener('DOMContentLoaded', () => {
    showFavorites(); // show fav films
});

function showFavorites() {
    const favMovies = JSON.parse(localStorage.getItem('favMovies')) || []; // get fav films from LS

    const favoritesContainer = document.getElementById('favorites');

    if (favMovies.length > 0) {
        for (const movie of favMovies) {
            const { id, title, poster_path, vote_average, overview } = movie;
            const favEl = document.createElement('div');
            favEl.classList.add('favorite-movie');

            favEl.innerHTML = `
                <div class="movie-img"><img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}"></div>
                <div class="fav-overview">
                    <h3>${title}</h3>
                    <span class="rating ${vote_average}"><i class="fa-regular fa-star"></i>  ${vote_average}</span>
                    <p class="detail-overview"><i class="fa-solid fa-circle-info"></i>  ${overview}</p>
                    <button class="remove-fav know-more" id="${id}">Remove</button>
                </div>
            `;

            favoritesContainer.appendChild(favEl);

            // delete button 
            const removeFavBtn = favEl.querySelector('.remove-fav');
            removeFavBtn.addEventListener('click', () => {
                removeFavorite(id);
                favEl.remove();
            });
        }
    } else {
        const noFavEl = document.createElement('div');
        noFavEl.classList.add('no-favorites');
        noFavEl.innerText = 'No favorite movie yet.';
        favoritesContainer.appendChild(noFavEl);
    }
}

function removeFavorite(movieId) {
    const key = 'movie_' + movieId;
    localStorage.removeItem(key); // remove from fav
    const favMovies = JSON.parse(localStorage.getItem('favMovies')) || [];
    const updatedFavMovies = favMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem('favMovies', JSON.stringify(updatedFavMovies));
}
