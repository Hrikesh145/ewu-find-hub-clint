import { Link } from 'react-router';
import {
  HiOutlineSearch,
  HiOutlineOfficeBuilding,
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiArrowRight,
} from 'react-icons/hi';
import './Section1.css';

const STEPS = [
  {
    num:       '01',
    icon:      <HiOutlineSearch />,
    title:     'Report the item',
    desc:      'Post a lost or found item with a photo, description, and exact campus location. Takes less than 2 minutes.',
    iconBg:    '#EEF4FF',
    iconColor: '#0B3D91',
  },
  {
    num:       '02',
    icon:      <HiOutlineOfficeBuilding />,
    title:     'Submit to center',
    desc:      'Drop the found item at the EWU Lost & Found desk. Admin confirms receipt and updates the status to "At Center".',
    iconBg:    '#ECFDF5',
    iconColor: '#065F46',
  },
  {
    num:       '03',
    icon:      <HiOutlineShieldCheck />,
    title:     'Claim & verify',
    desc:      'The owner submits a claim with proof of ownership. Admin reviews and verifies their identity before handing it over.',
    iconBg:    '#FFF7ED',
    iconColor: '#92400E',
  },
  {
    num:       '04',
    icon:      <HiOutlineHeart />,
    title:     'Item returned ✓',
    desc:      'Admin hands the item to the verified owner. A happy ending for everyone — and the post moves to Recovered.',
    iconBg:    '#FDF4FF',
    iconColor: '#7E22CE',
  },
];

const Section1 = () => (
  <section className="s1-section">
    <div className="s1-inner">

      {/* Header */}
      <div className="s1-head">
        <div className="s1-tag">How it works</div>
        <h2 className="s1-title">Simple. Safe. <span>Trusted.</span></h2>
        <p className="s1-sub">
          Our admin-verified process ensures every item reaches its rightful owner —
          no anonymous transactions, no guesswork.
        </p>
      </div>

      {/* Steps */}
      <div className="s1-steps">
        {STEPS.map(({ num, icon, title, desc, iconBg, iconColor }, i) => (
          <div key={i} className="s1-step">

            {/* Connector arrow */}
            {i < STEPS.length - 1 && (
              <div className="s1-step__arrow"><HiArrowRight /></div>
            )}

            <div className="s1-step__num">{num}</div>
            <div
              className="s1-step__icon"
              style={{ background: iconBg, color: iconColor }}
            >
              {icon}
            </div>
            <h3 className="s1-step__title">{title}</h3>
            <p className="s1-step__desc">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="s1-cta">
        <Link to="/addItems" className="s1-cta__btn">
          Report an item now <HiArrowRight />
        </Link>
        <Link to="/center" className="s1-cta__link">
          Learn about the center →
        </Link>
      </div>

    </div>
  </section>
);

export default Section1;