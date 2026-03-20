import { Link } from 'react-router';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import Logo from '../Logo/Logo';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="ft__inner">

        {/* Brand */}
        <div className="ft__brand">
          <Logo variant="white" size="md" />
          <p className="ft__tagline">
            EWU's official lost & found platform. Connecting students through
            a trusted, admin-verified process.
          </p>
          <div className="ft__contact">
            <div className="ft__contact-row">
              <HiOutlineLocationMarker />
              <span>Administrative Building, Room 101, EWU Dhaka</span>
            </div>
            <div className="ft__contact-row">
              <HiOutlinePhone />
              <span>+880 2-8811381</span>
            </div>
            <div className="ft__contact-row">
              <HiOutlineMail />
              <span>lostandfound@ewubd.edu</span>
            </div>
          </div>
        </div>

        {/* Platform Links */}
        <div className="ft__col">
          <div className="ft__col-title">Platform</div>
          <Link to="/"             className="ft__link">Home</Link>
          <Link to="/allItems"     className="ft__link">All Items</Link>
          <Link to="/allRecovered" className="ft__link">Recovered Items</Link>
          <Link to="/center"       className="ft__link">Center</Link>
          <Link to="/addItems"     className="ft__link">Report an Item</Link>
        </div>

        {/* Center Hours */}
        <div className="ft__col">
          <div className="ft__col-title">Center Hours</div>
          <div className="ft__info-row">
            <span className="ft__info-label">Sat – Thu</span>
            <span className="ft__info-val">9:00 AM – 5:00 PM</span>
          </div>
          <div className="ft__info-row">
            <span className="ft__info-label">Friday</span>
            <span className="ft__info-val">Closed</span>
          </div>
          <div className="ft__open-badge">
            <span className="ft__open-dot" />
            Center is open
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="ft__bottom">
        <div className="ft__bottom-inner">
          <span className="ft__copy">
            © {year} EWU FindHub. East West University, Dhaka.
          </span>
          <span className="ft__made">
            Built for the EWU campus community
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;