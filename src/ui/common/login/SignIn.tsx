"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginService } from "@/services/AuthServices";
import { showAlert } from "@/utils/swalFire";
import GoogleButton from "@/ui/common/login/GoogleSignInButton";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/authSlice";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";
import Loader from "@/ui/common/loader/Loader";
import { useRouter } from "next/navigation";
import PasswordChecklist from "react-password-checklist";
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
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const password = useWatch({
        control,
        name: "password",
    });
    useEffect(() => {
        const rememberData = localStorage.getItem("rememberMe");
        if (rememberData) {
            const parsed = JSON.parse(rememberData);
            setValue("email", parsed.email);
            setValue("password", parsed.password);
            setRememberMe(true);
        }
    }, [setValue]);
    const onSubmit = async (formData: any) => {
        try {
            setLoading(true);
            const response = await loginService(formData);
            if (!response?.success) {
                return showAlert("error", response?.message || "Login failed", "Failed");
            }

            if (rememberMe) {
                localStorage.setItem("rememberMe", JSON.stringify({ email: formData.email, password: formData.password, })
                );
            } else {
                localStorage.removeItem("rememberMe");
            }
            localStorage.setItem("token", response.data.token);

            dispatch(
                login({ user: response.data.user, token: response.data.token, })
            );
            const role = response.data.user?.roletbl_roleName;
            switch (role) {
                case "SUPER_ADMIN":
                    router.push("/super-admin");
                    break;
                case "OPERATIONS_ADMIN":
                    router.push("/operations-admin");
                    break;
                case "FINANCE_ADMIN":
                    router.push("/finance-admin");
                    break;
                case "SUPPORT_ADMIN":
                    router.push("/support-admin");
                    break;
                case "RECRUITER":
                    router.push("/recruiter");
                    break;
                default:
                    router.push("/");
            }
        } catch (error: any) {
            showAlert(
                "error",
                error?.response?.data?.message || "Something went wrong!",
                "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-themebg">
            {loading && <Loader />}

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
                    Welcome to Staff Bridges!
                </h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* EMAIL */}
                    <div className="mb-3">
                        <label className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""
                                }`}
                            placeholder=""
                            {...register("email")}
                        />
                        {errors.email && (
                            <div className="invalid-feedback">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-3 position-relative">
                        <label className="form-label">
                            Password
                        </label>
                        <span className="eyeComponent">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.password ? "is-invalid" : ""
                                }`}
                            placeholder=""
                            {...register("password")}
                        />

                        <span
                            className="eyeicon"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? (
                                <MdOutlineRemoveRedEye />
                            ) : (
                                <FaRegEyeSlash />
                            )}
                        </span>
                        </span>

                        {errors.password && (
                            <div className="invalid-feedback">
                                {errors.password.message}
                            </div>
                        )}

                        {password && (
                            <div className="passwordValidation">
                                <PasswordChecklist
                                    rules={[
                                        "minLength",
                                        "lowercase",
                                        "capital",
                                        "number",
                                        "specialChar",
                                    ]}
                                    minLength={8}
                                    value={password}
                                    messages={{
                                        minLength:
                                            "Minimum 8 characters",
                                        lowercase:
                                            "One lowercase letter",
                                        capital:
                                            "One uppercase letter",
                                        number: "One number",
                                        specialChar:
                                            "One special character",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* REMEMBER ME */}
                    <div className="d-flex justify-content-between mb-3">
                        <div>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                            />
                            <label
                                htmlFor="remember"
                                className="ms-2"
                            >
                                Remember me
                            </label>
                        </div>

                        <Link
                            href="/forget-password"
                            className="themeBlue"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p>
                        Don’t have an account?{" "}
                        <Link
                            href="/signup"
                            className="themeBlue"
                        >
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
