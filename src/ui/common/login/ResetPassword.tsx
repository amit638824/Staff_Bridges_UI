"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "@/ui/common/loader/Loader";
import {
  resetlinkExpireCheckService,
  resetPasswordService,
} from "@/services/AuthServices";
import { showAlert } from "@/utils/swalFire"; 
const schema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Minimum 6 characters required")
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const [token, setToken] = useState<string>("");
  const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
  const [linkError, setLinkError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  }); 
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");

    if (urlToken) {
      setToken(urlToken);
    } else {
      setLinkError("Invalid reset password link");
      setLoading(false);
    }
  }, []); 
  useEffect(() => {
    const checkResetLink = async () => {
      try {
        if (!token) return; 
        const response = await resetlinkExpireCheckService({ token }); 
        if (response.success) {
          setIsLinkValid(true);
        } else {
          setLinkError(response.message || "Reset link expired");
        }
      } catch (error: any) {
        setLinkError(
          error?.response?.data?.message || "Reset link expired"
        );
      } finally {
        setLoading(false);
      }
    };

    checkResetLink();
  }, [token]); 
  const onSubmit = async (formData: any) => {
    if (!token) {
      showAlert("error", "Invalid or expired reset link!", "Failed");
      return;
    }

    try {
      const response = await resetPasswordService({
        token,
        password: formData.password,
      });

      showAlert(
        response.success ? "success" : "error",
        response.message,
        response.success ? "Success" : "Failed"
      );

      if (response.success) {
        reset(); 
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
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", borderRadius: "20px" }}
      >
        {/* Loading */}
        {loading &&  <Loader/>}

        {/* Expired / Invalid Link */}
        {!loading && !isLinkValid && (
          <h4 className="text-center text-danger">{linkError}</h4>
        )}

        {/* Reset Password Form */}
        {!loading && isLinkValid && (
          <>
            <h3 className="text-center mb-4">Reset Password 🔐</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* New Password */}
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter new password"
                  {...register("password")}
                />
                <small className="invalid-feedback">
                  {errors.password?.message}
                </small>
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
                <small className="invalid-feedback">
                  {errors.confirmPassword?.message}
                </small>
              </div>

              <button
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
