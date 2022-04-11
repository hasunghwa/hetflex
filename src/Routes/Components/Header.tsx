import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import {Link, useHistory, useRouteMatch} from "react-router-dom"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IItem {
  isExact?: any;
}

interface IForm {
  keyword: string;
}

function Header(){
  const [searchOpen, setSearchOpen] = useState(false);
  const history = useHistory();
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");
  const navAnimation = useAnimation();
  const inputAnimation = useAnimation();
  const {scrollY} = useViewportScroll();
  const {register, handleSubmit} = useForm<IForm>();
  
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      })
    } else {
      inputAnimation.start({
        scaleX: 1,
      })
    }
    setSearchOpen((prev) => !prev)
  };

  const onValid = (data:IForm) => {
    history.push(`/search?keyword=${data.keyword}`);
  };

  useEffect(() => {
    scrollY.onChange(()=> {
      if(scrollY.get() > 80){
        navAnimation.start("scroll")
      } else {
        navAnimation.start("top")
      }
    });
  } ,[scrollY])

  return(
    <Nav variants={navVariants} animate={navAnimation} initial={"top"}>
      <Col>
        <Link to="/">
          <Img src={process.env.PUBLIC_URL + '/logo.png'} />
        </Link>
        <Items>
          <Item isExact={homeMatch?.isExact}>
            <Link to="/">홈</Link>
          </Item>
          <Item isExact={tvMatch}>
            <Link to="/tv">시리즈</Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -215 : 0 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register("keyword", {required:true, minLength: 2})}
            animate={inputAnimation}
            initial={{scaleX: 0}}
            transition={{ type: "linear" }}
            placeholder="Search for movie or tv show..."
          />
        </Search>
      </Col>
    </Nav>
  );
}

const Nav = styled(motion.nav)`
  display: flex;
  width: 100%;
  height: 80px;
  top: 0;
  position: fixed;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  padding: 20px 50px;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid white;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li<IItem>`
  margin-right: 20px;
  opacity: ${props => props.isExact ? 1 : 0.85};
  &:hover {
    opacity: 0.7;
  }
`;

const Logo = styled(motion.svg)`
  margin-right: 40px;
  width: 95px;
  height: 25px;
  fill: red;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const navVariants = {
  top: {
    backgroundColor: "rgba(0, 0, 0, 0)"
  },
  scroll: {
    backgroundColor: "rgba(0, 0, 0, 1)"
  }
}

const Img = styled.img`
  margin-right: 40px;
  width: 95px;
  height: 35px;
`
export default Header;