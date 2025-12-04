"use client";
import React from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div
        style={{  width: open ? 250 : 0,   transition: "width 0.3s",  overflow: "hidden", }}
      >
        <SideBar isOpen={open} />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        <TopBar
          toggleSideBar={() => { 
            setOpen(!open);
          }}
        />
        <div className="p-4 flex-grow-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
