import React from 'react';
import { Link } from 'react-router';
import './Logo.css';


const Logo = ({ variant = 'default', size = 'md', href }) => {
  const isWhite = variant === 'white';

  const inner = (
    <div className={`logo logo--${size} ${isWhite ? 'logo--white' : ''}`}>

      {/* ── Mark ── */}
      <div className="logo__mark">
        <div className="logo__mark-gloss" />
        <svg
          className="logo__mark-svg"
          viewBox="0 0 20 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* stem */}
          <rect x="2"   y="0"  width="3.5"  height="22"  rx="1.2" fill="white" fillOpacity="0.95" />
          {/* top bar */}
          <rect x="2"   y="0"  width="16"   height="3.5" rx="1.2" fill="white" fillOpacity="0.95" />
          {/* mid bar */}
          <rect x="2"   y="9"  width="11.5" height="3.2" rx="1.2" fill="white" fillOpacity="0.88" />
          {/* accent dot */}
          <circle cx="17" cy="19.5" r="2.5" fill="white" fillOpacity="0.60" />
        </svg>
      </div>

      {/* ── Text ── */}
      <div className="logo__text">
        <div className="logo__wordmark">
          Find<span className="logo__hub">Hub</span>
        </div>
        <div className="logo__sub">East West University</div>
      </div>

    </div>
  );

  if (href) {
    return (
      <Link to={href} className="logo__link" aria-label="EWU FindHub — Home">
        {inner}
      </Link>
    );
  }

  return inner;
};

export default Logo;