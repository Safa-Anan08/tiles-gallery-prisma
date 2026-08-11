
"use client";

import Link from "next/link";
import { FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useWishlist } from "@/wishlistButton/useWishlist";
import { useCartButton } from "@/cartButton/useCartButton";

export default function TileCard({ tile, session }) {
  const { isWishlisted, toggleWishlist } = useWishlist(tile, session);
  const { isCartAdded, toggleCart } = useCartButton(tile, session);

  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]">


      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={tile.image}
          alt={tile.title}
          className="h-56 w-full object-cover transition duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-70" />


        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-800 shadow-lg backdrop-blur-md">
            {tile.category}
          </span>
        </div>


        <Link
          href={`/tile/${tile.id}`}
          className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full border border-white/30 bg-white/90 text-slate-800 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 hover:bg-white"
          aria-label={`View ${tile.title}`}
        >
          <FaEye size={14} />
        </Link>
      </div>


      <div className="flex min-h-[310px] flex-col p-5">


        <div className="mb-2 flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-lg font-extrabold tracking-tight text-slate-900">
            {tile.title}
          </h2>

          <span className="shrink-0 text-lg font-black text-slate-950">
            ${tile.price}
          </span>
        </div>


        <p className="line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
          {tile.description}
        </p>


        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
          <span
            className={`h-1.5 w-1.5 rounded-full ${tile.inStock ? "bg-emerald-500" : "bg-red-400"
              }`}
          />

          <span className={tile.inStock ? "text-emerald-600" : "text-red-500"}>
            {tile.inStock ? "In Stock" : "Out of Stock"}
          </span>

          <span className="mx-1 text-slate-200">•</span>

          <span>{tile.material || "Premium Material"}</span>
        </div>


        <div className="mt-auto pt-5">


          <Link
            href={`/tile/${tile.id}`}
            className="group/view flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white hover:shadow-lg"
          >
            <FaEye
              size={13}
              className="transition-transform duration-300 group-hover/view:scale-110"
            />
            View Details
          </Link>


          <div className="mt-3 grid grid-cols-2 gap-3">


            <button
              onClick={toggleWishlist}
              className={`group/wishlist flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-all duration-300 ${isWishlisted
                ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800"
                : "border-rose-100 bg-rose-50 text-rose-600 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-100 hover:shadow-md"
                }`}
            >
              <FaHeart
                size={14}
                className={`transition-transform duration-300 group-hover/wishlist:scale-110 ${isWishlisted ? "text-rose-400" : ""
                  }`}
              />

              <span className="hidden sm:inline">
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </span>

              <span className="sm:hidden">
                {isWishlisted ? "Saved" : "Save"}
              </span>
            </button>


            <button
              onClick={toggleCart}
              className={`group/cart flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-300 ${isCartAdded
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800"
                : "bg-slate-950 text-white shadow-lg shadow-slate-950/10 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
                }`}
            >
              <FaShoppingCart
                size={14}
                className="transition-transform duration-300 group-hover/cart:scale-110"
              />

              <span className="hidden sm:inline">
                {isCartAdded ? "In Cart" : "Add to Cart"}
              </span>

              <span className="sm:hidden">
                {isCartAdded ? "Added" : "Cart"}
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

