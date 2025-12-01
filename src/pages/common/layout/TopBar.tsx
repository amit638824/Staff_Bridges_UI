import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

export default function TopBar({ toggleSideBar }: { toggleSideBar: () => void }) {
  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-3 py-2 d-flex justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <RxHamburgerMenu
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          onClick={toggleSideBar}
        />
        <h5 className="m-0">Welcome back, Vivek!</h5>
      </div>
      <button className="btn btn-primary btn-sm">Post a Job</button>
    </nav>
  );
}
