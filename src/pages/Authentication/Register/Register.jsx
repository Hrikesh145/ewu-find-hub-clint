import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import Logo from "../../../components/Shared/Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import "../../../components/Shared/Auth/Auth.css";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 2v8M5 5l3-3 3 3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 11v1a2 2 0 002 2h8a2 2 0 002-2v-1"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Password Rule Pill ── */
const Rule = ({ ok, label }) => (
  <div className={`pw-rule ${ok ? "pw-rule--ok" : "pw-rule--fail"}`}>
    {ok ? "✓" : "✕"} {label}
  </div>
);

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const password = watch("password", "");
  const rules = {
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasLength: password.length >= 6,
  };

  /* ── Upload image to ImgBB ── */
  const uploadToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      { method: "POST", body: formData },
    );
    const data = await res.json();

    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
  };

  /* ── Handle image preview ── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /* ── Save user to MongoDB ── */
  const saveUserToDB = async (userData) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  };

  /* ── Main Submit ── */
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      /* 1. Upload image to ImgBB */
      setImageUploading(true);
      const imageFile = data.photo[0];
      const photoURL = await uploadToImgBB(imageFile);
      setImageUploading(false);
      console.log("Uploaded photo URL:", photoURL);

      /* 2. Create Firebase user */
      const userCredential = await createUser(data.email, data.password);
      console.log("Firebase user created:", userCredential.user);

      /* 3. Update Firebase profile */
      await updateUserProfile({
        displayName: data.name,
        photoURL: photoURL,
      });

      /* 4. Save to MongoDB */
      const dbUser = {
        name: data.name,
        email: data.email,
        photoURL: photoURL,
        studentId: data.studentId,
        role: "student",
        createdAt: new Date(),
      };
      await saveUserToDB(dbUser);
      console.log("User saved to DB:", dbUser);

      /* 5. Success */
      await Swal.fire({
        icon: "success",
        title: "Account created!",
        text: `Welcome to EWU FindHub, ${data.name}!`,
        confirmButtonText: "Get started →",
        confirmButtonColor: "#0B3D91",
      });

      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      setImageUploading(false);

      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: err?.message || "Something went wrong. Please try again.",
        confirmButtonText: "Try again",
        confirmButtonColor: "#0B3D91",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── Google ── */
  const handleGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("Google register:", result.user);

      await saveUserToDB({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        studentId: "",
        role: "student",
        createdAt: new Date(),
      });

      toast.success(`Welcome, ${result.user.displayName}!`, {
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          borderRadius: "100px",
        },
      });

      navigate("/");
    } catch (err) {
      console.error("Google register error:", err);
      toast.error("Google sign-up failed. Please try again.");
    }
  };

  const isSubmitting = loading || imageUploading;

  return (
    <>
      <Toaster position="top-center" />

      <div className="auth-card">
        <div className="auth-card__body">
          {/* Logo */}
          <div className="mb-7">
            <Logo href="/" size="md" />
          </div>

          {/* Heading */}
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">
            Already registered? <Link to="/login">Sign in →</Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name + Student ID */}
            <div className="fg2">
              <div className="fg">
                <label className="fl">Full name</label>
                <input
                  type="text"
                  placeholder="Rahim Ahmed"
                  className={`fi ${errors.name ? "fi--error" : ""}`}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: { value: 3, message: "At least 3 characters" },
                  })}
                />
                {errors.name && (
                  <span className="f-error">✕ {errors.name.message}</span>
                )}
              </div>

              <div className="fg">
                <label className="fl">Student ID</label>
                <input
                  type="text"
                  placeholder="2021-1-60-001"
                  className={`fi ${errors.studentId ? "fi--error" : ""}`}
                  {...register("studentId", {
                    required: "Student ID is required",
                    pattern: {
                      value: /^[0-9\-]+$/,
                      message: "Numbers and dashes only",
                    },
                  })}
                />
                {errors.studentId && (
                  <span className="f-error">✕ {errors.studentId.message}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="fg">
              <label className="fl">Email address</label>
              <input
                type="email"
                placeholder="yourname@ewubd.edu"
                className={`fi ${errors.email ? "fi--error" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="f-error">✕ {errors.email.message}</span>
              )}
            </div>

            {/* Photo Upload */}
            <div className="fg">
              <label className="fl">Profile photo</label>
              <label
                className={`fi-upload ${errors.photo ? "fi-upload--error" : ""}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="fi-upload__input"
                  {...register("photo", {
                    required: "Profile photo is required",
                  })}
                  onChange={(e) => {
                    register("photo").onChange(e);
                    handleImageChange(e);
                  }}
                />
                <div className="fi-upload__content">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="fi-upload__preview"
                      />
                      <span className="fi-upload__change">Click to change</span>
                    </>
                  ) : (
                    <>
                      <div className="fi-upload__icon">
                        <UploadIcon />
                      </div>
                      <span className="fi-upload__txt">
                        Click to upload photo
                        <span className="fi-upload__hint">
                          JPG, PNG, WEBP — max 5MB
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </label>
              {errors.photo && (
                <span className="f-error">✕ {errors.photo.message}</span>
              )}
              {imageUploading && (
                <span className="f-uploading">Uploading image...</span>
              )}
            </div>

            {/* Password */}
            <div className="fg">
              <label className="fl">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                className={`fi ${errors.password ? "fi--error" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "At least 6 characters required",
                  },
                  validate: {
                    hasUpper: (v) =>
                      /[A-Z]/.test(v) || "Must contain an uppercase letter",
                    hasLower: (v) =>
                      /[a-z]/.test(v) || "Must contain a lowercase letter",
                  },
                })}
              />
              <div className="pw-rules">
                <Rule ok={rules.hasUpper} label="Uppercase" />
                <Rule ok={rules.hasLower} label="Lowercase" />
                <Rule ok={rules.hasLength} label="Min 6 chars" />
              </div>
              {errors.password && (
                <span className="f-error">✕ {errors.password.message}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
              style={{ marginTop: "8px" }}
            >
              {isSubmitting
                ? imageUploading
                  ? "Uploading image..."
                  : "Creating account..."
                : "Create account"}
              {!isSubmitting && <ArrowIcon />}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider__line" />
            <div className="auth-divider__txt">or sign up with</div>
            <div className="auth-divider__line" />
          </div>

          {/* Google */}
          <button className="btn-google" onClick={handleGoogle} type="button">
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Terms */}
          <div className="auth-terms">
            By creating an account you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
