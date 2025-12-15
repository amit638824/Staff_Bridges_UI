"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordService } from "@/services/AuthServices";
import Link from "next/link";
import { showAlert } from "@/utils/swalFire";
import Image from "next/image";
import Loader from "../loader/Loader";

// Yup Schema
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});

const ForgetPassword = () => {
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
    try {
      const response = await forgotPasswordService(formData.email);

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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-themebg">
      {isSubmitting && <Loader />}

      <div className="card p-4 shadow-lg loginBox">
        <div className="logoheader mb-3 text-center">
          <Image
            src="/assets/images/logo.png"
            width={150}
            height={74}
            alt="Logo"
          />
        </div>

        <h3 className="text-center mb-4">
          Forgot Password
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Enter your email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="example@gmail.com"
              {...register("email")}
            />
            {errors.email && (
              <small className="invalid-feedback">
                {errors.email.message}
              </small>
            )}
          </div>

          {/* Button */}
          <button
            disabled={isSubmitting}
            className="btn btn-primary w-100"
            type="submit"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0"> 
          <Link href="/" className="text-primary">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
