
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.post("/contact-us", {
        name,
        email,
        message,
      });

      if (res.success) {
        toast.success("Message sent successfully");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(res.message || "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-200 text-gray-800 mt-16 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">


        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Tiles Gallery
          </h2>

          <p className="text-gray-600 mt-3 leading-relaxed">
            Discover premium aesthetic tiles for modern and luxury interiors.
          </p>

          <div className="w-12 h-1 bg-blue-600 rounded-full mt-5" />
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/all-tiles"
                className="hover:text-blue-600 transition-colors"
              >
                All Tiles
              </Link>
            </li>

            <li>
              <Link
                href="/wishlist"
                className="hover:text-blue-600 transition-colors"
              >
                Wishlist
              </Link>
            </li>

            <li>
              <Link
                href="/my-profile"
                className="hover:text-blue-600 transition-colors"
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Contact Us
          </h3>

          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Email:</span>{" "}
              tilesgallery@gmail.com
            </p>

            <p>
              <span className="font-medium text-gray-800">Phone:</span>{" "}
              +8801234567890
            </p>
          </div>

          <div className="flex gap-4 mt-6 text-xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaFacebook />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              <FaInstagram />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-600 hover:text-sky-500 transition-colors"
            >
              <FaTwitter />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaGithub />
            </a>
          </div>
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Send Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <textarea
              placeholder="Message"
              className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>


      <div className="text-center py-5 border-t border-gray-300 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Tiles Gallery. All rights reserved.
      </div>
    </footer>
  );
}
