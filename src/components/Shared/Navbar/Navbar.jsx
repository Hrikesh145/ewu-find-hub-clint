import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Logo from "../Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import "./Navbar.css";
import useAdmin from "../../../hooks/useAdmin";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/allItems", label: "All Items" },
  { to: "/center", label: "Center" },
];

const DROPDOWN_LINKS = [
  { to: "/addItems", label: "Add Lost & Found Item" },
  { to: "/allRecovered", label: "All Recovered Items" },
  { to: "/myItems", label: "Manage My Items" },
];

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setDropOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    closeAll();
    navigate("/");
  };

  const navCls = ({ isActive }) =>
    `nb-link ${isActive ? "nb-link--active" : ""}`;

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className={`nb ${scrolled ? "nb--scrolled" : ""}`}>
      <div className="nb__inner">
        <Logo href="/" size="md" />

        <nav className="nb__links">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={navCls}
              onClick={closeAll}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nb__right">
          {user ? (
            <div className="nb__avatar-wrap" ref={dropRef}>
              <button
                className="nb__avatar"
                onClick={() => setDropOpen((p) => !p)}
                aria-label="Account menu"
                aria-expanded={dropOpen}
                title={user.displayName}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="nb__avatar-img"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="nb__avatar-initials">{initials}</span>
                )}
                <svg
                  className={`nb__avatar-caret ${dropOpen ? "nb__avatar-caret--open" : ""}`}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {dropOpen && (
                <div className="nb__drop">
                  <div className="nb__drop-user">
                    <div className="nb__drop-photo">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="nb__drop-info">
                      <div className="nb__drop-name">
                        {user.displayName || "Student"}
                      </div>
                      <div className="nb__drop-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="nb__drop-divider" />

                  {/* Admin link — only if admin */}
                  {isAdmin && (
                    <Link
                      to="/admin/items"
                      className="nb__drop-item nb__drop-item--admin"
                      onClick={closeAll}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {DROPDOWN_LINKS.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="nb__drop-item"
                      onClick={closeAll}
                    >
                      {label}
                    </Link>
                  ))}

                  <div className="nb__drop-divider" />

                  <button className="nb__drop-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nb__btn-blue" onClick={closeAll}>
              Login
            </Link>
          )}

          <button
            className={`nb__burger ${menuOpen ? "nb__burger--open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nb__mobile">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeAll}
              className={({ isActive }) =>
                `nb__mobile-link ${isActive ? "nb__mobile-link--active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="nb__mobile-divider" />

          {user ? (
            <>
              <div className="nb__mobile-user">
                <div className="nb__mobile-user-name">
                  {user.displayName || "Student"}
                </div>
                <div className="nb__mobile-user-email">{user.email}</div>
              </div>
              {DROPDOWN_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="nb__mobile-link"
                  onClick={closeAll}
                >
                  {label}
                </Link>
              ))}
              <div className="nb__mobile-divider" />
              <button className="nb__mobile-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="nb__mobile-auth">
              <Link
                to="/login"
                className="nb__btn-blue nb__btn-blue--full"
                onClick={closeAll}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
