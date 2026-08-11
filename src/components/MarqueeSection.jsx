"use client";

import { FaStar, FaGem, FaHeart } from "react-icons/fa";

export default function MarqueeSection() {
  return (
    <section className="bg-[#2b1d18] overflow-hidden border-y border-white/10">
      <div className="py-4 whitespace-nowrap animate-marquee flex items-center gap-10 text-white font-medium text-sm md:text-base">
        
        <span className="flex items-center gap-3">
          <FaStar className="text-yellow-400" />
          New Arrivals: Ceramic Blue Tile
        </span>

        <span className="flex items-center gap-3">
          <FaGem className="text-pink-300" />
          Weekly Feature: Modern Geometric Patterns
        </span>

        <span className="flex items-center gap-3">
          <FaHeart className="text-red-400" />
          Join the TilesGallery Community
        </span>

        <span className="flex items-center gap-3">
          <FaStar className="text-yellow-400" />
           Premium Marble Collections Available Now
        </span>

        <span className="flex items-center gap-3">
          <FaGem className="text-purple-400" />
           Elevate Your Interior With Luxury Tiles
        </span>

        <span className="flex items-center gap-3">
          <FaStar className="text-yellow-400" />
          New Arrivals: Ceramic Blue Tile
        </span>

        <span className="flex items-center gap-3">
          <FaGem className="text-pink-300" />
          Weekly Feature: Modern Geometric Patterns
        </span>

        <span className="flex items-center gap-3">
          <FaHeart className="text-red-400" />
          Join the TilesGallery Community
        </span>
      </div>
    </section>
  );
}