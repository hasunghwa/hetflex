import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import styled from 'styled-components';
import Home from "./Routes/Home";
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Routes/Components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
