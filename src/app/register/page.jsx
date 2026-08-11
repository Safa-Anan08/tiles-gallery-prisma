"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(name, email, password);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error || "Registration failed");
      return;
    }

    toast.success("Account created 🎉");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-6">
          Join Tiles Gallery
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-black outline-none"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-black outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 chars)"
            className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-black outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:scale-[1.02] transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm">
          Already have an account?
          <Link href="/login" className="ml-1 font-semibold text-black">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}