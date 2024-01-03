import React, { useState, useEffect } from 'react';
import {Router, Routes, Route, Switch, Redirect} from 'react-router-dom';
import User from './users/pages/User';
import Places from './places/pages/Places';
const App = () => {

  return (
    <Router>
     <Switch>
   
      <Route path='/' exact>
        <User/>
      </Route>
      <Route path="/places/:pid">
        <Places/>
      </Route>
      <Redirect to="/"/>
  
      </Switch>
    </Router>
  );
}

export default App;
