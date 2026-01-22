import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { addFavorite, isFavorite } from "../utils/favorites";
import "../styles/Home.css";

const API_KEY = "644ca901";

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem("search_history")) || []);

  const [recommended, setRecommended] = useState([]);
  const [hits, setHits] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);

  // Save search history
  const saveHistory = useCallback((q) => {
    const updated = [q, ...searchHistory.filter((x) => x !== q)].slice(0, 6);
    localStorage.setItem("search_history", JSON.stringify(updated));
    setSearchHistory(updated);
  }, [searchHistory]);

  // Search movies
  const searchMovies = useCallback(async (newPage = 1, append = false) => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&page=${newPage}&apikey=${API_KEY}`);

      const data = await res.json();

      if (data.Response === "False") {
        setError(data.Error);
        setHasMore(false);
      } else {
        saveHistory(query);
        if (append) setMovies((prev) => [...prev, ...data.Search]);
        else setMovies(data.Search);

        setHasMore(newPage < Math.ceil(+data.totalResults / 10));
        setPage(newPage);
      }
    } catch {
      setError("Something went wrong!");
    }
    setLoading(false);
  }, [query, saveHistory]);

  useEffect(() => {
    const fetchSections = async () => {
      setSectionLoading(true);
      try {
        const rec = await fetch(`https://www.omdbapi.com/?s=avengers&apikey=${API_KEY}`);
        const recData = await rec.json();
        setRecommended(recData.Search || []);

        const h = await fetch(`https://www.omdbapi.com/?s=batman&apikey=${API_KEY}`);
        const hitData = await h.json();
        setHits(hitData.Search || []);

        const n = await fetch(`https://www.omdbapi.com/?s=spider-man&apikey=${API_KEY}`);
        const newData = await n.json();
        setNewMovies(newData.Search || []);
      } catch {}
      setSectionLoading(false);
    };
    fetchSections();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 2 >=
          document.documentElement.scrollHeight &&
        !loading &&
        hasMore
      ) {
        searchMovies(page + 1, true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, hasMore, loading, searchMovies]);
 
//movie cards
  const MovieCard = ({ movie }) => (
    <motion.div className="movie-card" whileHover={{ scale: 1.08, y: -5 }} transition={{ duration: 0.3 }}>
      <Link to={`/movie/${movie.imdbID}`}>
        <img src={movie.Poster} alt={movie.Title} />
      </Link>
      <h4>{movie.Title}</h4>
      <button
        className={`fav-btn ${isFavorite(movie.imdbID) ? "saved" : ""}`}
        onClick={() => {
          addFavorite(movie);
          setSavedId(movie.imdbID);
          setTimeout(() => setSavedId(null), 1200);
        }}
      >
        {savedId === movie.imdbID
          ? "Saved"
          : isFavorite(movie.imdbID)
          ? "Saved"
          : "Favorite"}
      </button>
    </motion.div>
  );

  return (
    <div className="home">
      <div className="search-box">
        <h1>Movie-Search-App</h1>
            <p className="project-info">
  Search your favorite movies, view recommended, hits, and new movies easily.  
  Day 7 of 12 Days of React Project Series | Build by Sidra Gillani
</p>

        <input
          placeholder="Search movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="fav-btn" onClick={() => searchMovies(1)}>
          Search
        </button>

        <Link to="/favorites" className="fav-btn">
          View Favorites
        </Link>

        <div style={{ marginTop: "10px" }}>
          {searchHistory.map((q, idx) => (
            <span key={idx} className="search-history-item">
              <button className="fav-btn" onClick={() => { setQuery(q); searchMovies(1); }}>{q}</button>
              <button
                className="remove-history"
                onClick={() => {
                  const updated = searchHistory.filter((x) => x !== q);
                  localStorage.setItem("search_history", JSON.stringify(updated));
                  setSearchHistory(updated);
                }}
              >
                ❌
              </button>
            </span>
          ))}
        </div>
      </div>

      {loading && <div className="loader">Loading movies...</div>}
      {error && <div className="loader">{error}</div>}

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>

      {!sectionLoading && (
        <>
          <h2>Recommended</h2>
          <div className="movies-grid">{recommended.map((m) => <MovieCard key={m.imdbID} movie={m} />)}</div>

          <h2>Hits</h2>
          <div className="movies-grid">{hits.map((m) => <MovieCard key={m.imdbID} movie={m} />)}</div>

          <h2>New</h2>
          <div className="movies-grid">{newMovies.map((m) => <MovieCard key={m.imdbID} movie={m} />)}</div>
        </>
      )}
    </div>
  );
}

export default Home;
