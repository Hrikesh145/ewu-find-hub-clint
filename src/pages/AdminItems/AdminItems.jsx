import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineEye,
} from 'react-icons/hi';
import { Link } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import './AdminItems.css';


const STATUS_OPTIONS = [
  { value: 'posted',    label: 'Posted',     cls: 'ab--posted'    },
  { value: 'submitted', label: 'Submitted',  cls: 'ab--submitted' },
  { value: 'at-center', label: 'At Center',  cls: 'ab--center'    },
  { value: 'claimed',   label: 'Claimed',    cls: 'ab--claimed'   },
  { value: 'returned',  label: 'Returned ✓', cls: 'ab--returned'  },
];

const STATUS_FILTERS = ['All', 'posted', 'submitted', 'at-center', 'claimed', 'returned'];

const getBadgeCls = (status) => {
  const found = STATUS_OPTIONS.find(s => s.value === status);
  return found ? found.cls : '';
};

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const AdminItems = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  /* ── Fetch all items ── */
  const { data: items = [], isLoading } = useQuery({
    queryKey:  ['admin-items', search, statusFilter],
    queryFn:   async () => {
      const params = {};
      if (search)                 params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await axiosSecure.get('/items', { params });
      return res.data;
    },
    staleTime: 1000 * 20,
  });

  /* ── Update item status ── */
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await axiosSecure.patch(`/items/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      toast.success('Status updated!');
    },
    onError: () => toast.error('Failed to update status.'),
  });

  /* ── Confirm receive (posted/submitted → at-center) ── */
  const handleReceive = async (item) => {
    const result = await Swal.fire({
      title:             'Confirm receipt?',
      html:              `Mark <strong>${item.title}</strong> as received at the EWU center?`,
      icon:              'question',
      showCancelButton:  true,
      confirmButtonText: 'Yes, received',
      cancelButtonText:  'Cancel',
      confirmButtonColor:'#0B3D91',
    });

    if (result.isConfirmed) {
      statusMutation.mutate({ id: item._id, status: 'at-center' });
    }
  };

  /* ── Change any status manually ── */
  const handleStatusChange = async (item, newStatus) => {
    const result = await Swal.fire({
      title:             'Change status?',
      html:              `Change <strong>${item.title}</strong> status to <strong>${newStatus}</strong>?`,
      icon:              'warning',
      showCancelButton:  true,
      confirmButtonText: 'Yes, change it',
      confirmButtonColor:'#0B3D91',
    });

    if (result.isConfirmed) {
      statusMutation.mutate({ id: item._id, status: newStatus });
    }
  };

  /* ── Stats ── */
  const stats = {
    total:     items.length,
    posted:    items.filter(i => i.status === 'posted').length,
    atCenter:  items.filter(i => i.status === 'at-center').length,
    claimed:   items.filter(i => i.status === 'claimed').length,
    returned:  items.filter(i => i.status === 'returned').length,
  };

  return (
    <div className="admin-page">
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Item <span>Management</span></h1>
          <p className="admin-sub">Review, receive, and update the status of all reported items.</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="admin-stats">
        {[
          { label: 'Total Items', value: stats.total,    cls: '' },
          { label: 'Posted',      value: stats.posted,   cls: 'stat--posted'   },
          { label: 'At Center',   value: stats.atCenter, cls: 'stat--center'   },
          { label: 'Claimed',     value: stats.claimed,  cls: 'stat--claimed'  },
          { label: 'Returned',    value: stats.returned, cls: 'stat--returned' },
        ].map(({ label, value, cls }) => (
          <div key={label} className={`admin-stat ${cls}`}>
            <div className="admin-stat__val">{value}</div>
            <div className="admin-stat__label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="admin-controls">
        <div className="admin-search">
          <HiOutlineSearch className="admin-search__icon" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-search__input"
          />
          {search && (
            <button className="admin-search__clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="admin-filter-bar">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`admin-fc ${statusFilter === f ? 'admin-fc--active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f === 'All' ? 'All' : STATUS_OPTIONS.find(s => s.value === f)?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="admin-spinner-wrap"><div className="admin-spinner" /></div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div>🔍</div>
          <p>No items found</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Location</th>
                <th>Reporter</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  {/* Item */}
                  <td>
                    <div className="admin-item-cell">
                      <div className="admin-item-thumb">
                        {item.photoURL
                          ? <img src={item.photoURL} alt={item.title} />
                          : <span>📦</span>
                        }
                      </div>
                      <div>
                        <div className="admin-item-title">{item.title}</div>
                        <div className="admin-item-cat">{item.category}</div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td>
                    <span className={`admin-type ${item.postType === 'lost' ? 'type--lost' : 'type--found'}`}>
                      {item.postType === 'lost' ? 'Lost' : 'Found'}
                    </span>
                  </td>

                  {/* Location */}
                  <td>
                    <div className="admin-loc">
                      <HiOutlineLocationMarker />
                      {item.location}
                    </div>
                  </td>

                  {/* Reporter */}
                  <td>
                    <div className="admin-reporter">
                      <div className="admin-reporter-av">
                        {item.contact?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="admin-reporter-name">{item.contact?.name}</div>
                        <div className="admin-reporter-email">{item.contact?.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="admin-date">{formatDate(item.createdAt)}</td>

                  {/* Status */}
                  <td>
                    <span className={`admin-badge ${getBadgeCls(item.status)}`}>
                      {STATUS_OPTIONS.find(s => s.value === item.status)?.label || item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="admin-actions">

                      {/* View */}
                      <Link
                        to={`/items/${item._id}`}
                        className="admin-btn admin-btn--view"
                        title="View details"
                      >
                        <HiOutlineEye />
                      </Link>

                      {/* Receive button — only for posted/submitted */}
                      {(item.status === 'posted' || item.status === 'submitted') && (
                        <button
                          className="admin-btn admin-btn--receive"
                          onClick={() => handleReceive(item)}
                          title="Mark as received at center"
                          disabled={statusMutation.isPending}
                        >
                          <HiOutlineCheckCircle /> Received
                        </button>
                      )}

                      {/* Status dropdown for manual override */}
                      <select
                        className="admin-status-select"
                        value={item.status}
                        onChange={e => handleStatusChange(item, e.target.value)}
                        title="Change status"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminItems;