import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchMovie } from "../api";
import MovieBox from "./Components/MovieBox";
import { getTvs, IMovie } from "../api";
import styled from "styled-components";

function Tv(){
  const [TvList, setTvList] = useState<IMovie[]>();
  const offset = 5;

  useEffect(() => {
    getTvs().then(data => setTvList(data.results));
  }, [])
  
  return(
    <MovieBoxs>
      {TvList ? (
        <>
          <Row>
            {TvList 
              .slice(offset * 0, offset * 0 + offset)
              .map((movie) => 
                <MovieBox key={movie.id} movieInfo={movie} isTv={true} />)} 
          </Row>
          <Row>
          {TvList 
            .slice(offset * 1, offset * 1 + offset)
            .map((movie) => 
              <MovieBox key={movie.id} movieInfo={movie} isTv={true}/>)} 
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
export default Tv;