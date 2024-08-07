import React, { useState } from 'react';
import axios from 'axios';

type FilmSearchRequest = {
  currentPage: number;
  pageSize: number;
  sortField: 'title' | 'releaseYear';
  sortDirection: 'ASC' | 'DESC';
  excludeVHS: boolean;
  excludeDVD: boolean;
  excludeProjector: boolean;
  search: {
    title: string;
    releaseYear: number;
    director: string;
    distributor: string;
  };
};

type Film = {
  title: string;
  releaseYear: number;
  numberOfCopiesAvailable: number;
  director: string;
  distributor: string;
};

function App() {
  const [response, setResponse] = useState<Film[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const result = await axios.post<Film[]>('/search', {
        currentPage: 1,
        pageSize: 10,
        sortField: 'title',
        sortDirection: 'ASC',
        excludeVHS: false,
        excludeDVD: false,
        excludeProjector: false,
        search: {
          title: '',
          releaseYear: 0,
          director: '',
          distributor: ''
        }
      });
      setResponse(result.data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setResponse(null);
    }
  };

  return (
    <div className="App">
      <h1>Video Rental Service</h1>
      <button onClick={handleSearch}>Search Videos</button>
      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2>Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default App;