export const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

export const addFavorite = (movie) => {
  const favorites = getFavorites();
  if (!favorites.find((f) => f.imdbID === movie.imdbID)) {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

export const removeFavorite = (id) => {
  let favorites = getFavorites();
  favorites = favorites.filter((f) => f.imdbID !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

export const isFavorite = (id) => {
  return getFavorites().some((f) => f.imdbID === id);
};
