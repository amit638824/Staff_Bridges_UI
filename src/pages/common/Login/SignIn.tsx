"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"; 
import { loginService } from "@/services/AuthServices";
import { showAlert } from "@/utils/swalFire";
import GoogleButton from "@/pages/common/Login/GoogleSignInButton";
// Yup Schema
const schema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

    password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
});

const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // Submit Handler
    const onSubmit = async (formData: any) => {
        try {
            const response = await loginService(formData);
            showAlert(response.success ? "success" : "error", response.message, response.success ? "Success" : "Failed");
            if (!response.success) return;
            // Save token
            localStorage.setItem("token", response.data.token);
            const role = response.data.user.roletbl_roleName;
            // switch (role) {
            //   case "SUPER_ADMIN":
            //     window.location.href = "/super-admin/dashboard";
            //     break;

            //   case "OPERATIONS_ADMIN":
            //     window.location.href = "/operations/dashboard";
            //     break;

            //   case "FINANCE_ADMIN":
            //     window.location.href = "/finance/dashboard";
            //     break;

            //   default:
            //     window.location.href = "/";
            // }
        } catch (error: any) {
            showAlert("error", error?.response?.data?.message || "Something went wrong!", "Login Failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "20px" }}>
                <h3 className="text-center mb-4">Welcome Back 👋</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            placeholder="Enter your email"
                            {...register("email")}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            placeholder="Enter your password"
                            {...register("password")}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>


                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <input type="checkbox" id="remember" />
                            <label className="ms-2" htmlFor="remember">Remember me</label>
                        </div>
                        <Link href="/forget-password">Forgot Password?</Link>
                    </div>


                    <button className="btn btn-primary w-100">Login</button>
                </form>

                <div className="text-center mt-3">
                    <p>
                        Don’t have an account?{" "}
                        <Link href="/signup" className="text-primary">Sign up</Link>
                    </p> 
                    <GoogleButton />
                </div>
            </div>
        </div>

    );
};

export default SignIn;

