"use client";
import React from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <SideBar isOpen={open} toggle={() => setOpen(!open)} /> 
      {/* Main */}
      <div className="flex-grow-1 d-flex flex-column">
        <TopBar   />
        <div className="p-4 flex-grow-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
