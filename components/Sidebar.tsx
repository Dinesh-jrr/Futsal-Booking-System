"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarRange,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", adminhref: "/admin", onlyAdmin: false },
  { name: "Users", icon: Users, href: "/dashboard/users", adminhref: "/admin/users", onlyAdmin: true },
  { name: "Futsals", icon: Dumbbell, href: "/dashboard/futsals", adminhref: "/admin/futsals", onlyAdmin: true },
  { name: "Bookings", icon: CalendarRange, href: "/dashboard/bookings", adminhref: "/admin/bookings", onlyAdmin: false },
  { name: "Payments", icon: CreditCard, href: "/dashboard/payments", adminhref: "/admin/payments", onlyAdmin: false },
  { name: "Settings", icon: Settings, href: "/dashboard/settings", adminhref: "/admin/settings", onlyAdmin: false },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data } = useSession();
  const pathname = usePathname();

  // @ts-ignore
  const userisAdmin = data ? data?.user?.role === "admin" : false;

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={cn(
        "h-full w-64 bg-white shadow-lg transition-all duration-300 ease-in-out rounded-l-xl flex flex-col border-r",
        "shadow-[8px_0_15px_0_rgba(0,0,0,0.2),8px_0_15px_0_theme(colors.primary)]",
        isCollapsed && "w-16"
      )}
    >
      <div className="flex h-[88px] items-center justify-center border-b border-gray-200 px-4 rounded-tl-xl shadow-md">
        <span className={cn("text-2xl font-bold transition-all duration-300 text-primary", isCollapsed && "hidden")}>
          <img className="h-12 w-12 object-contain rounded-xl" src="/assets/logo.png" alt="logo" />
        </span>
      </div>

      <div className="flex flex-col flex-1 justify-between py-4">
        <div className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const itemHref = userisAdmin ? item.adminhref : item.href;
            const isActive = pathname === itemHref;

            return (
              (!item.onlyAdmin || userisAdmin) && (
                <Link
                  key={item.name}
                  href={itemHref}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 transition-colors",
                    !isCollapsed && "mx-2 rounded-lg",
                    isActive
                      ? "bg-primary text-white"
                      : "text-black hover:bg-primary hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn("transition-all duration-300", isCollapsed && "hidden")}>
                    {item.name}
                  </span>
                </Link>
              )
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-2 text-black hover:bg-primary hover:text-white transition-colors",
            !isCollapsed && "mx-2 rounded-lg"
          )}
        >
          <LogOut className="h-5 w-5" />
          <span className={cn("transition-all duration-300", isCollapsed && "hidden")}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
