import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getFavorites, removeFavorite } from "../utils/favorites";
import "../styles/Home.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setFavorites(getFavorites());
    setTimeout(() => setLoading(false), 300);
  }, []);

  return (
    <div className="home">
      <div className="search-box">
        <h1>Favorite Movies</h1>
        <Link to="/" className="fav-btn">
          ←Back
        </Link>
      </div>

      {loading ? (
        <motion.div
          className="loader"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          Loading favorites...
        </motion.div>
      ) : (
        <div className="section">
          {favorites.length === 0 && <p>No favorites yet.</p>}
          <div className="movies-grid">
            {favorites.map((movie) => (
              <motion.div
                className="movie-card"
                key={movie.imdbID}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/movie/${movie.imdbID}`}>
                  <img src={movie.Poster} alt={movie.Title} />
                </Link>
                <h4>{movie.Title}</h4>
                <button
                  className="fav-btn"
                  onClick={() => {
                    removeFavorite(movie.imdbID);
                    setFavorites(getFavorites());
                  }}
                >
                  ❌ Remove
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;
