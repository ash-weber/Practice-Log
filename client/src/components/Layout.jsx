import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = ({ user, setUser }) => {
  if (!user) return null;

  return (
    <>
      <nav>
        <Header user={user} setUser={setUser} />
      </nav>
      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
