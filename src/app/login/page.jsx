"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error || "Login failed");
      return;
    }

    toast.success("Welcome back!");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-6">
          Login to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="Password"
            className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-black outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:scale-[1.02] transition disabled:opacity-50 font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <GoogleLoginButton onSuccessRedirect="/" />

        <p className="text-center mt-5 text-sm">
          Don&apos;t have an account?
          <Link href="/register" className="ml-1 font-semibold text-black">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}