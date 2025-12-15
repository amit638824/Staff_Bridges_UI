"use client"; 
import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const session = useSession();
  const router = useRouter(); 
  
  useEffect(() => { 
    if (session === null) {
      router.replace("/");
    }
  }, [session, router]);
 

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <SideBar isOpen={open} toggle={() => setOpen(!open)} />

      {/* Main */}
      <div className="flex-grow-1 d-flex flex-column">
        <TopBar />
        <div className="p-4 flex-grow-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
