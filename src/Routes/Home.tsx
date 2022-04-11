
import styled from "styled-components";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult, getMovieDetail, IGetMoviesDetail } from "../api";
import { makeImagePath } from "../utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useRouteMatch } from "react-router-dom";
import BigMovie from "./Components/BigMovie";


function Home(){
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId");
  const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const [detail, setDetail] = useState<IGetMoviesDetail>();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [over, setOver] = useState(false);
  const [rightCheck, setrCheck] = useState(true);
  const {scrollY} = useViewportScroll();
  const [key, setKey] = useState("");

  const offset = 6;

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setrCheck(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));      
    }
  };

  const decraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setrCheck(false);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onOver = () => setOver(true);
  const leaveOver = () => setOver(false);
  
  const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`);
    getMovieDetail(movieId).then(data => setDetail(data));
  }

  useEffect(() => {
    if(bigMovieMatch?.params.movieId)
      getMovieDetail(Number(bigMovieMatch?.params.movieId)).then(data => setDetail(data));
  } ,[])

  const onOverlayClick = () => {
    history.push('/');
    setKey("");
  };
  
  return(
    <Wrapper>
      {isLoading ? ( 
        <Loader>Loding...</Loader> 
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider onMouseOver={onOver} onMouseLeave={leaveOver}>
            <div style={{margin:"0 30px 20px", fontSize: "1.3rem"}}>신규 컨텐츠</div>
            {over ? (
              <>
                <Prev onClick={decraseIndex}><FontAwesomeIcon icon={faChevronLeft} /></Prev>
                <Next onClick={increaseIndex}><FontAwesomeIcon icon={faChevronRight} /></Next>
              </>) : null
            }
            <AnimatePresence custom={rightCheck} initial={false} onExitComplete={toggleLeaving}>
              <Row
                custom={rightCheck}
                variants={rowVariants}
                initial= "hidden"
                animate= "visible"
                exit= "exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      onClick={() => onBoxClicked(movie.id)}
                      key={movie.id}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info
                        variants={infoVariants}
                      >
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          {detail && bigMovieMatch ? (
            <>
              <Overlay onClick={onOverlayClick} exit={{opacity: 0}} animate={{opacity: 1}}/>
              <BigMovie detail={detail} top={scrollY.get() + 100} layoutId={bigMovieMatch.params.movieId} movieKey={key} setKey={setKey}/>
            </> 
          ) :null}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgPhoto:string}>`
  height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 1.3rem;
  width: 40%;
  line-height: 35px;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(6, 1fr);
  padding: 0 30px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 150px;
  font-size: 66px;
  border-radius: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`

const Next = styled.div`
  z-index: 99;
  position: absolute;
  right: 0;
  height: 200px;
  width: 2.5%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  line-height: 200px;
  color: white;
`;

const Prev = styled.div`
  z-index: 99;
  position: absolute;
  left: 0;
  height: 200px;
  width: 2.5%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  line-height: 200px;
  color: white;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const rowVariants = {
  hidden: (rightCheck:boolean) => ({
    x: rightCheck ? window.innerWidth : -window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (rightCheck:boolean) => ({
    x: rightCheck ? -window.innerWidth : window.innerWidth,
  }),
}

const boxVariants = {
  nomal:{
    scale: 1,
  },
  hover:{
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.1,
    }
  }
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    }
  }
}

export default Home;
