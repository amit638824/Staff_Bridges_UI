import React from "react";
import {
  FaHome,
  FaBriefcase,
  FaEllipsisH,
  FaUser,
} from "react-icons/fa";

import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";

export default function SideBar({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <div
      className="   vh-100 position-relative"
      style={{
        width: isOpen ? 260 : 80,
        transition: "0.3s",
      }}
    >
      {/* ChatGPT Style Toggle Button */}
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
        <img
          src="/logo.svg"
          width={30}
          alt=""
          className="me-2"
        />
        {isOpen && <h5 className="m-0">STAFF BRIDGES</h5>}
      </div>

      {/* Menu */}
      <ul className="list-unstyled mt-4 px-3">
        <li className="mb-3 d-flex align-items-center gap-3">
          <FaHome size={18} /> {isOpen && <span>Home</span>}
        </li>
        <li className="mb-3 d-flex align-items-center gap-3">
          <FaBriefcase size={18} /> {isOpen && <span>Jobs</span>}
        </li>
        <li className="mb-3 d-flex align-items-center gap-3">
          <FaEllipsisH size={18} /> {isOpen && <span>More</span>}
        </li>
      </ul>

      {/* User Bottom */}
      <div className="position-absolute bottom-0 mb-4 px-3 d-flex align-items-center gap-3">
        <FaUser size={18} /> {isOpen && <span>TECHWAGGER</span>}
      </div>
    </div>
  );
}
