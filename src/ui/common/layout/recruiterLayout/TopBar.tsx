"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { logout } from "@/redux/slice/authSlice";
import {
  setUserDetails,
  clearUserDetails,
} from "@/redux/slice/userDetailSlice";

import { userDetailService } from "@/services/AuthServices";
import { useSession, useUser } from "@/hooks/useSession";

export default function TopBar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const session = useSession();
  const user = useUser();

  /* ===============================
     FETCH USER DETAIL (API CALL)
  ================================ */
  useEffect(() => {
    if (!session?.user?.user_id) return;

    const fetchUserDetail = async () => {
      try {
        const res = await userDetailService(session.user.user_id);
        dispatch(setUserDetails(res?.data));
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUserDetail();
  }, [session?.user?.user_id, dispatch]);

  /* ===============================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  ================================ */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===============================
     LOGOUT HANDLER
  ================================ */
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    dispatch(clearUserDetails());
    router.replace("/");
  };

  return (
    <div className="d-flex align-items-center justify-content-end px-3 topBar-area">
      <div className="position-relative" ref={dropdownRef}>
        <img
          src={
            user?.user_profilePic ||
            "https://i.pravatar.cc/40?img=12"
          }
          alt="profile"
          width={38}
          height={38}
          onClick={() => setOpenDropdown((prev) => !prev)}
          style={{ borderRadius: "50%", cursor: "pointer" }}
        />

        {openDropdown && (
          <div
            className="bg-white shadow position-absolute end-0 mt-2 p-3 rounded"
            style={{ width: "260px", zIndex: 1000 }}
          >
            <h6 className="fw-bold mb-0">
              {user?.user_fullName || "Guest User"}
            </h6>
            <p className="text-muted small mb-3">
              {user?.user_email || ""}
            </p>

            <div className="d-flex align-items-center gap-2 mb-3 cursor-pointer">
              <FaUser size={16} />
              <span>Profile</span>
            </div>

            <div
              className="d-flex align-items-center gap-2 cursor-pointer"
              onClick={handleLogout}
            >
              <FaSignOutAlt size={16} />
              <span>Log Out</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
