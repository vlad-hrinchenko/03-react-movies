import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { Movie } from "../../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const TMDB_TOKEN = import.meta.env.VITE_API_KEY;

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // 👉 обраний фільм

  const fetchMovies = async (query: string): Promise<Movie[]> => {
    const config = {
      params: { query },
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };

    const response = await axios.get(API_URL, config);
    return response.data.results;
  };

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setHasError(false);

      const fetchedMovies = await fetchMovies(query);

      if (fetchedMovies.length === 0) {
        toast("No movies found for your request.");
        setMovies([]);
        return;
      }

      setMovies(fetchedMovies);
    } catch (error) {
      toast.error("An error occurred while fetching movies.");
      console.error(error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      <main>
        {isLoading ? (
          <Loader />
        ) : hasError ? (
          <ErrorMessage />
        ) : (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default App;
