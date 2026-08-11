"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    image: "",
  });

  const handleUpdate = async () => {
    if (!user?.email) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    const res = await apiClient.put("/user/update", {
      email: user.email,
      name: form.name,
      image: form.image,
    });

    if (res.success) {
      toast.success("Profile updated successfully");
      await refreshUser();
      router.push("/my-profile");
    } else {
      toast.error(res.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[350px] shadow">
        <h1 className="text-xl font-bold mb-4">Update Profile</h1>

        <input
          className="w-full p-2 border mb-3 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full p-2 border mb-3 rounded"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-black text-white py-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
}