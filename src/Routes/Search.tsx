import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchMovie } from "../api";
import MovieBox from "./Components/MovieBox";
import { IMovie } from "../api";
import styled from "styled-components";

function Search(){
  const location = useLocation();
  const [movieList, setMovieList] = useState<IMovie[]>();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const offset = 5;

  useEffect(() => {
    if(keyword)
      searchMovie(keyword).then(data => setMovieList(data.results));
  }, [keyword])
  
  return(
    <MovieBoxs>
      <Result>"<span style={{color: "red", fontWeight: "400"}}>{keyword}</span>"에 대한 검색 결과</Result>
      {movieList && keyword? (
        <>
          <Row>
            {movieList 
              .slice(offset * 0, offset * 0 + offset)
              .map((movie) => 
                <MovieBox key={movie.id} keyword={keyword} movieInfo={movie}/>)} 
          </Row>
          <Row>
            {movieList
              .slice(offset * 1, offset * 1 + offset)
              .map((movie) => 
                <MovieBox key={movie.id} keyword={keyword} movieInfo={movie}/>)} 
          </Row>
        </>
        ): null
      }
    </MovieBoxs> 
  );
}

const MovieBoxs = styled.div`
  display: flex;
  height: 100vh;
  padding: 60px;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`

const Row = styled.div`
  display: flex;
  width: 90vw;
  justify-content: space-around;
`

const Result = styled.div`
  font-size: 1.3rem;
  font-weight: 300;
`
export default Search;