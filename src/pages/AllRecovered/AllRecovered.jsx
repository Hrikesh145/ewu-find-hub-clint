import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineUser,
} from 'react-icons/hi';

import './AllRecovered.css';
import useAxios from '../../hooks/useAxios';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

const Spinner = () => (
  <div className="ar-spinner-wrap">
    <div className="ar-spinner" />
    <p>Loading recovered items...</p>
  </div>
);

const Empty = () => (
  <div className="ar-empty">
    <div className="ar-empty__icon">📭</div>
    <h3 className="ar-empty__title">No recovered items yet</h3>
    <p className="ar-empty__sub">
      Items that have been successfully returned to their owners will appear here.
    </p>
    <Link to="/allItems" className="ar-empty__btn">
      Browse all items →
    </Link>
  </div>
);

const RecoveredCard = ({ item }) => (
  <div className="ar-card">

    {/* Thumbnail */}
    <div className="ar-card__thumb">
      {item.itemPhotoURL
        ? <img src={item.itemPhotoURL} alt={item.itemTitle} />
        : <span className="ar-card__thumb-fallback">📦</span>
      }
      <div className="ar-card__returned-badge">
        <HiOutlineCheckCircle /> Returned
      </div>
    </div>

    {/* Body */}
    <div className="ar-card__body">
      <h3 className="ar-card__title">{item.itemTitle}</h3>

      <div className="ar-card__meta">
        <div className="ar-card__meta-item">
          <HiOutlineLocationMarker />
          <span>{item.recoveredLocation || '—'}</span>
        </div>
        <div className="ar-card__meta-item">
          <HiOutlineCalendar />
          <span>{formatDate(item.recoveredDate)}</span>
        </div>
      </div>
    </div>

    {/* Footer — who recovered */}
    <div className="ar-card__foot">
      <div className="ar-card__by-label">Recovered by</div>
      <div className="ar-card__by">
        <div className="ar-card__av">
          {item.recoveredBy?.photoURL
            ? <img
                src={item.recoveredBy.photoURL}
                alt={item.recoveredBy.name}
                referrerPolicy="no-referrer"
              />
            : item.recoveredBy?.name?.[0]?.toUpperCase() || '?'
          }
        </div>
        <div>
          <div className="ar-card__by-name">{item.recoveredBy?.name || '—'}</div>
          <div className="ar-card__by-email">{item.recoveredBy?.email || '—'}</div>
        </div>
      </div>
    </div>

  </div>
);

const AllRecovered = () => {
  const axiosInstance = useAxios();

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey:  ['recovered'],
    queryFn:   async () => {
      const res = await axiosInstance.get('/recovered');
      return res.data;
    },
  });

  return (
    <div className="ar-page">

      {/* Header */}
      <div className="ar-header">
        <div>
          <h1 className="ar-title">All Recovered <span>Items</span></h1>
          <p className="ar-sub">
            Items that have been successfully returned to their rightful owners.
          </p>
        </div>
        {!isLoading && items.length > 0 && (
          <div className="ar-count-badge">
            <HiOutlineCheckCircle />
            {items.length} item{items.length !== 1 ? 's' : ''} recovered
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div className="ar-empty">
          <div className="ar-empty__icon">⚠️</div>
          <h3 className="ar-empty__title">Failed to load</h3>
          <p className="ar-empty__sub">Please check your connection and refresh the page.</p>
        </div>
      ) : items.length === 0 ? (
        <Empty />
      ) : (
        <div className="ar-grid">
          {items.map(item => (
            <RecoveredCard key={item._id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
};

export default AllRecovered;