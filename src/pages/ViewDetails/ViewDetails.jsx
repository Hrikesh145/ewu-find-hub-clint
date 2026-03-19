import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import toast, { Toaster } from 'react-hot-toast';
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineX,
} from 'react-icons/hi';

import 'react-datepicker/dist/react-datepicker.css';
import './ViewDetails.css';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

const STATUS_MAP = {
  posted:       { label: 'Posted',     cls: 'vd-badge--posted'    },
  submitted:    { label: 'Submitted',  cls: 'vd-badge--submitted' },
  'at-center':  { label: 'At Center',  cls: 'vd-badge--center'    },
  claimed:      { label: 'Claimed',    cls: 'vd-badge--claimed'   },
  returned:     { label: 'Returned ✓', cls: 'vd-badge--returned'  },
};

/* ── Claim Modal ── */
const ClaimModal = ({ item, onClose, onSuccess }) => {
  const { user }      = useAuth();
  const axiosInstance = useAxiosSecure();
  const queryClient   = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: { recoveredLocation: '', date: new Date() } });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        itemId:            item._id,
        itemTitle:         item.title,
        recoveredLocation: data.recoveredLocation,
        recoveredDate:     data.date,
        recoveredBy: {
          name:     user.displayName,
          email:    user.email,
          photoURL: user.photoURL || '',
        },
      };
      await axiosInstance.post('/recovered', payload);
      await axiosInstance.patch(`/items/${item._id}/status`, { status: 'returned' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', item._id] });
      toast.success('Item marked as recovered!');
      onSuccess();
      onClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    },
  });

  const btnLabel = item.postType === 'found' ? 'This is Mine!' : 'Found This!';

  return (
    <div className="vd-overlay" onClick={onClose}>
      <div className="vd-modal" onClick={e => e.stopPropagation()}>

        <div className="vd-modal__head">
          <div>
            <h2 className="vd-modal__title">{btnLabel}</h2>
            <p className="vd-modal__sub">{item.title}</p>
          </div>
          <button className="vd-modal__close" onClick={onClose} type="button">
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
          <div className="vd-modal__body">

            <div className="vd-fg">
              <label className="vd-label">
                Recovered location <span className="vd-req">*</span>
              </label>
              <div className="vd-input-wrap">
                <HiOutlineLocationMarker className="vd-input-icon" />
                <input
                  className={`vd-input ${errors.recoveredLocation ? 'vd-input--err' : ''}`}
                  placeholder="Where was it given / received?"
                  {...register('recoveredLocation', { required: 'Location is required' })}
                />
              </div>
              {errors.recoveredLocation && (
                <span className="vd-err">{errors.recoveredLocation.message}</span>
              )}
            </div>

            <div className="vd-fg">
              <label className="vd-label">
                Recovery date <span className="vd-req">*</span>
              </label>
              <div className="vd-input-wrap">
                <HiOutlineCalendar className="vd-input-icon" />
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: 'Date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="MMMM d, yyyy"
                      maxDate={new Date()}
                      className={`vd-input vd-input--date ${errors.date ? 'vd-input--err' : ''}`}
                      wrapperClassName="vd-datepicker-wrap"
                      placeholderText="Select date"
                    />
                  )}
                />
              </div>
              {errors.date && <span className="vd-err">{errors.date.message}</span>}
            </div>

            <div className="vd-modal__user-card">
              <div className="vd-modal__av">
                {user?.photoURL
                  ? <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
                  : user?.displayName?.[0]?.toUpperCase()
                }
              </div>
              <div>
                <div className="vd-modal__user-name">{user?.displayName}</div>
                <div className="vd-modal__user-email">{user?.email}</div>
              </div>
              <div className="vd-modal__lock">
                <HiOutlineCheckCircle /> Auto-filled
              </div>
            </div>

          </div>

          <div className="vd-modal__foot">
            <button
              type="submit"
              className="vd-modal__submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Submitting...' : 'Submit →'}
            </button>
            <button type="button" className="vd-modal__cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══ MAIN ══ */
const ViewDetails = () => {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const axiosInstance = useAxios();

  const [modalOpen, setModalOpen] = useState(false);
  const [recovered, setRecovered] = useState(false);

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['item', id],
    queryFn:  async () => {
      const res = await axiosInstance.get(`/items/${id}`);
      return res.data;
    },
  });

  if (isLoading) return (
    <div className="vd-spinner-wrap">
      <div className="vd-spinner" />
      <p>Loading item details...</p>
    </div>
  );

  if (isError || !item) return (
    <div className="vd-error">
      <div className="vd-error__icon">⚠️</div>
      <h2>Item not found</h2>
      <p>This item may have been removed or does not exist.</p>
      <Link to="/allItems" className="vd-btn-back">← Back to All Items</Link>
    </div>
  );

  const status      = STATUS_MAP[item.status] || { label: item.status, cls: '' };
  const isOwner     = user?.email === item?.contact?.email;
  const isRecovered = item.status === 'returned' || recovered;
  const btnLabel    = item.postType === 'found' ? 'This is Mine!' : 'Found This!';

  return (
    <div className="vd-page">
      <Toaster position="top-center" />

      <button className="vd-back" onClick={() => navigate(-1)}>
        <HiOutlineArrowLeft /> Back
      </button>

      <div className="vd-layout">

        {/* ── LEFT ── */}
        <div className="vd-left">

          <div className="vd-img-card">
            {item.photoURL
              ? <img src={item.photoURL} alt={item.title} className="vd-img" />
              : (
                <div className="vd-img-placeholder">
                  <span>📦</span>
                  <p>No photo provided</p>
                </div>
              )
            }
            <div className="vd-img-badges">
              <span className={`vd-type-badge ${item.postType === 'lost' ? 'vd-type--lost' : 'vd-type--found'}`}>
                {item.postType === 'lost' ? 'Lost' : 'Found'}
              </span>
              <span className={`vd-badge ${status.cls}`}>{status.label}</span>
            </div>
          </div>

          <div className="vd-action-card">
            {isRecovered ? (
              <div className="vd-state-msg vd-state-msg--ok">
                <HiOutlineCheckCircle />
                <span>This item has been recovered</span>
              </div>
            ) : isOwner ? (
              <div className="vd-state-msg vd-state-msg--info">
                <HiOutlineUser />
                <span>This is your own post</span>
              </div>
            ) : !user ? (
              <Link to="/login" className="vd-action-btn">
                Login to claim this item
              </Link>
            ) : (
              <button className="vd-action-btn" onClick={() => setModalOpen(true)}>
                {btnLabel}
              </button>
            )}
            <p className="vd-action-note">
              {isRecovered
                ? 'This item has already been returned to its owner.'
                : item.postType === 'found'
                  ? 'Click above if this item belongs to you.'
                  : 'Click above if you found this lost item.'
              }
            </p>
          </div>

        </div>

        {/* ── RIGHT ── */}
        <div className="vd-right">

          <div className="vd-info-card">
            <div className="vd-info-top">
              <h1 className="vd-title">{item.title}</h1>
              <p className="vd-posted">Posted on {formatDate(item.createdAt)}</p>
            </div>

            <div className="vd-meta-grid">
              <div className="vd-meta-item">
                <div className="vd-meta-icon"><HiOutlineTag /></div>
                <div>
                  <div className="vd-meta-label">Category</div>
                  <div className="vd-meta-val">{item.category}</div>
                </div>
              </div>
              <div className="vd-meta-item">
                <div className="vd-meta-icon"><HiOutlineLocationMarker /></div>
                <div>
                  <div className="vd-meta-label">Location</div>
                  <div className="vd-meta-val">{item.location}</div>
                </div>
              </div>
              <div className="vd-meta-item">
                <div className="vd-meta-icon"><HiOutlineCalendar /></div>
                <div>
                  <div className="vd-meta-label">Date</div>
                  <div className="vd-meta-val">{formatDate(item.date)}</div>
                </div>
              </div>
              <div className="vd-meta-item">
                <div className="vd-meta-icon"><HiOutlineUser /></div>
                <div>
                  <div className="vd-meta-label">Post type</div>
                  <div className="vd-meta-val" style={{ textTransform: 'capitalize' }}>{item.postType}</div>
                </div>
              </div>
            </div>

            <div className="vd-divider" />

            <div className="vd-desc-label">Description</div>
            <p className="vd-desc">{item.description}</p>
          </div>

          <div className="vd-contact-card">
            <div className="vd-contact-head">Contact information</div>
            <div className="vd-contact-body">
              <div className="vd-contact-row">
                <div className="vd-contact-av">
                  {item.contact?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="vd-contact-name">{item.contact?.name || '—'}</div>
                  <div className="vd-contact-sub">Reported by</div>
                </div>
              </div>
              <div className="vd-divider" />
              <div className="vd-contact-detail">
                <HiOutlineMail />
                <span>{item.contact?.email || '—'}</span>
              </div>
              {item.contact?.phone && (
                <div className="vd-contact-detail">
                  <HiOutlinePhone />
                  <span>{item.contact.phone}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {modalOpen && (
        <ClaimModal
          item={item}
          onClose={() => setModalOpen(false)}
          onSuccess={() => setRecovered(true)}
        />
      )}
    </div>
  );
};

export default ViewDetails;