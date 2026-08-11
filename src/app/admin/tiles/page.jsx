"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import Loader from "@/components/Loader";
import Link from "next/link";
import { toast } from "sonner";
import { Search, PlusSquare, Edit, Trash2 } from "lucide-react";

export default function AdminTilesPage() {
  const [tiles, setTiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadTiles = async () => {
      try {
        const res = await apiClient.get("/tiles");
        if (isMounted) setTiles(res.data || []);
      } catch {
        if (isMounted) toast.error("Failed to fetch tiles catalog");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTiles();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to soft-delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await apiClient.delete(`/tiles/${id}`);
      if (res.success) {
        toast.success(`Tile "${title}" soft-deleted successfully`);
        setTiles((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast.error(res.message || "Failed to delete tile");
      }
    } catch {
      toast.error("Error executing soft delete");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTiles = tiles.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;


  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">

      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
        <div className="flex flex-col gap-4">

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Tile Catalog Management
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage, update, and soft-delete tiles in PostgreSQL catalog
            </p>
          </div>


          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search tiles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100 transition"
              />
            </div>


            <Link
              href="/admin/tiles/new"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition"
            >
              <PlusSquare size={16} />
              Add Tile
            </Link>
          </div>
        </div>
      </div>


      <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">ID & Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTiles.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-slate-400 font-medium"
                  >
                    No tiles found matching your search query.
                  </td>
                </tr>
              ) : (
                filteredTiles.map((tile) => (
                  <tr
                    key={tile.id}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="py-4 px-6">
                      <img
                        src={tile.image}
                        alt={tile.title}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                      />
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">
                        {tile.title}
                      </div>

                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {tile.id}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600 font-semibold">
                      {tile.category}
                    </td>

                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      ${tile.price}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full border border-emerald-300">
                        {tile.status || "AVAILABLE"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/tiles/${tile.id}/edit`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(tile.id, tile.title)
                          }
                          disabled={deletingId === tile.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition border border-rose-200 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          {deletingId === tile.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      <div className="md:hidden space-y-4">
        {filteredTiles.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-400">
            No tiles found matching your search query.
          </div>
        ) : (
          filteredTiles.map((tile) => (
            <div
              key={tile.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
            >

              <div className="flex items-start gap-4">
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                    {tile.title}
                  </h3>

                  <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-1 break-all">
                    {tile.id}
                  </p>

                  <span className="inline-block mt-2 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded-full border border-emerald-300">
                    {tile.status || "AVAILABLE"}
                  </span>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Category
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                    {tile.category}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Price
                  </p>

                  <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                    ${tile.price}
                  </p>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  href={`/admin/tiles/${tile.id}/edit`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                >
                  <Edit size={14} />
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(tile.id, tile.title)}
                  disabled={deletingId === tile.id}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition border border-rose-200 disabled:opacity-50"
                >
                  <Trash2 size={14} />

                  {deletingId === tile.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );


}
