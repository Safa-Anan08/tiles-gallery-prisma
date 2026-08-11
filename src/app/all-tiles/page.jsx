"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import TileCard from "@/components/TileCard";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api-client";
import Loader from "@/components/Loader";

import "swiper/css";

export default function AllTilesPage() {
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [visible, setVisible] = useState(8);

  const { user } = useAuth();
  const session = user ? { email: user.email } : null;


  useEffect(() => {
    apiClient.get("/tiles").then((res) => {
      const data = res.data || [];
      setTiles(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);


  const filteredTiles = tiles
    .filter((t) => category === "all" || t.category === category)
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

  const visibleTiles = filteredTiles.slice(0, visible);

 if (loading) return <Loader />;

  return (
    <section className="bg-gray-100 min-h-screen">

      <div className="relative">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop
          className="h-[420px]"
        >
          <SwiperSlide>
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6"
              className="w-full h-[420px] object-cover"
            />
          </SwiperSlide>
        </Swiper>

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1 className="text-4xl font-bold text-white mb-4">
            Explore Premium Tiles
          </h1>

          <input
            type="text"
            placeholder="Search tiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl px-5 py-4 rounded-full bg-white text-black"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-end">
        <select
          className="p-2 border rounded"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="ceramic">Ceramic</option>
          <option value="marble">Marble</option>
          <option value="porcelain">Porcelain</option>
          <option value="stone">Stone</option>
        </select>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleTiles.map((tile) => (
          <TileCard
            key={tile._id || tile.id}
            tile={tile}
            session={session}
          />
        ))}
      </div>

      {visible < filteredTiles.length && (
        <div className="text-center py-10">
          <button
            onClick={() => setVisible((prev) => prev + 8)}
            className="btn btn-primary"
          >
            Explore More Tiles
          </button>
        </div>
      )}
    </section>
  );
}