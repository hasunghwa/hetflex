const API_KEY = "ed601d29b2ac1c3c2aab6136bdbbd60f";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie{
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IGgenre{
  id: number;
  name: string;
}

export interface IGetMoviesDetail {
  id: number,
  imdb_id: string,
  original_title: string;
  title: string;
  backdrop_path: string;
  overview: string;
  homepage: string;
  popularity: number;
  genres: IGgenre[];
  release_date: string;
  runtime: number,
  status: string,
  vote_average: number,
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getTvs() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export async function getMovieDetail(movieId:number) {
  const data = await fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko&page=1`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      return data;
    })
  return data
}


export function searchMovie(keyWord:string) {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=ko&query=${keyWord}&page=1`).then(
    (response) => response.json()
  );
}