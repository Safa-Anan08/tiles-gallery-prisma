"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Grid, Users, Layers, Star, PlusSquare, Shield, ArrowRight } from "lucide-react";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalTiles: 0,
    activeTiles: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalReviews: 0,
  });
  const [recentTiles, setRecentTiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tilesRes, usersRes, categoriesRes, reviewsRes] = await Promise.all([
          apiClient.get("/tiles").catch(() => ({ data: [] })),
          apiClient.get("/users").catch(() => ({ data: [] })),
          apiClient.get("/categories").catch(() => ({ data: [] })),
          apiClient.get("/reviews").catch(() => ({ data: [] })),
        ]);

        const tiles = tilesRes.data || [];
        const users = usersRes.data || [];
        const categories = categoriesRes.data || [];
        const reviews = reviewsRes.data || [];

        setStats({
          totalTiles: tiles.length,
          activeTiles: tiles.filter((t) => !t.isDeleted && t.inStock !== false).length,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalCategories: categories.length,
          totalReviews: reviews.length,
        });

        setRecentTiles(tiles.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;


  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-8 px-3 sm:px-4 lg:px-0">


      <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-center">

          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
              <Shield size={13} />
              System Administrator
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Admin Overview Dashboard
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Manage catalog tiles, view registered accounts, inspect categories,
              and perform administrative operations.
            </p>
          </div>

          <Link
            href="/admin/tiles/new"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 sm:px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-rose-900/40 transition"
          >
            <PlusSquare size={17} />
            Create New Tile
          </Link>

        </div>
      </div>



      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">


        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">

            <div className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Grid size={22} className="sm:hidden" />
              <Grid size={28} className="hidden sm:block" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Tiles
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {stats.totalTiles}
              </h2>

              <p className="text-[9px] sm:text-xs text-emerald-600 font-semibold mt-1">
                {stats.activeTiles} Active
              </p>
            </div>

          </div>
        </div>



        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">

            <div className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users size={22} className="sm:hidden" />
              <Users size={28} className="hidden sm:block" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Users
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {stats.totalUsers}
              </h2>

              <p className="text-[9px] sm:text-xs text-slate-500 font-medium mt-1">
                Registered
              </p>
            </div>

          </div>
        </div>



        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">

            <div className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers size={22} className="sm:hidden" />
              <Layers size={28} className="hidden sm:block" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                Categories
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {stats.totalCategories}
              </h2>

              <p className="text-[9px] sm:text-xs text-slate-500 font-medium mt-1">
                Collections
              </p>
            </div>

          </div>
        </div>



        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">

            <div className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Star size={22} className="sm:hidden" />
              <Star size={28} className="hidden sm:block" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                Reviews
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {stats.totalReviews}
              </h2>

              <p className="text-[9px] sm:text-xs text-slate-500 font-medium mt-1">
                Feedback
              </p>
            </div>

          </div>
        </div>

      </div>



      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">

          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Recent Tile Catalog Additions
            </h3>

            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
              Latest tiles registered in PostgreSQL database
            </p>
          </div>

          <Link
            href="/admin/tiles"
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-900 hover:text-rose-600 transition self-start sm:self-auto"
          >
            Manage All Tiles
            <ArrowRight size={14} />
          </Link>

        </div>



        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Tile</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {recentTiles.map((tile) => (
                <tr
                  key={tile.id}
                  className="hover:bg-slate-50/80 transition"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 font-semibold text-slate-900">
                      <img
                        src={tile.image}
                        alt={tile.title}
                        className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <span>{tile.title}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {tile.category}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    ${tile.price}
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                      {tile.status || "AVAILABLE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>



        <div className="md:hidden space-y-3">

          {recentTiles.map((tile) => (
            <div
              key={tile.id}
              className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50"
            >

              <div className="flex items-center gap-3">

                <img
                  src={tile.image}
                  alt={tile.title}
                  className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {tile.title}
                  </h4>

                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {tile.category}
                  </p>
                </div>

                <span className="shrink-0 px-2 py-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                  {tile.status || "AVAILABLE"}
                </span>

              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">

                <span className="text-[10px] font-medium text-slate-400">
                  Price
                </span>

                <span className="text-sm font-black text-slate-900">
                  ${tile.price}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );


}
