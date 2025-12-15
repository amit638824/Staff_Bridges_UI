"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { logout } from "@/redux/slice/authSlice";
import { useDispatch } from "react-redux";
 
export default function TopBar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
const dispatch=useDispatch()
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); 
  const handleLogout = () => { 
    localStorage.removeItem('token');
    dispatch( logout( ) ); 
    router.push("/");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between px-3 border-bottom bg-white"
      style={{
        height: "50px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        position: "relative",
        zIndex: 20,
      }}
    >
      <div className="position-relative ms-auto" ref={dropdownRef}>

        <img
          src="https://i.pravatar.cc/40?img=12"
          alt="profile"
          width={38}
          height={38}
          onClick={() => setOpenDropdown(!openDropdown)}
          style={{
            borderRadius: "50%",
            cursor: "pointer",
            objectFit: "cover",
          }}
        />

        {/* Dropdown */}
        {openDropdown && (
          <div
            className="bg-white shadow position-absolute end-0 mt-2 p-3 rounded"
            style={{ width: "260px", top: "45px" }}
          >
            <h6 className="fw-bold m-0">Amit Singh</h6>
            <p className="text-muted small mb-3">amit.chauhan@techwagger.com</p>

            <div className="d-flex align-items-center gap-2 mb-3" style={{ cursor: "pointer" }}>
              <FaUser size={16} />
              <span>Profile</span>
            </div>

            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
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
 

