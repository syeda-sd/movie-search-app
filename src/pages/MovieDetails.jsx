import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";

const API_KEY = "644ca901";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
        const data = await res.json();
        if (data.Response === "False") setError(data.Error);
        else setMovie(data);
      } catch {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading)
    return (
      <motion.div
        className="loader"
        animate={{ scale: [1, 1.2, 1] }}
      >
      Loading movie details...
      </motion.div>
    );
  if (error) return <div className="loader">{error}</div>;

  return (
    <div className="home">
      <div className="search-box">
        <h1>{movie.Title}</h1>
        <Link to="/" className="fav-btn">
          ⬅ Back
        </Link>
      </div>

      <div className="section">
        <div className="movies-grid">
          <motion.div
            className="movie-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src={movie.Poster} alt={movie.Title} />
            <h4>🎬 {movie.Title}</h4>
            <p><b>Year:</b> {movie.Year}</p>
            <p><b>Genre:</b> {movie.Genre}</p>
            <p><b>Director:</b> {movie.Director}</p>
            <p><b>Actors:</b> {movie.Actors}</p>
            <p><b>Plot:</b> {movie.Plot}</p>
            <p><b>IMDB Rating:</b> {movie.imdbRating}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
