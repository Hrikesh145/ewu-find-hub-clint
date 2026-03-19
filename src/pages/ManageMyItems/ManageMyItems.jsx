import { Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlinePlus,
} from 'react-icons/hi';

import './ManageMyItems.css';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const STATUS_MAP = {
  posted:      { label: 'Posted',     cls: 'mi-badge--posted'    },
  submitted:   { label: 'Submitted',  cls: 'mi-badge--submitted' },
  'at-center': { label: 'At Center',  cls: 'mi-badge--center'    },
  claimed:     { label: 'Claimed',    cls: 'mi-badge--claimed'   },
  returned:    { label: 'Returned ✓', cls: 'mi-badge--returned'  },
};

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const ManageMyItems = () => {
  const { user }      = useAuth();
  const axiosSecure   = useAxiosSecure();
  const queryClient   = useQueryClient();

  /* ── Fetch my items ── */
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['my-items', user?.email],
    enabled:  !!user?.email,
    queryFn:  async () => {
      const res = await axiosSecure.get(`/my-items?email=${user.email}`);
      return res.data;
    },
  });

  /* ── Delete mutation ── */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-items', user?.email] });
      toast.success('Item deleted successfully!');
    },
    onError: () => toast.error('Failed to delete item.'),
  });

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title:             'Delete this post?',
      html:              `<strong>${item.title}</strong> will be permanently removed.`,
      icon:              'warning',
      showCancelButton:  true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText:  'Cancel',
      confirmButtonColor:'#B81C2E',
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(item._id);
    }
  };

  /* ── Loading ── */
  if (isLoading) return (
    <div className="mi-spinner-wrap">
      <div className="mi-spinner" />
      <p>Loading your posts...</p>
    </div>
  );

  /* ── Empty state ── */
  if (items.length === 0) return (
    <div className="mi-page">
      <div className="mi-header">
        <div>
          <h1 className="mi-title">Manage My <span>Items</span></h1>
          <p className="mi-sub">All the lost and found items you have reported.</p>
        </div>
        <Link to="/addItems" className="mi-add-btn">
          <HiOutlinePlus /> Report an item
        </Link>
      </div>
      <div className="mi-empty">
        <div className="mi-empty__icon">📭</div>
        <h3 className="mi-empty__title">No posts yet</h3>
        <p className="mi-empty__sub">
          Found something on campus? Report it and help someone
          get their belongings back.
        </p>
        <Link to="/addItems" className="mi-empty__btn">
          <HiOutlinePlus /> Report an item
        </Link>
      </div>
    </div>
  );

  return (
    <div className="mi-page">
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div className="mi-header">
        <div>
          <h1 className="mi-title">Manage My <span>Items</span></h1>
          <p className="mi-sub">
            You have <strong>{items.length}</strong> post{items.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <Link to="/addItems" className="mi-add-btn">
          <HiOutlinePlus /> Report an item
        </Link>
      </div>

      {/* ── Table ── */}
      <div className="mi-table-wrap">
        <table className="mi-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Type</th>
              <th>Location & Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const status = STATUS_MAP[item.status] || { label: item.status, cls: '' };

              return (
                <tr key={item._id}>

                  {/* Index */}
                  <td className="mi-idx">{idx + 1}</td>

                  {/* Item */}
                  <td>
                    <div className="mi-item-cell">
                      <div className="mi-thumb">
                        {item.photoURL
                          ? <img src={item.photoURL} alt={item.title} />
                          : <span>📦</span>
                        }
                      </div>
                      <div>
                        <div className="mi-item-title">{item.title}</div>
                        <div className="mi-item-cat">{item.category}</div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td>
                    <span className={`mi-type ${item.postType === 'lost' ? 'type--lost' : 'type--found'}`}>
                      {item.postType === 'lost' ? 'Lost' : 'Found'}
                    </span>
                  </td>

                  {/* Location & Date */}
                  <td>
                    <div className="mi-loc">
                      <HiOutlineLocationMarker />
                      {item.location}
                    </div>
                    <div className="mi-date">
                      <HiOutlineCalendar />
                      {formatDate(item.date)}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`mi-badge ${status.cls}`}>
                      {status.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="mi-actions">
                      <Link
                        to={`/items/${item._id}`}
                        className="mi-btn mi-btn--view"
                        title="View details"
                      >
                        <HiOutlineEye />
                      </Link>

                      <Link
                        to={`/updateItems/${item._id}`}
                        className="mi-btn mi-btn--edit"
                        title="Edit item"
                      >
                        <HiOutlinePencil />
                      </Link>

                      <button
                        className="mi-btn mi-btn--delete"
                        onClick={() => handleDelete(item)}
                        disabled={deleteMutation.isPending}
                        title="Delete item"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMyItems;