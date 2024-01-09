//로그인 안된 사람이 로그인 되어야 볼 수 있는 페이지 경로 들어갔을 경우 로그인페이지로 이동시킴
import React from 'react'; // eslint-disable-line no-unused-vars
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ token }) => {
  return token ? <Outlet /> : <Navigate to={'/auth'} />;
};

export default ProtectedRoutes;
