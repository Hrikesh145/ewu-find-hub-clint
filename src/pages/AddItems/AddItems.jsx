import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import {
  HiOutlineSearch,
  HiOutlineArchive,
  HiOutlineDocumentText,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlinePhotograph,
  HiOutlineArrowRight,
  HiOutlineLockClosed,
  HiOutlinePhone,
} from 'react-icons/hi';

import 'react-datepicker/dist/react-datepicker.css';
import './AddItems.css';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';



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

const AddItems = () => {
  const { user }   = useAuth();
  const axiosInstance = useAxios();
  const navigate   = useNavigate();

  const [postType,      setPostType]      = useState('lost');
  const [imageFile,     setImageFile]     = useState(null);
  const [imagePreview,  setImagePreview]  = useState(null);
  const [submitting,    setSubmitting]    = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title:       '',
      category:    '',
      description: '',
      location:    '',
      date:        new Date(),
      phone:       '',
    },
  });

  const description = watch('description', '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const toastId = toast.loading('Publishing your post...');

    try {
      let photoURL = '';
      if (imageFile) {
        photoURL = await uploadToImgBB(imageFile);
      }

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
        status:    'posted',
        createdAt: new Date(),
      };

      await axiosInstance.post('/items', payload);

      toast.success('Post published successfully!', { id: toastId });
      navigate('/allItems');

    } catch (err) {
      console.error(err);
      toast.error('Failed to publish. Please try again.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="ai-page">
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div className="ai-header">
        <div>
          <h1 className="ai-title">
            Report a <span>Lost or Found</span> Item
          </h1>
          <p className="ai-sub">
            Submit details about your item. Our center will hold it safely until the owner is found.
          </p>
        </div>
      </div>

      <div className="ai-layout">

        {/* ══ LEFT — FORM ══ */}
        <form className="ai-main" onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* 1. POST TYPE */}
          <div className="ai-card ai-card--accent">
            <div className="ai-card__head">
              <div className="ai-card__head-left">
                <div className="ai-card__icon"><HiOutlineDocumentText /></div>
                <div>
                  <div className="ai-card__title">Post type</div>
                  <div className="ai-card__sub">What are you reporting?</div>
                </div>
              </div>
              <span className="ai-badge">Step 1</span>
            </div>
            <div className="ai-card__body">
              <div className="ai-type-grid">
                <button
                  type="button"
                  className={`ai-type-card ai-type-card--lost ${postType === 'lost' ? 'selected' : ''}`}
                  onClick={() => setPostType('lost')}
                >
                  {postType === 'lost' && (
                    <div className="ai-type-check">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="ai-type-icon ai-type-icon--lost">🔍</div>
                  <div className="ai-type-label">I lost something</div>
                  <div className="ai-type-desc">Report an item you've lost on campus and hope to find.</div>
                </button>

                <button
                  type="button"
                  className={`ai-type-card ai-type-card--found ${postType === 'found' ? 'selected' : ''}`}
                  onClick={() => setPostType('found')}
                >
                  {postType === 'found' && (
                    <div className="ai-type-check">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="ai-type-icon ai-type-icon--found">📦</div>
                  <div className="ai-type-label">I found something</div>
                  <div className="ai-type-desc">Report an item you've found and want to return safely.</div>
                </button>
              </div>
            </div>
          </div>

          {/* 2. ITEM DETAILS */}
          <div className="ai-card ai-card--accent">
            <div className="ai-card__head">
              <div className="ai-card__head-left">
                <div className="ai-card__icon"><HiOutlineDocumentText /></div>
                <div>
                  <div className="ai-card__title">Item information</div>
                  <div className="ai-card__sub">Describe the item clearly</div>
                </div>
              </div>
              <span className="ai-badge">Step 2</span>
            </div>
            <div className="ai-card__body">

              <div className="ai-fg2">
                <div className="ai-fg">
                  <label className="ai-label">Title <span className="ai-req">*</span></label>
                  <div className="ai-input-wrap">
                    <HiOutlineDocumentText className="ai-input-icon" />
                    <input
                      className={`ai-input ${errors.title ? 'ai-input--err' : ''}`}
                      placeholder="e.g. Blue water bottle, Black backpack"
                      {...register('title', { required: 'Title is required' })}
                    />
                  </div>
                  {errors.title && <span className="ai-err">{errors.title.message}</span>}
                </div>

                <div className="ai-fg">
                  <label className="ai-label">Category <span className="ai-req">*</span></label>
                  <select
                    className={`ai-select ${errors.category ? 'ai-input--err' : ''}`}
                    {...register('category', { required: 'Category is required' })}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className="ai-err">{errors.category.message}</span>}
                </div>
              </div>

              <div className="ai-fg">
                <label className="ai-label">Description <span className="ai-req">*</span></label>
                <textarea
                  className={`ai-textarea ${errors.description ? 'ai-input--err' : ''}`}
                  placeholder="Describe the item — color, brand, model, size, markings..."
                  maxLength={500}
                  {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'At least 10 characters' } })}
                />
                <div className="ai-field-foot">
                  {errors.description
                    ? <span className="ai-err">{errors.description.message}</span>
                    : <span />
                  }
                  <span className={`ai-count ${description.length > 450 ? 'ai-count--warn' : ''}`}>
                    {description.length} / 500
                  </span>
                </div>
              </div>

              <div className="ai-fg2">
                <div className="ai-fg">
                  <label className="ai-label">Campus location <span className="ai-req">*</span></label>
                  <div className="ai-input-wrap">
                    <HiOutlineLocationMarker className="ai-input-icon" />
                    <input
                      className={`ai-input ${errors.location ? 'ai-input--err' : ''}`}
                      placeholder="e.g. Library 3rd floor, Cafeteria"
                      {...register('location', { required: 'Location is required' })}
                    />
                  </div>
                  {errors.location && <span className="ai-err">{errors.location.message}</span>}
                </div>

                <div className="ai-fg">
                  <label className="ai-label">Date <span className="ai-req">*</span></label>
                  <div className="ai-input-wrap">
                    <HiOutlineCalendar className="ai-input-icon" />
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
                          placeholderText="Select date"
                          className={`ai-input ai-input--date ${errors.date ? 'ai-input--err' : ''}`}
                          wrapperClassName="ai-datepicker-wrap"
                        />
                      )}
                    />
                  </div>
                  {errors.date && <span className="ai-err">{errors.date.message}</span>}
                </div>
              </div>

            </div>
          </div>

          {/* 3. PHOTO */}
          <div className="ai-card ai-card--accent">
            <div className="ai-card__head">
              <div className="ai-card__head-left">
                <div className="ai-card__icon"><HiOutlinePhotograph /></div>
                <div>
                  <div className="ai-card__title">Item photo</div>
                  <div className="ai-card__sub">Upload from device via ImgBB</div>
                </div>
              </div>
              <span className="ai-badge ai-badge--ok">Recommended</span>
            </div>
            <div className="ai-card__body">
              <label className="ai-photo-upload">
                <input
                  type="file"
                  accept="image/*"
                  className="ai-photo-input"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div className="ai-photo-preview-row">
                    <img src={imagePreview} alt="preview" className="ai-photo-thumb" />
                    <div>
                      <div className="ai-photo-title">Photo selected</div>
                      <div className="ai-photo-sub">Click to change</div>
                    </div>
                  </div>
                ) : (
                  <div className="ai-photo-empty">
                    <div className="ai-photo-box">
                      <HiOutlinePhotograph />
                    </div>
                    <div>
                      <div className="ai-photo-title">Drag & drop or click to upload</div>
                      <div className="ai-photo-sub">JPG, PNG, WEBP · Max 5MB · Uploaded via ImgBB</div>
                    </div>
                    <div className="ai-photo-btn">
                      Upload
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* 4. CONTACT */}
          <div className="ai-card ai-card--accent">
            <div className="ai-card__head">
              <div className="ai-card__head-left">
                <div className="ai-card__icon"><HiOutlineUser /></div>
                <div>
                  <div className="ai-card__title">Contact information</div>
                  <div className="ai-card__sub">Pre-filled from your account</div>
                </div>
              </div>
              <span className="ai-badge">Step 3</span>
            </div>
            <div className="ai-card__body">
              <div className="ai-contact-block">
                <div className="ai-contact-av">
                  {user?.photoURL
                    ? <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
                    : initials
                  }
                </div>
                <div className="ai-contact-info">
                  <div className="ai-contact-name">{user?.displayName || 'Student'}</div>
                  <div className="ai-contact-email">{user?.email}</div>
                </div>
                <div className="ai-contact-lock">
                  <HiOutlineLockClosed />
                  Locked
                </div>
              </div>

              <div className="ai-fg" style={{ marginTop: '16px' }}>
                <label className="ai-label">Phone number <span className="ai-req">*</span></label>
                <div className="ai-input-wrap">
                  <HiOutlinePhone className="ai-input-icon" />
                  <input
                    type="tel"
                    className={`ai-input ${errors.phone ? 'ai-input--err' : ''}`}
                    placeholder="+880 1XXX-XXXXXX"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^[0-9+\-\s()]{7,15}$/, message: 'Enter a valid phone number' },
                    })}
                  />
                </div>
                {errors.phone && <span className="ai-err">{errors.phone.message}</span>}
              </div>

              <p className="ai-contact-note">
                Your name and email are auto-attached. Phone is visible only to the admin, not other users.
              </p>
            </div>
          </div>

          {/* 5. SUBMIT */}
          <div className="ai-submit-card">
            <button type="submit" className="ai-btn-submit" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish post'}
              {!submitting && <HiOutlineArrowRight />}
            </button>
            <button type="button" className="ai-btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <div className="ai-submit-note">
              <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <p>
                Your post is visible immediately. If you found an item, please drop it at the{' '}
                <strong>EWU Lost & Found Center</strong> so the admin can confirm receipt.
              </p>
            </div>
          </div>

        </form>

        {/* ══ RIGHT — SIDEBAR ══ */}
        <div className="ai-sidebar">

          <div className="ai-sidebar-card">
            <div className="ai-sb-head">
              <span>⭐</span>
              <span className="ai-sb-title">Posting guidelines</span>
            </div>
            <div className="ai-sb-body">
              {[
                { n: '1', t: 'Be specific.', d: 'Include color, brand, size and any unique marks.' },
                { n: '2', t: 'Add a photo.', d: 'Posts with photos are resolved 3× faster.' },
                { n: '3', t: 'Exact location.', d: 'Building, floor and room number help a lot.' },
                { n: '4', t: 'Submit to center.', d: 'Found something? Drop it at the EWU desk after posting.' },
              ].map(({ n, t, d }) => (
                <div key={n} className="ai-gl-item">
                  <div className="ai-gl-num">{n}</div>
                  <div className="ai-gl-text"><strong>{t}</strong> {d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-sidebar-card">
            <div className="ai-sb-head">
              <span>🔄</span>
              <span className="ai-sb-title">Status lifecycle</span>
            </div>
            <div className="ai-sb-body">
              {[
                { cls: 's1', label: 'Posted',      sub: 'Visible on platform'     },
                { cls: 's2', label: 'Submitted',   sub: 'Dropped at EWU center'   },
                { cls: 's3', label: 'At Center',   sub: 'Admin confirmed receipt' },
                { cls: 's4', label: 'Returned ✓',  sub: 'Owner collected item'    },
              ].map(({ cls, label, sub }) => (
                <div key={cls} className={`ai-sf-step ai-sf-step--${cls}`}>
                  <div className="ai-sf-dot" />
                  <div>
                    <div className="ai-sf-label">{label}</div>
                    <div className="ai-sf-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddItems;