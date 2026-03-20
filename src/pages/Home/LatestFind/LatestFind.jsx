import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineTag,
  HiArrowRight,
} from 'react-icons/hi';

import './LatestFind.css';
import useAxios from '../../../hooks/useAxios';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const STATUS_MAP = {
  posted:      { label: 'Posted',     cls: 'lf-badge--posted'    },
  submitted:   { label: 'Submitted',  cls: 'lf-badge--submitted' },
  'at-center': { label: 'At Center',  cls: 'lf-badge--center'    },
  claimed:     { label: 'Claimed',    cls: 'lf-badge--claimed'   },
};

const ItemCard = ({ item, idx }) => {
  const status = STATUS_MAP[item.status] || { label: item.status, cls: '' };

  return (
    <div className="lf-card" style={{ animationDelay: `${idx * 0.08}s` }}>
      <div className="lf-card__thumb">
        {item.photoURL
          ? <img src={item.photoURL} alt={item.title} />
          : <span className="lf-card__fallback">📦</span>
        }
        <span className={`lf-card__type ${item.postType === 'lost' ? 'lf-type--lost' : 'lf-type--found'}`}>
          {item.postType === 'lost' ? 'Lost' : 'Found'}
        </span>
      </div>

      <div className="lf-card__body">
        <div className="lf-card__top">
          <h3 className="lf-card__title">{item.title}</h3>
          <span className={`lf-card__badge ${status.cls}`}>{status.label}</span>
        </div>
        <p className="lf-card__desc">{item.description}</p>
        <div className="lf-card__meta">
          <span><HiOutlineTag />            {item.category}</span>
          <span><HiOutlineLocationMarker /> {item.location}</span>
          <span><HiOutlineCalendar />       {formatDate(item.date)}</span>
        </div>
      </div>

      <div className="lf-card__foot">
        <div className="lf-card__reporter">
          <div className="lf-card__av">
            {item.contact?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <span>{item.contact?.name || 'Unknown'}</span>
        </div>
        <Link to={`/items/${item._id}`} className="lf-card__btn">
          View Details <HiArrowRight />
        </Link>
      </div>
    </div>
  );
};

const LatestFind = () => {
  const axiosInstance = useAxios();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['latest-items'],
    queryFn:  async () => {
      const res = await axiosInstance.get('/items');
      return res.data
        .filter(i => i.status !== 'returned')
        .slice(0, 6);
    },
  });

  return (
    <section className="lf-section">
      <div className="lf-inner">

        {/* Header */}
        <div className="lf-head">
          <div>
            <div className="lf-tag">Latest posts</div>
            <h2 className="lf-title">Recently Reported <span>Items</span></h2>
            <p className="lf-sub">
              The most recent lost and found reports from the EWU campus community.
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="lf-spinner-wrap"><div className="lf-spinner" /></div>
        ) : items.length === 0 ? (
          <div className="lf-empty">
            <div>📭</div>
            <p>No items reported yet. Be the first!</p>
            <Link to="/addItems" className="lf-empty__btn">
              Report an item <HiArrowRight />
            </Link>
          </div>
        ) : (
          <>
            <div className="lf-grid">
              {items.map((item, idx) => (
                <ItemCard key={item._id} item={item} idx={idx} />
              ))}
            </div>

            <div className="lf-see-all">
              <Link to="/allItems" className="lf-see-all__btn">
                See all items <HiArrowRight />
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default LatestFind;