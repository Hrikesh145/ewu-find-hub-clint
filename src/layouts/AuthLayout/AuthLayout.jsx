import React from 'react';
import { Outlet } from 'react-router';
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="al-page">
      {/* ambient blobs */}
      <div className="al-blob al-blob--tr" />
      <div className="al-blob al-blob--bl" />
      <div className="al-wrap">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;