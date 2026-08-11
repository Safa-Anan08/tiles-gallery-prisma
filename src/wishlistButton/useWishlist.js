"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

export function useWishlist(tile, passedSession) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const currentUser = passedSession?.email
    ? passedSession
    : passedSession?.user?.email
    ? passedSession.user
    : user;

  const userEmail = currentUser?.email;

  useEffect(() => {
    const check = async () => {
      if (!userEmail || !tile) {
        setIsWishlisted(false);
        return;
      }

      const res = await apiClient.get(`/wishlist?email=${userEmail}`);
      const data = res.data || [];

      const exists =
        Array.isArray(data) &&
        data.some((item) => item.tileId === (tile._id || tile.id));

      setIsWishlisted(exists);
    };

    if (!authLoading) {
      check();
    }
  }, [tile, userEmail, authLoading]);

  const toggleWishlist = async () => {
    if (authLoading) return;

    if (!userEmail) {
      toast.error("Please login first");
      return;
    }

    const tileId = tile._id || tile.id;
    setLoading(true);

    try {
      if (!isWishlisted) {
        const res = await apiClient.post("/wishlist", {
          tileId,
          title: tile.title,
          image: tile.image,
          price: tile.price,
          category: tile.category,
          userEmail,
        });

        if (res.success) {
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        } else {
          toast.error(res.message || "Failed to add to wishlist");
        }
      } else {
        const res = await apiClient.delete("/wishlist", {
          tileId,
          userEmail,
        });

        if (res.success) {
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error(res.message || "Failed to remove from wishlist");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { isWishlisted, toggleWishlist, loading };
}