
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api-client";
import {
  FaHeart,
  FaShoppingCart,
  FaArrowLeft,
  FaCheck,
  FaRulerCombined,
  FaLayerGroup,
} from "react-icons/fa";
import Link from "next/link";
import { useWishlist } from "@/wishlistButton/useWishlist";
import { useCartButton } from "@/cartButton/useCartButton";
import Loader from "@/components/Loader";

export default function TileDetails() {
  const params = useParams();
  const id = params?.id;

  const [tile, setTile] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const session = user ? { email: user.email } : null;


  useEffect(() => {
    const loadTile = async () => {
      try {
        const res = await apiClient.get(`/tiles/${id}`);
        setTile(res.data || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadTile();
  }, [id]);

  const {
    isWishlisted,
    toggleWishlist,
    loading: wishLoading,
  } = useWishlist(tile, session);

  const {
    isCartAdded,
    toggleCart,
  } = useCartButton(tile, session);

  if (loading) return <Loader />;

  if (!tile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl">
            <FaLayerGroup size={24} />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Tile not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The product you are looking for may no longer be available.
          </p>

          <Link
            href="/all-tiles"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <FaArrowLeft size={12} />
            Browse All Tiles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">


      <div className="mx-auto mb-6 max-w-7xl">
        <Link
          href="/all-tiles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
        >
          <FaArrowLeft size={11} />
          Back to Collection
        </Link>
      </div>


      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

        <div className="grid lg:grid-cols-2">


          <div className="relative min-h-[420px] overflow-hidden bg-slate-100 lg:min-h-[650px]">

            <img
              src={tile.image}
              alt={tile.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
            />


            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/10" />


            <div className="absolute left-6 top-6">
              <span className="rounded-full border border-white/30 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-800 shadow-xl backdrop-blur-md">
                {tile.category}
              </span>
            </div>


            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between gap-4">

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Premium Collection
                  </p>

                  <h1 className="max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {tile.title}
                  </h1>
                </div>

                <div className="hidden rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-right text-white backdrop-blur-xl sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                    Product ID
                  </p>
                  <p className="mt-1 text-xs font-bold">
                    {tile.id}
                  </p>
                </div>

              </div>
            </div>
          </div>


          <div className="flex flex-col p-6 sm:p-8 lg:p-12">


            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Tile Details
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {tile.title}
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-slate-500">
                {tile.description}
              </p>
            </div>


            <div className="mt-8 flex items-end justify-between border-b border-slate-200 pb-7">

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Price
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight text-slate-950">
                    ${tile.price}
                  </span>

                  <span className="text-sm font-semibold text-slate-400">
                    {tile.currency}
                  </span>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${tile.inStock
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
                  }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${tile.inStock ? "bg-emerald-500" : "bg-red-500"
                    }`}
                />

                {tile.inStock ? "In Stock" : "Out of Stock"}
              </div>

            </div>


            <div className="mt-7">

              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">
                Specifications
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FaLayerGroup size={13} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Material
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {tile.material}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FaRulerCombined size={13} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Dimensions
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {tile.dimensions}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {tile.category}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Availability
                  </p>

                  <p
                    className={`mt-2 text-sm font-bold ${tile.inStock
                      ? "text-emerald-600"
                      : "text-red-500"
                      }`}
                  >
                    {tile.inStock ? "Available Now" : "Currently Unavailable"}
                  </p>
                </div>

              </div>
            </div>



            <div className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                <button
                  onClick={toggleWishlist}
                  disabled={wishLoading}
                  className={`
        flex-1 flex items-center justify-center gap-2
        px-6 py-3.5 rounded-xl
        font-semibold text-sm sm:text-base
        shadow-md hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-0.5 active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
        ${isWishlisted
                      ? "bg-gray-800 text-white hover:bg-gray-900"
                      : "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-500 hover:from-rose-200 hover:to-pink-200"
                    }
      `}
                >
                  <FaHeart className="text-base" />
                  <span>
                    {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  </span>
                </button>


                <button
                  onClick={toggleCart}
                  className={`
        flex-1 flex items-center justify-center gap-2
        px-6 py-3.5 rounded-xl
        font-semibold text-sm sm:text-base
        shadow-md hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-0.5 active:scale-[0.98]
        ${isCartAdded
                      ? "bg-gray-800 text-white hover:bg-gray-900"
                      : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-500 hover:from-blue-200 hover:to-indigo-200"
                    }
      `}
                >
                  <FaShoppingCart className="text-base" />
                  <span>
                    {isCartAdded ? "Remove from Cart" : "Add to Cart"}
                  </span>
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}

