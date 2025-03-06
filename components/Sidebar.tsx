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
  LogOut
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Users", icon: Users, href: "/users" },
  { name: "Futsal", icon: Dumbbell, href: "/futsal" },
  { name: "Bookings", icon: CalendarRange, href: "/bookings" },
  { name: "Payments", icon: CreditCard, href: "/payments" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-full w-64 bg-white shadow-lg transition-all duration-300 ease-in-out rounded-l-xl flex flex-col border-r",
        "shadow-[8px_0_15px_0_rgba(0,0,0,0.2),8px_0_15px_0_theme(colors.primary)]", // Right-side shadow with primary color
        isCollapsed && "w-16"
      )}
    >
      <div className="flex h-[88px] items-center justify-center border-b border-gray-200 px-4 rounded-tl-xl shadow-md">
        <span
          className={cn(
            "text-2xl font-bold transition-all duration-300 text-primary",
            isCollapsed && "hidden"
          )}
        >
          <img
            className="h-12 w-12 object-contain rounded-xl"
            src="/assets/logo.png"
            alt="logo"
          />
        </span>
      </div>

      <div className="flex flex-col flex-1 justify-between py-4">
        <div className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-black hover:bg-primary hover:text-white transition-colors",
                !isCollapsed && "mx-2 rounded-lg"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span
                className={cn(
                  "transition-all duration-300",
                  isCollapsed && "hidden"
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <button
          className={cn(
            "flex items-center gap-3 px-4 py-2 text-black hover:bg-primary hover:text-white transition-colors",
            !isCollapsed && "mx-2 rounded-lg"
          )}
        >
          <LogOut className="h-5 w-5" />
          <span
            className={cn(
              "transition-all duration-300",
              isCollapsed && "hidden"
            )}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
