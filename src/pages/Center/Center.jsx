import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

import './Center.css';
import useAxios from '../../hooks/useAxios';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const Spinner = () => (
  <div className="ct-spinner-wrap">
    <div className="ct-spinner" />
    <p>Loading items...</p>
  </div>
);

const ItemCard = ({ item }) => (
  <div className="ct-item-card">
    <div className="ct-item-thumb">
      {item.photoURL
        ? <img src={item.photoURL} alt={item.title} />
        : <span>📦</span>
      }
      <span className={`ct-type ${item.postType === 'lost' ? 'ct-type--lost' : 'ct-type--found'}`}>
        {item.postType === 'lost' ? 'Lost' : 'Found'}
      </span>
    </div>
    <div className="ct-item-body">
      <h3 className="ct-item-title">{item.title}</h3>
      <div className="ct-item-meta">
        <span><HiOutlineTag />       {item.category}</span>
        <span><HiOutlineLocationMarker /> {item.location}</span>
        <span><HiOutlineCalendar />  {formatDate(item.date)}</span>
      </div>
    </div>
    <div className="ct-item-foot">
      <div className="ct-at-center-badge">
        <HiOutlineCheckCircle /> At Center
      </div>
      <Link to={`/items/${item._id}`} className="ct-item-btn">
        View & Claim <HiOutlineArrowRight />
      </Link>
    </div>
  </div>
);

const Center = () => {
  const axiosInstance = useAxios();

  const { data: items = [], isLoading } = useQuery({
    queryKey:  ['center-items'],
    queryFn:   async () => {
      const res = await axiosInstance.get('/items?status=at-center');
      return res.data;
    },
    staleTime: 1000 * 30,
  });

  return (
    <div className="ct-page">

      {/* ── Hero ── */}
      <div className="ct-hero">
        <div className="ct-hero__content">
          <div className="ct-hero__badge">
            <HiOutlineOfficeBuilding /> EWU Lost & Found Center
          </div>
          <h1 className="ct-hero__title">
            Items Waiting<br />to Be <span>Claimed</span>
          </h1>
          <p className="ct-hero__sub">
            These items have been physically submitted to the EWU Lost & Found
            Center and verified by our admin team. If any of these belong to
            you, click "View & Claim" to submit your claim.
          </p>
          <div className="ct-hero__stats">
            <div className="ct-hero__stat">
              <div className="ct-hero__stat-val">{items.length}</div>
              <div className="ct-hero__stat-label">Items at center</div>
            </div>
            <div className="ct-hero__stat-div" />
            <div className="ct-hero__stat">
              <div className="ct-hero__stat-val">24h</div>
              <div className="ct-hero__stat-label">Avg. claim time</div>
            </div>
            <div className="ct-hero__stat-div" />
            <div className="ct-hero__stat">
              <div className="ct-hero__stat-val">Sat–Thu</div>
              <div className="ct-hero__stat-label">Open days</div>
            </div>
          </div>
        </div>
        <div className="ct-hero__info-card">
          <div className="ct-info-head">Center information</div>
          <div className="ct-info-body">
            <div className="ct-info-row">
              <div className="ct-info-icon"><HiOutlineOfficeBuilding /></div>
              <div>
                <div className="ct-info-label">Location</div>
                <div className="ct-info-val">Administrative Building, Room 101<br />East West University, Dhaka</div>
              </div>
            </div>
            <div className="ct-info-row">
              <div className="ct-info-icon"><HiOutlineClock /></div>
              <div>
                <div className="ct-info-label">Office hours</div>
                <div className="ct-info-val">Sat – Thu: 9:00 AM – 5:00 PM<br />Friday: Closed</div>
              </div>
            </div>
            <div className="ct-info-row">
              <div className="ct-info-icon"><HiOutlinePhone /></div>
              <div>
                <div className="ct-info-label">Phone</div>
                <div className="ct-info-val">+880 2-8811381</div>
              </div>
            </div>
            <div className="ct-info-row">
              <div className="ct-info-icon"><HiOutlineMail /></div>
              <div>
                <div className="ct-info-label">Email</div>
                <div className="ct-info-val">lostandfound@ewubd.edu</div>
              </div>
            </div>
          </div>
          <div className="ct-info-note">
            Bring your student ID when collecting an item. The admin will
            verify your identity before handing it over.
          </div>
        </div>
      </div>

      {/* ── How to claim ── */}
      <div className="ct-steps-section">
        <h2 className="ct-steps-title">How to claim an item</h2>
        <div className="ct-steps">
          {[
            { n: '01', t: 'Find your item',    d: 'Browse the list below and click "View & Claim" on the item that belongs to you.'          },
            { n: '02', t: 'Submit a claim',    d: 'Fill in proof of ownership and your preferred collection date.'                            },
            { n: '03', t: 'Admin reviews',     d: 'Our team will review your claim and contact you if more info is needed.'                   },
            { n: '04', t: 'Collect your item', d: 'Visit the center with your student ID. Admin will hand over the item after verification.' },
          ].map(({ n, t, d }) => (
            <div key={n} className="ct-step">
              <div className="ct-step__num">{n}</div>
              <div className="ct-step__title">{t}</div>
              <div className="ct-step__desc">{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Items at center ── */}
      <div className="ct-items-section">
        <div className="ct-items-head">
          <div>
            <h2 className="ct-items-title">Items at the Center</h2>
            <p className="ct-items-sub">
              {isLoading
                ? 'Loading...'
                : `${items.length} item${items.length !== 1 ? 's' : ''} currently held at the EWU center`
              }
            </p>
          </div>
          <Link to="/allItems" className="ct-all-btn">
            View all posts <HiOutlineArrowRight />
          </Link>
        </div>

        {isLoading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <div className="ct-empty">
            <div className="ct-empty__icon">🏛️</div>
            <h3 className="ct-empty__title">No items at the center right now</h3>
            <p className="ct-empty__sub">
              When students drop off found items at the EWU desk, they will appear here.
            </p>
          </div>
        ) : (
          <div className="ct-items-grid">
            {items.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Center;