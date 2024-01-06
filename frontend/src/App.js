import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Main from './users/pages/Main';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import Auth from './users/pages/Auth';
import ProtectedRoutes from './users/components/ProtectedRoutes';
import NotAuthRoutes from './users/components/NotAuthRoutes';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          {
            <Routes>
              <Route path="/" exact element={<Main />} />
              <Route path="/:userId/places" element={<UserPlaces />} />
              <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
                <Route path="/places/new" exact element={<NewPlace />} />
                <Route path="/places/:placeId" element={<UpdatePlace />} />
              </Route>

              <Route element={<NotAuthRoutes isLoggedIn={isLoggedIn} />}>
                <Route path="/auth" exact element={<Auth />} />
              </Route>
            </Routes>
          }
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
