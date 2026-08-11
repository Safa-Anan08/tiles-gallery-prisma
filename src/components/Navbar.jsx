"use client";

import Link from "next/link";
import { Menu, X, ShoppingCart, ShieldAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: isPending, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const navLink = (href, label) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`relative px-3 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 ${pathname === href || pathname?.startsWith(href + "/")
          ? "text-neutral-950 font-semibold"
          : "text-neutral-500 hover:text-neutral-950"
        }`}
    >
      {label}

      {(pathname === href || (href !== "/" && pathname?.startsWith(href + "/"))) && (
        <span className="absolute left-3 right-3 -bottom-1 h-[1.5px] rounded-full bg-neutral-950" />
      )}
    </Link>
  );

  useEffect(() => {
    const load = async () => {
      const email = user?.email;

      if (!email) {
        setCartCount(0);
        return;
      }

      try {
        const res = await apiClient.get(`/cart?email=${email}`);
        const data = res.data || [];
        setCartCount(Array.isArray(data) ? data.length : 0);
      } catch {
        setCartCount(0);
      }
    };

    load();

    const handler = () => load();

    window.addEventListener("cart-updated", handler);

    return () => {
      window.removeEventListener("cart-updated", handler);
    };
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-950 hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? (
              <X size={19} strokeWidth={1.8} />
            ) : (
              <Menu size={19} strokeWidth={1.8} />
            )}
          </button>

          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-semibold tracking-widest text-white transition-transform duration-300 group-hover:rotate-6">
              TG
            </span>

            <div className="leading-none">
              <div className="text-[16px] font-semibold tracking-[0.18em] text-neutral-950">
                TILES
              </div>
              <div className="mt-1 text-[8px] font-medium tracking-[0.42em] text-neutral-400">
                GALLERY
              </div>
            </div>
          </Link>
        </div>


        <div className="hidden items-center gap-2 lg:flex">
          {navLink("/", "Home")}
          {navLink("/all-tiles", "All Tiles")}
          {navLink("/my-profile", "Profile")}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="ml-2 flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1.5 text-[12px] font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
            >
              <ShieldAlert size={14} />
              Admin Dashboard
            </Link>
          )}
        </div>


        <div className="flex items-center gap-3 sm:gap-5">

          <Link
            href={user ? "/cart" : "/login?redirect=/cart"}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-all duration-300 hover:border-neutral-200 hover:bg-neutral-50"
            aria-label="Shopping cart"
          >
            <ShoppingCart
              size={20}
              strokeWidth={1.7}
              className="text-neutral-800 transition-transform duration-300 group-hover:-translate-y-0.5"
            />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-neutral-950 px-1 text-[9px] font-semibold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>


          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          ) : user ? (
            <button
              onClick={handleLogout}
              className="hidden rounded-full border border-neutral-900 bg-neutral-950 px-5 py-2 text-[11px] font-medium tracking-[0.12em] text-white transition-all duration-300 hover:bg-white hover:text-neutral-950 sm:block"
            >
              LOGOUT
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border border-neutral-900 bg-neutral-950 px-5 py-2 text-[11px] font-medium tracking-[0.12em] text-white transition-all duration-300 hover:bg-white hover:text-neutral-950 sm:block"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>


      <div
        className={`overflow-hidden border-t border-neutral-100 bg-white transition-all duration-300 lg:hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-1">
            {navLink("/", "Home")}
            {navLink("/all-tiles", "All Tiles")}
            {navLink("/my-profile", "Profile")}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200"
              >
                <ShieldAlert size={16} />
                Admin Dashboard
              </Link>
            )}
          </div>

          {!isPending && (
            <div className="mt-4 border-t border-neutral-100 pt-4">
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-full bg-neutral-950 px-5 py-3 text-[11px] font-medium tracking-[0.15em] text-white transition hover:bg-neutral-800"
                >
                  LOGOUT
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-full bg-neutral-950 px-5 py-3 text-center text-[11px] font-medium tracking-[0.15em] text-white transition hover:bg-neutral-800"
                >
                  LOGIN
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
