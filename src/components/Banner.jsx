"use client";

import Link from "next/link";
import { FaArrowRight, FaLeaf, FaStar, FaHeart } from "react-icons/fa";

export default function Banner() {
  return (
    <section className="bg-[#f7f4ef]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">

        <div className="grid lg:grid-cols-2 items-center rounded-[30px] bg-[#eef2e2] overflow-hidden">

          <div className="px-8 lg:px-16 py-16">
            <p className="text-2xl italic text-[#7a9b6c] mb-3">
              discover your perfect
            </p>

            <h1 className="text-6xl font-light uppercase">
              Aesthetic
            </h1>

            <p className="mt-6 text-gray-600">
              Premium tiles for modern interiors.
            </p>

            <Link
              href="/all-tiles"
              className="group mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-black via-gray-900 to-black text-white font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out hover:scale-[1.03]">
              Browse Now

              <FaArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <img
            src="https://images.unsplash.com/photo-1600566752355-35792bedcfea"
            className="h-[400px] w-full object-cover"
          />
        </div>

      </div>


      <div className="bg-base-200 py-10 px-4 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full">

          <div className="flex items-start gap-3 bg-base-100 p-4 rounded-xl">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg text-base">
              <FaLeaf />
            </div>
            <div>
              <h2 className="text-base font-semibold">Premium Quality</h2>
              <p className="text-sm text-gray-500 mt-1 leading-snug">
                Crafted with durable materials and luxury ceramic finishes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-base-100 p-4 rounded-xl">
            <div className="bg-gray-100 text-yellow-400 p-2 rounded-lg text-base">
              <FaStar />
            </div>
            <div>
              <h2 className="text-base font-semibold">Modern Designs</h2>
              <p className="text-sm text-gray-500 mt-1 leading-snug">
                Explore geometric, minimalist, and elegant tile aesthetics.
              </p>
            </div>
          </div>


          <div className="flex items-start gap-3 bg-base-100 p-4 rounded-xl">
            <div className="bg-gray-100 text-red-500 p-2 rounded-lg text-base">
              <FaHeart />
            </div>
            <div>
              <h2 className="text-base font-semibold">Customer Favorite</h2>
              <p className="text-sm text-gray-500 mt-1 leading-snug">
                Loved by interior designers and homeowners worldwide.
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}