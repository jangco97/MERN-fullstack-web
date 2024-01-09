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
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        // !!token converts token to boolean
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          {
            <Routes>
              <Route path="/" exact={'true'} element={<Main />} />
              <Route path="/:userId/places" element={<UserPlaces />} />
              <Route element={<ProtectedRoutes token={token} />}>
                <Route
                  path="/places/new"
                  exact={'true'}
                  element={<NewPlace />}
                />
                <Route path="/places/:placeId" element={<UpdatePlace />} />
              </Route>

              <Route element={<NotAuthRoutes token={token} />}>
                <Route path="/auth" exact={'true'} element={<Auth />} />
              </Route>
            </Routes>
          }
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
