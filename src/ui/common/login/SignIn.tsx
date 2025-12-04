"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginService } from "@/services/AuthServices";
import { showAlert } from "@/utils/swalFire";
import GoogleButton from "@/ui/common/login/GoogleSignInButton";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/authSlice";
import { useSession } from "@/hooks/useSession";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";
import Loader from "@/ui/common/loader/Loader";

// Validation schema
const schema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

    password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
});

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // <-- Loader State

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const { user, token, isLoggedIn } = useSession();
    const dispatch = useDispatch();

    const onSubmit = async (formData: any) => {
        try {
            setLoading(true);  
            const response = await loginService(formData); 
            if (!response?.success) { 
                return showAlert("error", response?.message || "Login failed", "Failed");
            } 
            localStorage.setItem("token", response?.data?.token);
            const role = response?.data?.user?.roletbl_roleName; 
            dispatch(login({ user: response?.data?.user, token: response?.data?.token }));  
            // Redirect based on role
            switch (role) {
                case "SUPER_ADMIN":
                    window.location.href = "/super-admin/dashboard";
                    break;
                case "OPERATIONS_ADMIN":
                    window.location.href = "/operations/dashboard";
                    break;
                case "FINANCE_ADMIN":
                    window.location.href = "/finance/dashboard";
                    break;
                case "RECRUITER":
                    window.location.href = "/recruiter";
                    break;
                default:
                    window.location.href = "/";
            }
        } catch (error: any) {
            showAlert(
                "error",
                error?.response?.data?.message || "Something went wrong!",
                "Login Failed"
            );
        } finally {
            setLoading(false); // STOP LOADER
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-themebg">
            {loading && <Loader />}
            <div className="card p-4 shadow-lg loginBox">
                <div className="logoheader mb-3">
                    <Image src="/assets/images/logo.png" width={150} height={74} alt="Logo" />
                </div>
                <h3 className="text-center mb-4">Welcome to Staff Bridges!</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email Field */}
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            placeholder="Enter your email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email.message}</div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-3 position-relative">
                        <label className="form-label">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            placeholder="Enter your password"
                            {...register("password")}
                        />
                        <span
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            style={{ cursor: "pointer", userSelect: "none" }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}
                        </span>
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                    </div>

                    {/* Remember Me + Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="remeberme">
                            <input type="checkbox" id="remember" />
                            <label className="ms-2" htmlFor="remember">
                                Remember me
                            </label>
                        </div>
                        <Link href="/forget-password" className="themeBlue">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                        disabled={loading}
                    >
                        Login
                    </button>
                </form>

                {/* Signup & Google Login */}
                <div className="text-center mt-3">
                    <p>
                        Don’t have an account?{" "}
                        <Link href="/signup" className="themeBlue">
                            Sign up
                        </Link>
                    </p>
                    <GoogleButton />
                </div>
            </div>
        </div>
    );
};

export default SignIn;
