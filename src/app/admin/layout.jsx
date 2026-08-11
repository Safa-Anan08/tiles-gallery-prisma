"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Grid,
  PlusSquare,
  Users,
  LogOut,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return <Loader />;
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const navItem = (href, label, Icon) => {
    const active = pathname === href || (href !== "/admin" && pathname?.startsWith(href));
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${active
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
        <div>

          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
            <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-rose-200">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base leading-tight">Admin Console</h2>
              <p className="text-xs text-slate-400 font-medium">Tiles Gallery System</p>
            </div>
          </div>


          <nav className="flex flex-col gap-1.5">
            {navItem("/admin", "Dashboard", LayoutDashboard)}
            {navItem("/admin/tiles", "Tile Catalog", Grid)}
            {navItem("/admin/tiles/new", "Add New Tile", PlusSquare)}
            {navItem("/admin/users", "User Management", Users)}
          </nav>
        </div>


        <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} />
            Back to Public Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition w-full text-left"
          >
            <LogOut size={16} />
            Logout Account
          </button>
        </div>
      </aside>


      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
