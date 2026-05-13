import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  divider,
  loadingClass,
} from "../styles/common";

import { NavLink, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

function Register() {
  const { register, handleSubmit } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    try {
      setLoading(true);
      setError(null);

      // Create formData
      const formData = new FormData();

      // Separate role and image
      let { role, profileImageUrl, ...userObj } = newUser;

      // Add normal fields
      Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
      });

      // Add role
      formData.append("role", role);

      // Add image
      if (profileImageUrl && profileImageUrl[0]) {
        formData.append("profileImageUrl", profileImageUrl[0]);
      }

      let resObj;

      // USER registration
      if (role === "user") {
        resObj = await axios.post(
          "http://localhost:4000/user-api/users",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // AUTHOR registration
      if (role === "author") {
        resObj = await axios.post(
          "http://localhost:4000/author-api/users",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log("Registration success:", resObj);

      // Redirect to login
      if (resObj.status === 201 || resObj.status === 200) {
        navigate("/login");
      }

    } catch (err) {
      console.log("Registration error:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview image
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Loading
  if (loading) {
    return <p className={loadingClass}>Loading...</p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>

        {/* Title */}
        <h2 className={formTitle}>Create an Account</h2>

        {/* Error */}
        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>

          {/* Role */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>

            <div className="flex gap-6 mt-1">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role", { required: true })}
                  value="user"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">
                  User
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role", { required: true })}
                  value="author"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">
                  Author
                </span>
              </label>

            </div>
          </div>

          <div className={divider} />

          {/* Names */}
          <div className="sm:flex gap-4 mb-4">

            <div className="flex-1">
              <label className={labelClass}>First Name</label>

              <input
                type="text"
                {...register("firstName", { required: true })}
                placeholder="First name"
                className={inputClass}
              />
            </div>

            <div className="flex-1">
              <label className={labelClass}>Last Name</label>

              <input
                type="text"
                {...register("lastName", { required: true })}
                placeholder="Last name"
                className={inputClass}
              />
            </div>

          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>

            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>

            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Min. 8 characters"
              className={inputClass}
            />
          </div>

          {/* Image */}
          <div className={formGroup}>

            <label className={labelClass}>
              Profile Image
            </label>

            <input
              type="file"
              accept="image/png, image/jpeg"
              {...register("profileImageUrl")}
              onChange={(e) => {

                const file = e.target.files[0];

                if (file) {

                  // Validate format
                  if (
                    !["image/jpeg", "image/png"].includes(file.type)
                  ) {
                    setError("Only JPG or PNG allowed");
                    return;
                  }

                  // Validate size
                  if (file.size > 2 * 1024 * 1024) {
                    setError("File size must be less than 2MB");
                    return;
                  }

                  const previewUrl = URL.createObjectURL(file);

                  setPreview(previewUrl);
                  setError(null);
                }
              }}
            />

            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={submitBtn}
          >
            Create Account
          </button>

        </form>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}

          <NavLink
            to="/login"
            className="text-violet-600 hover:text-violet-500 font-medium"
          >
            Sign in
          </NavLink>
        </p>

      </div>
    </div>
  );
}

export default Register;