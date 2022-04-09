import styled from "styled-components";
import { IMovie, IGetMoviesDetail, getMovieDetail, getTvDetail } from "../../api";
import { makeImagePath } from "../../utils";
import { motion } from "framer-motion";
import BigMovie from "../Components/BigMovie";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import { useViewportScroll } from "framer-motion";

interface IMovieList {
  movieInfo: IMovie;
  key: number;
  keyword?: string;
  isTv? : boolean;
};

function MovieBox({movieInfo, keyword, isTv}: IMovieList){
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState<IGetMoviesDetail>();
  const {scrollY} = useViewportScroll();
  const [key, setKey] = useState("");

  const onBoxClicked = (movieId:number) => {
    if(isTv)
      getTvDetail(movieId).then(data => setDetail(data));
    else {            
      getMovieDetail(movieId).then(data => setDetail(data));
    }
    setOpenModal(true);
  }

  const onOverlayClick = () => {
    setOpenModal(false);
    setKey("");
    if(isTv)
      history.push(`/tv`);
    else
      history.push(`/search?keyword=${keyword}`);
  };

  return (
    <>
      <Box
        onClick={() => onBoxClicked(movieInfo.id)}
        key={movieInfo.id}
        whileHover="hover"
        initial="normal"
        transition={{ type: "tween" }}
        bgPhoto={makeImagePath(movieInfo.backdrop_path, "w300")}
      >
        {!movieInfo.backdrop_path? <Img src={process.env.PUBLIC_URL + '/logo.png'} />  : null}
      </Box>
      {detail && openModal? (
        <>
          <Overlay onClick={onOverlayClick} exit={{opacity: 0}} animate={{opacity: 1}}/>
          <BigMovie detail={detail} top={scrollY.get() + 100} isTv={isTv} movieKey={key} setKey={setKey}/>
        </> 
      ) :null}
    </>
  )
}

const Box = styled(motion.div)<{bgPhoto:string}>`
  background-image: url(${(props) => props.bgPhoto ? props.bgPhoto : ""}); 
  background-size: cover;
  background-position: center center;
  height: 180px;
  width: 320px;
  font-size: 10px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.86) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Img = styled.img`
  margin-top: 70px;
  width: 95px;
  height: 35px;
`
export default MovieBox;