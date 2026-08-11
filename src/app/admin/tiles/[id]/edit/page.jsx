"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditTilePage() {
  const router = useRouter();
  const params = useParams();
  const tileId = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "Ceramic",
    dimensions: "12x12 inch",
    material: "Ceramic",
    status: "AVAILABLE",
    inStock: true,
  });

  useEffect(() => {
    const fetchTile = async () => {
      try {
        const res = await apiClient.get(`/tiles/${tileId}`);
        const data = res.data;
        if (data) {
          setForm({
            title: data.title || "",
            description: data.description || "",
            price: data.price ? String(data.price) : "",
            image: data.image || "",
            category: data.category || "Ceramic",
            dimensions: data.dimensions || "12x12 inch",
            material: data.material || "Ceramic",
            status: data.status || "AVAILABLE",
            inStock: data.inStock !== false,
          });
        }
      } catch {
        toast.error("Failed to load tile details");
      } finally {
        setLoading(false);
      }
    };

    if (tileId) fetchTile();
  }, [tileId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
      };

      const res = await apiClient.put(`/tiles/${tileId}`, payload);

      if (res.success) {
        toast.success("Tile updated successfully");
        router.push("/admin/tiles");
      } else {
        toast.error(res.message || "Failed to update tile");
      }
    } catch {
      toast.error("An error occurred while updating tile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/tiles"
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Edit Tile</h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {tileId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Title Name
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition"
            >
              <option value="Ceramic">Ceramic</option>
              <option value="Marble">Marble</option>
              <option value="Porcelain">Porcelain</option>
              <option value="Stone">Stone</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Dimensions
            </label>
            <input
              type="text"
              name="dimensions"
              required
              value={form.dimensions}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Material
            </label>
            <input
              type="text"
              name="material"
              required
              value={form.material}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="DISCONTINUED">DISCONTINUED</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            required
            value={form.image}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Link
            href="/admin/tiles"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
          >
            <Save size={16} />
            {submitting ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
