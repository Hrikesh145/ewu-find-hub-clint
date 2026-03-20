import { Link } from 'react-router';
import {
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiArrowRight,
} from 'react-icons/hi';
import './Section2.css';

const FEATURES = [
  {
    icon:  <HiOutlineShieldCheck />,
    title: 'Admin verified',
    desc:  'Every claim is reviewed by a human admin before the item is handed over. No anonymous transactions.',
  },
  {
    icon:  <HiOutlineLightningBolt />,
    title: 'Fast & easy',
    desc:  'Report a lost or found item in under 2 minutes. Our streamlined form makes it effortless.',
  },
  {
    icon:  <HiOutlineUsers />,
    title: 'Campus community',
    desc:  'Built exclusively for EWU students and staff. A trusted network you already belong to.',
  },
  {
    icon:  <HiOutlineClock />,
    title: 'Real-time status',
    desc:  'Track your item from "posted" to "returned" with live status updates at every step.',
  },
];

const Section2 = () => (
  <>
    {/* ── WHY FINDHUB ── */}
    <section className="s2-why">
      <div className="s2-why__inner">

        <div className="s2-why__left">
          <div className="s2-tag">Why FindHub</div>
          <h2 className="s2-title">
            Built for EWU.<br />
            <span>Trusted by students.</span>
          </h2>
          <p className="s2-sub">
            Unlike social media groups or notice boards, FindHub is a structured
            platform with admin oversight — ensuring every transaction is verified and safe.
          </p>
          <Link to="/allItems" className="s2-btn-primary">
            Start browsing <HiArrowRight />
          </Link>
        </div>

        <div className="s2-why__right">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div key={i} className="s2-feature">
              <div className="s2-feature__icon">{icon}</div>
              <div>
                <div className="s2-feature__title">{title}</div>
                <div className="s2-feature__desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  </>
);

export default Section2;