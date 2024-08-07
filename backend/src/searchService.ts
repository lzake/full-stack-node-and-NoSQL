import axios from 'axios';

export type FilmSearchRequest = {
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

export type Film = {
  title: string;
  releaseYear: number;
  numberOfCopiesAvailable: number;
  director: string;
  distributor: string;
};

const microservices = {
  vhs: 'http://localhost:3000/mock/vhs/search',
  dvd: 'http://localhost:3000/mock/dvd/search',
  projector: 'http://localhost:3000/mock/projector/search'
};

async function fetchFilms(serviceUrl: string, payload: FilmSearchRequest): Promise<Film[]> {
  const response = await axios.post(serviceUrl, payload);
  return response.data;
}

function dedupeFilms(films: Film[]): Film[] {
  const filmMap = new Map<string, Film>();

  films.forEach(film => {
    const key = `${film.title}-${film.releaseYear}`;
    if (filmMap.has(key)) {
      filmMap.get(key)!.numberOfCopiesAvailable += film.numberOfCopiesAvailable;
    } else {
      filmMap.set(key, film);
    }
  });

  return Array.from(filmMap.values());
}

export async function searchFilms(payload: FilmSearchRequest): Promise<Film[]> {
  const promises = [];
  if (!payload.excludeVHS) promises.push(fetchFilms(microservices.vhs, payload));
  if (!payload.excludeDVD) promises.push(fetchFilms(microservices.dvd, payload));
  if (!payload.excludeProjector) promises.push(fetchFilms(microservices.projector, payload));

  const results = await Promise.all(promises);
  const allFilms = results.flat();
  const dedupedFilms = dedupeFilms(allFilms);
  const sortedFilms = dedupedFilms.sort((a, b) => {
    const fieldA = a[payload.sortField];
    const fieldB = b[payload.sortField];
    if (payload.sortDirection === 'ASC') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  const startIndex = (payload.currentPage - 1) * payload.pageSize;
  const endIndex = startIndex + payload.pageSize;
  return sortedFilms.slice(startIndex, endIndex);
}