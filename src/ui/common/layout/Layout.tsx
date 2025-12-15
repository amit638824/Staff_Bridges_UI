"use client";

import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { useSession } from "@/hooks/useSession";
import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 🔴 Not logged in → login page
    if (!session?.isLoggedIn) {
      router.replace("/");
      return;
    }

    // 🔒 Logged in but trying to escape layout
    const role = session.user?.roletbl_roleName;

    const ROLE_HOME: Record<string, string> = {
      SUPER_ADMIN: "/super-admin",
      OPERATIONS_ADMIN: "/operations-admin",
      FINANCE_ADMIN: "/finance-admin",
      SUPPORT_ADMIN: "/support-admin",
      RECRUITER: "/recruiter",
    };

    const home = ROLE_HOME[role];

    // ❌ URL manually changed → force back
    if (home && !pathname.startsWith(home)) {
      router.replace(home);
    }
  }, [session, pathname, router]);

  // ⏳ Session loading protection
  if (!session) return null;

  return (
    <div className="d-flex vh-100">
      <SideBar isOpen={open} toggle={() => setOpen(!open)} />

      <div className="flex-grow-1 d-flex flex-column">
        <TopBar />
        <div className="p-4 flex-grow-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
