import { AnimatePresence, motion, useViewportScroll} from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../../utils";
import { IGetMoviesDetail, getMovievedio } from "../../api";
import { useEffect, useRef } from "react";
import  ReactPlayer  from  'react-player/youtube'

interface IBigMovie {
  detail: IGetMoviesDetail;
  layoutId?: string;
  top: number;
  isTv? : boolean;
  movieKey? : string;
  setKey? : Function;
};

function BigMovie({detail, layoutId, top, isTv, movieKey, setKey}:IBigMovie){
  const {scrollY} = useViewportScroll();
  const bigMovie = useRef<HTMLDivElement>(null);  
  useEffect(() => {
    if(setKey){
      getMovievedio(detail.id).then(data => setKey(data.results[0].key));
    }
  } ,[])

  useEffect(() => {
    scrollY.onChange(()=> {
      if(bigMovie.current) {
        bigMovie.current.style.top = String(scrollY.get()+100) + "px";
      }
    });
  } ,[scrollY])

  const cover = () => {
    if(movieKey)
      return <ReactPlayer 
      className="react-player" 
      url={`https://www.youtube.com/watch?v=${movieKey}`} 
      width="100%" 
      height="100%" 
      muted={true} //chrome정책으로 인해 자동 재생을 위해 mute 옵션을 true로 해주었다.
      playing={true} 
      loop={true} />
    else
      return <BigCover style={{backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(detail.backdrop_path, "w500")})` }}></BigCover>
  }

  const date = () => {
    if(isTv)
      return detail.first_air_date.replaceAll('-', '.');
    else
      return detail.release_date.replaceAll('-', '.');
  }

  const title = () => {
    if(isTv)
      return <BigTitle>{detail.name} <SubTitle>{detail.original_name}</SubTitle></BigTitle> 
    else
      return <BigTitle>{detail.title} <SubTitle>{detail.original_title}</SubTitle></BigTitle> 
  }

  const runtime = () => {
    if(isTv)
      return <Empty>|<Category> 러닝타임</Category> {detail.episode_run_time}분</Empty>    
    else
      return <Empty>|<Category> 러닝타임</Category> {detail.runtime}분</Empty>                
  }

  return(
    <AnimatePresence>
      <Warraper layoutId={layoutId} style={{top: top}} ref={bigMovie}> 
        {detail && 
          <>
            <BigCover> 
            {cover()}
            </BigCover>
            {title()}
            <BigOverview>
              <DetailBox>
                <Empty>
                  <Category>개봉</Category> 
                   {date()}
                  </Empty>
                {runtime()}
                <Empty>|<Category> 평점</Category> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAACA0lEQVQ4jY2Ty2sTURTGv3ttZzrjTOLkRRJLVQIu6tJsbEFwUYWsBDsX0Z0PstKFf0EKgn+CCyEViiAzQvduWuOjbTRS0Aaq1YpK00abyaTTZiavcaGBZDGpd3XPd8758R3OvcCAszCbii7MpqKDaoYGJZVw/P6/6y2vGuqVyGXVcCgWnwpG45cGufB04Iv4H8ROJMYIgN/bWzMA0v/tIJdVw8Ho8SlKKQilCEXjKS8XBAA0TeUU8yAhBZRJjh8eHx7izp5JTpyn9C+/0+lg7d2bXLPVKDScZtGqGK8Nv/iFMb1BXj6dzsZGT15UIrGgJMsjHC94TQUAaDh1WHt7tlEu7ZZ+fntOS5Tc3q+ZS5LPzx3WDAAcL0D2HeMtq/ZWMDfTlDG9vW5Vr67ll3THPmgdBmg4dudj/tW8sfxJTaYLTQoAjOntDbt2vVhY1gZBHLveLr5febZhW+xCZrEF9GyBMb1d2f5+z/hVNrwARnnH2N3avMuY3u5qfWvkJH9SVgIhL4CsBIKCFEj2an0AQZAmRFEi3dgyq7ZlVu1uLB6VCC+Kk709fS9xhBfGCKWo71utH1/XVyqlncfgSEWWlTunTo+fE2Ufz/PCqCfAJUh8/rC6albKD5OX5x4RAhcAXBfzef3aDX84ctN1OwmvEbH4ZFrNZDKeH0zT1CMv5q6wXu0Pag/AUypqgkwAAAAASUVORK5CYII="/>{detail.vote_average}</Empty>
              </DetailBox>
              <DetailBox>
                <Category>장르 </Category>
                {detail.genres.map(genre => <Genre>{genre.name}</Genre>)}
              </DetailBox>
              
              <DetailBox>
                <Category>줄거리 </Category>
                <Overview style={{ height: "200px"}}>{detail.overview}</Overview>
              </DetailBox>
            </BigOverview>                   
          </>
        }
      </Warraper>
    </AnimatePresence>
  )
}

const Warraper = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 5px;
  overflow: hidden;
  background-color: #2F2F2F;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h1`
  color: #fff;
  padding: 20px;
  position: relative;
  top: -70px;
  font-size: 2rem;
  font-weight: 400;
`;

const SubTitle = styled.span`
  font-size: 1.3rem;
  display: inlile;
  font-weight: 100;
  color: gray;
`

const BigOverview = styled.div`
  padding: 20px;
  position: relative;
  top: -80px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 1.1rem;
`;

const Overview = styled.div`
  margin-top: 12px;
  line-height: 30px;
`

const DetailBox = styled.div`
  padding: 10px;
  margin: 10px;
  overflow-y: auto; 
`

const Category = styled.span`
  color: #627A69;
  font-weight: 300;
`

const Empty = styled.span`
  margin-right: 8px;
`

const Genre = styled.span`
  margin-right: 8px;
  padding: 7px;
  background-color: black;
  border-radius: 10px;
`
export default BigMovie;