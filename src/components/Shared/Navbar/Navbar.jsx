import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router';
import Logo from '../Logo/Logo';
import './Navbar.css';



const NAV_LINKS = [
  { to: '/',         label: 'Home',      end: true },
  { to: '/allItems', label: 'All Items'             },
  { to: '/center',   label: 'Center'                },
];

const DROPDOWN_LINKS = [
  { to: '/addItems',      label: 'Report an Item'    },
  { to: '/myItems',       label: 'My Posts'          },
  { to: '/mySubmissions', label: 'My Submissions'    },
  { to: '/myClaims',      label: 'My Claims'         },
];

const Navbar = ({ user = null, onLogout }) => {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [dropOpen,     setDropOpen]     = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  const dropRef = useRef(null);

  /* ── scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── close mobile menu on resize ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeAll = () => { setMenuOpen(false); setDropOpen(false); };

  /* ── active class helper ── */
  const navCls = ({ isActive }) =>
    `nb-link ${isActive ? 'nb-link--active' : ''}`;

  /* ── avatar initials fallback ── */
  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className={`nb ${scrolled ? 'nb--scrolled' : ''}`}>
      <div className="nb__inner">

        {/* ── Logo ── */}
        <Logo href="/" size="md" />

        {/* ── Desktop Nav Links ── */}
        <nav className="nb__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navCls} onClick={closeAll}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop Right ── */}
        <div className="nb__right">

          {user ? (
            /* ── Logged In ── */
            <div className="nb__avatar-wrap" ref={dropRef}>
              <button
                className="nb__avatar"
                onClick={() => setDropOpen(p => !p)}
                aria-label="Account menu"
                aria-expanded={dropOpen}
              >
                {user.photoURL
                  ? <img src={user.photoURL} alt={user.displayName} className="nb__avatar-img" />
                  : <span className="nb__avatar-initials">{initials}</span>
                }
                <svg className={`nb__avatar-caret ${dropOpen ? 'nb__avatar-caret--open' : ''}`}
                  width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div className="nb__drop" role="menu">
                  {/* user info */}
                  <div className="nb__drop-user">
                    <div className="nb__drop-name">{user.displayName || 'Student'}</div>
                    <div className="nb__drop-email">{user.email}</div>
                  </div>
                  <div className="nb__drop-divider" />
                  {DROPDOWN_LINKS.map(({ to, label }) => (
                    <Link key={to} to={to} className="nb__drop-item" role="menuitem" onClick={closeAll}>
                      {label}
                    </Link>
                  ))}
                  <div className="nb__drop-divider" />
                  <button className="nb__drop-logout" onClick={() => { onLogout?.(); closeAll(); }}>
                    Logout
                  </button>
                </div>
              )}
            </div>

          ) : (
            /* ── Guest ── */
            <>
              <Link to="/login" className="nb__btn-ghost" onClick={closeAll}>
                Login
              </Link>
              <Link to="/addItems" className="nb__btn-blue" onClick={closeAll}>
                Report Item →
              </Link>
            </>
          )}

          {/* ── Hamburger ── */}
          <button
            className={`nb__burger ${menuOpen ? 'nb__burger--open' : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>

        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="nb__mobile" role="navigation" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `nb__mobile-link ${isActive ? 'nb__mobile-link--active' : ''}`}
              onClick={closeAll}
            >
              {label}
            </NavLink>
          ))}

          <div className="nb__mobile-divider" />

          {user ? (
            <>
              <div className="nb__mobile-user">
                <div className="nb__mobile-user-name">{user.displayName || 'Student'}</div>
                <div className="nb__mobile-user-email">{user.email}</div>
              </div>
              {DROPDOWN_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className="nb__mobile-link" onClick={closeAll}>
                  {label}
                </Link>
              ))}
              <div className="nb__mobile-divider" />
              <button className="nb__mobile-logout" onClick={() => { onLogout?.(); closeAll(); }}>
                Logout
              </button>
            </>
          ) : (
            <div className="nb__mobile-auth">
              <Link to="/login"    className="nb__btn-ghost nb__btn-ghost--full" onClick={closeAll}>Login</Link>
              <Link to="/addItems" className="nb__btn-blue nb__btn-blue--full"   onClick={closeAll}>Report Item →</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;