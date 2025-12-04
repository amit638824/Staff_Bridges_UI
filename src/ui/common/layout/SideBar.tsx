import React from "react";
import { FaHome, FaBriefcase, FaEllipsisH, FaUser } from "react-icons/fa";

export default function SideBar({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`bg-white border-end vh-100 p-3 position-relative ${
        isOpen ? "d-block" : "d-none d-md-block"
      }`}
      style={{ width: "250px" }}
    >
      <div className="d-flex align-items-center mb-4 gap-2"> 
        <h5 className="m-0 fw-bold">STAFF BRIDGES</h5>
      </div>

      <ul className="list-unstyled">
        <li className="mb-3 d-flex align-items-center gap-2">
          <FaHome /> Home
        </li>
        <li className="mb-3 d-flex align-items-center gap-2">
          <FaBriefcase /> Jobs
        </li>
        <li className="mb-3 d-flex align-items-center gap-2">
          <FaEllipsisH /> More
        </li>
      </ul>

      <div className="position-absolute bottom-0 mb-3 d-flex align-items-center gap-2">
        <FaUser /> TECHWAGGER
      </div>
    </div>
  );
}
