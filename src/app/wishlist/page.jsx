"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { FaHeart } from "react-icons/fa";
import Loader from "@/components/Loader";
import apiClient from "@/lib/api-client";
import Link from "next/link";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (authLoading) return;

      if (!user?.email) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      const res = await apiClient.get(`/wishlist?email=${user.email}`);
      const data = res.data || [];
      setWishlist(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    loadWishlist();
  }, [user, authLoading]);

  const handleRemove = async (tileId, userEmail) => {
    const res = await apiClient.delete("/wishlist", { tileId, userEmail });

    if (res.success) {
      setWishlist((prev) => prev.filter((item) => item.tileId !== tileId));
      toast.success("Removed from wishlist");
    } else {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="flex items-center gap-3 text-3xl font-bold mb-8 text-rose-600">
          My Wishlist <FaHeart />
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-gray-500 font-medium text-lg">Your wishlist is empty</p>
            <Link
              href="/all-tiles"
              className="mt-4 inline-block px-6 py-3 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition"
            >
              Explore Tiles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id || item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />

                <div className="p-4 flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {item.category}
                  </span>
                  <h2 className="font-bold text-base text-slate-900 line-clamp-1">{item.title}</h2>
                  <p className="text-sm font-black text-slate-950 mt-2">${item.price}</p>

                  <div className="mt-auto pt-4 flex gap-2">
                    <Link
                      href={`/tile/${item.tileId}`}
                      className="flex-1 py-2 text-center text-xs font-bold bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(item.tileId, item.userEmail || user?.email)}
                      className="px-3 py-2 text-xs font-bold border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
