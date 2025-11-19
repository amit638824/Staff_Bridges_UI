"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordService } from "@/services/AuthServices";
import { showAlert } from "@/utils/swalFire";
 

// Yup Validation Schema
const schema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Minimum 6 characters required")
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Read token from URL
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) setToken(urlToken);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Submit Handler
  const onSubmit = async (formData: any) => {
    if (!token) {
      showAlert("error", "Invalid or expired reset link!", "Failed");
      return;
    }

    const payload = {
      token,
      password: formData.password,
    };

    try {
      const response = await resetPasswordService(payload);

      showAlert(
        response.success ? "success" : "error",
        response.message,
        response.success ? "Success" : "Failed"
      );

      if (response.success) {
        reset();
        // window.location.href = "/sign-in"; // redirect to login
      }
    } catch (error: any) {
      showAlert(
        "error",
        error?.response?.data?.message || "Something went wrong!",
        "Failed"
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "20px" }}>
        <h3 className="text-center mb-4">Reset Password 🔐</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter new password"
              {...register("password")}
            />
            {errors.password && (
              <small className="invalid-feedback">{errors.password.message}</small>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <small className="invalid-feedback">
                {errors.confirmPassword.message}
              </small>
            )}
          </div>

          {/* Submit */}
          <button disabled={isSubmitting} className="btn btn-primary w-100">
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
