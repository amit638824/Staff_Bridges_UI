"use client";

import React from "react";
import Link from "next/link";
import { FaHome, FaBriefcase, FaEllipsisH, FaUser } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
import { TbLayoutSidebarRightExpand, TbLayoutSidebarRightCollapse } from "react-icons/tb";

const menuItems = [
  { icon: <FaHome size={18} />, label: "Home", path: "/recruiter" },
  { icon: <FaBriefcase size={18} />, label: "Jobs", path: "/recruiter/job" },
  { icon: <FaDatabase size={18} />, label: "Database", path: "/recruiter/database" },
  { icon: <FaEllipsisH size={18} />, label: "More", path: "#" },
];

export default function SideBar({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <div
      className="vh-100 position-relative bg-light"
      style={{
        width: isOpen ? 260 : 80,
        transition: "0.3s",
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="position-absolute top-0 end-0 mt-3 me-3 d-flex align-items-center justify-content-center border rounded"
        style={{
          width: 35,
          height: 25,
          background: "transparent",
          borderColor: "#a79393ff",
          cursor: "pointer",
        }}
      >
        {isOpen ? (
          <TbLayoutSidebarRightCollapse size={18} color="#bbb" />
        ) : (
          <TbLayoutSidebarRightExpand size={18} color="#bbb" />
        )}
      </button>

      {/* Logo */}
      <div className="d-flex align-items-center gap-2 mt-4 px-3">
        <img src="/logo.svg" width={30} alt="" className="me-2" />
        {isOpen && <h5 className="m-0">STAFF BRIDGES</h5>}
      </div>

      {/* Menu */}
      <ul className="list-unstyled mt-4 px-3">
        {menuItems.map((item, index) => (
          <li key={index} className="mb-3">
            <Link
              href={item.path}
              className="d-flex align-items-center gap-3 text-decoration-none text-dark"
            >
              {item.icon} {isOpen && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Bottom */}
      <div className="position-absolute bottom-0 mb-4 px-3 d-flex align-items-center gap-3">
        <FaUser size={18} /> {isOpen && <span>TECHWAGGER</span>}
      </div>
    </div>
  );
}
