"use client";

import { useEffect, useState } from "react";
import TileCard from "@/components/TileCard";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api-client";

export default function FeaturedTiles() {
  const [tiles, setTiles] = useState([]);
  const { user } = useAuth();
  const session = user ? { email: user.email } : null;

  useEffect(() => {
    apiClient
      .get("/tiles")
      .then((res) => {
        const data = res.data || [];
        setTiles(Array.isArray(data) ? data : []);
      })
      .catch(() => setTiles([]));
  }, []);

  const featured = tiles.slice(0, 3);

  return (
    <section className="py-20 px-6 bg-[#f7f4ef]">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">Featured Tiles</h2>
        <p className="text-gray-500 mt-2">Discover our most popular designs</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {featured.map((tile) => (
          <TileCard key={tile._id || tile.id} tile={tile} session={session} />
        ))}
      </div>
    </section>
  );
}