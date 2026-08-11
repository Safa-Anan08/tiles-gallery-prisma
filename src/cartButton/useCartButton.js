"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

export function useCartButton(tile, passedSession) {
  const [isCartAdded, setIsCartAdded] = useState(false);
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
        setIsCartAdded(false);
        return;
      }

      const res = await apiClient.get(`/cart?email=${userEmail}`);
      const data = res.data || [];

      const exists =
        Array.isArray(data) &&
        data.some((item) => item.tileId === (tile._id || tile.id));

      setIsCartAdded(exists);
    };

    if (!authLoading) {
      check();
    }
  }, [tile, userEmail, authLoading]);

  const toggleCart = async () => {
    if (authLoading) return;

    if (!userEmail) {
      toast.error("Please login first");
      return;
    }

    const tileId = tile._id || tile.id;

    if (!isCartAdded) {
      const res = await apiClient.post("/cart", {
        tileId,
        title: tile.title,
        image: tile.image,
        price: tile.price,
        category: tile.category,
        userEmail,
      });

      if (res.success) {
        setIsCartAdded(true);
        toast.success("Added to cart");
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    } else {
      const res = await apiClient.delete("/cart", {
        tileId,
        userEmail,
      });

      if (res.success) {
        setIsCartAdded(false);
        toast.success("Removed from cart");
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error(res.message || "Failed to remove from cart");
      }
    }
  };

  return { isCartAdded, toggleCart };
}