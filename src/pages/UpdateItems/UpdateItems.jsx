import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import toast, { Toaster } from 'react-hot-toast';
import {
  HiOutlineDocumentText,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlinePhotograph,
  HiOutlineArrowRight,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

import 'react-datepicker/dist/react-datepicker.css';
import './UpdateItems.css';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const CATEGORIES = [
  'Gadgets', 'Documents', 'Accessories',
  'Pets', 'Books & Stationery', 'Clothing',
  'Keys', 'Wallet / Purse', 'Other',
];

const uploadToImgBB = async (file) => {
  const form = new FormData();
  form.append('image', file);
  const res  = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    { method: 'POST', body: form }
  );
  const data = await res.json();
  if (!data.success) throw new Error('Image upload failed');
  return data.data.url;
};

const UpdateItems = () => {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure   = useAxiosSecure();

  const [postType,     setPostType]     = useState('lost');
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting,   setSubmitting]   = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  /* ── Fetch existing item & prefill ── */
  const { isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn:  async () => {
      const res = await axiosInstance.get(`/items/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setPostType(data.postType || 'lost');
      setImagePreview(data.photoURL || null);
      reset({
        title:       data.title        || '',
        category:    data.category     || '',
        description: data.description  || '',
        location:    data.location     || '',
        date:        data.date ? new Date(data.date) : new Date(),
        phone:       data.contact?.phone || '',
      });
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ── Submit ── */
  const mutation = useMutation({
    mutationFn: async (data) => {
      let photoURL = imagePreview;
      if (imageFile) photoURL = await uploadToImgBB(imageFile);

      const payload = {
        postType,
        title:       data.title,
        category:    data.category,
        description: data.description,
        location:    data.location,
        date:        data.date,
        photoURL,
        contact: {
          name:  user.displayName,
          email: user.email,
          phone: data.phone,
        },
      };
      await axiosSecure.put(`/items/${id}`, payload);
    },
    onSuccess: () => {
      toast.success('Item updated successfully!');
      navigate('/myItems');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to update. Please try again.');
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setSubmitting(false);
    }
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (isLoading) return (
    <div className="ui-spinner-wrap">
      <div className="ui-spinner" /><p>Loading item...</p>
    </div>
  );

  return (
    <div className="ui-page">
      <Toaster position="top-center" />

      <div className="ui-header">
        <button className="ui-back" onClick={() => navigate('/myItems')}>
          <HiOutlineArrowLeft /> My Items
        </button>
        <div>
          <h1 className="ui-title">Update <span>Item</span></h1>
          <p className="ui-sub">Edit the details of your lost or found post.</p>
        </div>
      </div>

      <div className="ui-layout">

        <form className="ui-main" onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Post Type */}
          <div className="ui-card ui-card--accent">
            <div className="ui-card__head">
              <div className="ui-card__head-left">
                <div className="ui-card__icon"><HiOutlineDocumentText /></div>
                <div>
                  <div className="ui-card__title">Post type</div>
                  <div className="ui-card__sub">Lost or Found?</div>
                </div>
              </div>
            </div>
            <div className="ui-card__body">
              <div className="ui-type-grid">
                <button
                  type="button"
                  className={`ui-type-card ui-type-card--lost ${postType === 'lost' ? 'selected' : ''}`}
                  onClick={() => setPostType('lost')}
                >
                  {postType === 'lost' && (
                    <div className="ui-type-check">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="ui-type-icon ui-type-icon--lost">🔍</div>
                  <div className="ui-type-label">I lost something</div>
                </button>
                <button
                  type="button"
                  className={`ui-type-card ui-type-card--found ${postType === 'found' ? 'selected' : ''}`}
                  onClick={() => setPostType('found')}
                >
                  {postType === 'found' && (
                    <div className="ui-type-check">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="ui-type-icon ui-type-icon--found">📦</div>
                  <div className="ui-type-label">I found something</div>
                </button>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="ui-card ui-card--accent">
            <div className="ui-card__head">
              <div className="ui-card__head-left">
                <div className="ui-card__icon"><HiOutlineDocumentText /></div>
                <div>
                  <div className="ui-card__title">Item information</div>
                  <div className="ui-card__sub">Update the item details</div>
                </div>
              </div>
            </div>
            <div className="ui-card__body">
              <div className="ui-fg2">
                <div className="ui-fg">
                  <label className="ui-label">Title <span className="ui-req">*</span></label>
                  <div className="ui-input-wrap">
                    <HiOutlineDocumentText className="ui-input-icon" />
                    <input
                      className={`ui-input ${errors.title ? 'ui-input--err' : ''}`}
                      placeholder="e.g. Blue water bottle"
                      {...register('title', { required: 'Title is required' })}
                    />
                  </div>
                  {errors.title && <span className="ui-err">{errors.title.message}</span>}
                </div>
                <div className="ui-fg">
                  <label className="ui-label">Category <span className="ui-req">*</span></label>
                  <select
                    className={`ui-select ${errors.category ? 'ui-input--err' : ''}`}
                    {...register('category', { required: 'Category is required' })}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className="ui-err">{errors.category.message}</span>}
                </div>
              </div>

              <div className="ui-fg">
                <label className="ui-label">Description <span className="ui-req">*</span></label>
                <textarea
                  className={`ui-textarea ${errors.description ? 'ui-input--err' : ''}`}
                  placeholder="Describe the item in detail..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <span className="ui-err">{errors.description.message}</span>}
              </div>

              <div className="ui-fg2">
                <div className="ui-fg">
                  <label className="ui-label">Campus location <span className="ui-req">*</span></label>
                  <div className="ui-input-wrap">
                    <HiOutlineLocationMarker className="ui-input-icon" />
                    <input
                      className={`ui-input ${errors.location ? 'ui-input--err' : ''}`}
                      placeholder="e.g. Library 3rd floor"
                      {...register('location', { required: 'Location is required' })}
                    />
                  </div>
                  {errors.location && <span className="ui-err">{errors.location.message}</span>}
                </div>
                <div className="ui-fg">
                  <label className="ui-label">Date <span className="ui-req">*</span></label>
                  <div className="ui-input-wrap">
                    <HiOutlineCalendar className="ui-input-icon" />
                    <Controller
                      name="date" control={control}
                      rules={{ required: 'Date is required' }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="MMMM d, yyyy"
                          maxDate={new Date()}
                          className={`ui-input ui-input--date ${errors.date ? 'ui-input--err' : ''}`}
                          wrapperClassName="ui-datepicker-wrap"
                          placeholderText="Select date"
                        />
                      )}
                    />
                  </div>
                  {errors.date && <span className="ui-err">{errors.date.message}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="ui-card ui-card--accent">
            <div className="ui-card__head">
              <div className="ui-card__head-left">
                <div className="ui-card__icon"><HiOutlinePhotograph /></div>
                <div>
                  <div className="ui-card__title">Item photo</div>
                  <div className="ui-card__sub">Upload new or keep existing</div>
                </div>
              </div>
            </div>
            <div className="ui-card__body">
              <label className="ui-photo-upload">
                <input type="file" accept="image/*" className="ui-photo-input" onChange={handleImageChange} />
                {imagePreview ? (
                  <div className="ui-photo-preview-row">
                    <img src={imagePreview} alt="preview" className="ui-photo-thumb" />
                    <div>
                      <div className="ui-photo-title">{imageFile ? 'New photo selected' : 'Current photo'}</div>
                      <div className="ui-photo-sub">Click to change</div>
                    </div>
                  </div>
                ) : (
                  <div className="ui-photo-empty">
                    <div className="ui-photo-box"><HiOutlinePhotograph /></div>
                    <div>
                      <div className="ui-photo-title">Click to upload a photo</div>
                      <div className="ui-photo-sub">JPG, PNG, WEBP · Max 5MB</div>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Contact */}
          <div className="ui-card ui-card--accent">
            <div className="ui-card__head">
              <div className="ui-card__head-left">
                <div className="ui-card__icon"><HiOutlineUser /></div>
                <div>
                  <div className="ui-card__title">Contact information</div>
                  <div className="ui-card__sub">Pre-filled from your account</div>
                </div>
              </div>
            </div>
            <div className="ui-card__body">
              <div className="ui-contact-block">
                <div className="ui-contact-av">
                  {user?.photoURL
                    ? <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
                    : initials
                  }
                </div>
                <div className="ui-contact-info">
                  <div className="ui-contact-name">{user?.displayName || 'Student'}</div>
                  <div className="ui-contact-email">{user?.email}</div>
                </div>
                <div className="ui-contact-lock"><HiOutlineLockClosed /> Locked</div>
              </div>
              <div className="ui-fg" style={{ marginTop: '16px' }}>
                <label className="ui-label">Phone number <span className="ui-req">*</span></label>
                <div className="ui-input-wrap">
                  <HiOutlinePhone className="ui-input-icon" />
                  <input
                    type="tel"
                    className={`ui-input ${errors.phone ? 'ui-input--err' : ''}`}
                    placeholder="+880 1XXX-XXXXXX"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern:  { value: /^[0-9+\-\s()]{7,15}$/, message: 'Enter a valid phone number' },
                    })}
                  />
                </div>
                {errors.phone && <span className="ui-err">{errors.phone.message}</span>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="ui-submit-card">
            <button type="submit" className="ui-btn-submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save changes'}
              {!submitting && <HiOutlineArrowRight />}
            </button>
            <button type="button" className="ui-btn-cancel" onClick={() => navigate('/myItems')}>
              Cancel
            </button>
          </div>

        </form>

        {/* Sidebar */}
        <div className="ui-sidebar">
          <div className="ui-sidebar-card">
            <div className="ui-sb-head"><span>ℹ️</span><span className="ui-sb-title">Update guidelines</span></div>
            <div className="ui-sb-body">
              {[
                { n: '1', t: 'Status stays.',  d: 'Editing does not reset the item status.' },
                { n: '2', t: 'New photo.',      d: 'Upload a new image or keep the existing one.' },
                { n: '3', t: 'Contact locked.', d: 'Name and email are locked to your account.' },
                { n: '4', t: 'Instant save.',   d: 'All updates are saved immediately to the database.' },
              ].map(({ n, t, d }) => (
                <div key={n} className="ui-gl-item">
                  <div className="ui-gl-num">{n}</div>
                  <div className="ui-gl-text"><strong>{t}</strong> {d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UpdateItems;