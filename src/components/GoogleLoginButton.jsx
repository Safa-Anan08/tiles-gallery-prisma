"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GoogleLoginButton({ onSuccessRedirect = "/" }) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isGisRendered, setIsGisRendered] = useState(false);
  const googleBtnRef = useRef(null);

  const handleCredentialResponse = useCallback(
    async (response) => {
      if (!response || !response.credential) {
        toast.error("Google login cancelled or failed.");
        return;
      }

      setLoading(true);
      try {
        const result = await googleLogin(response.credential);
        if (result.success) {
          toast.success("Welcome! Logged in with Google 🎉");
          router.push(onSuccessRedirect);
        } else {
          toast.error(result.error || "Google Login failed");
        }
      } catch {
        toast.error("An error occurred during Google authentication");
      } finally {
        setLoading(false);
      }
    },
    [googleLogin, router, onSuccessRedirect]
  );


  useEffect(() => {
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "161517379855-vfn2101181ir6vdgjcv9s9thodfltfci.apps.googleusercontent.com";

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
            shape: "pill",
            logo_alignment: "center",
          });
          setIsGisRendered(true);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, [handleCredentialResponse]);


  const triggerGooglePrompt = () => {
    if (window.google?.accounts?.id) {
      setLoading(true);
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setLoading(false);
        }
      });
    } else {
      toast.error("Google Sign-In is initializing. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-200 w-full" />
        <span className="bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider absolute">
          Or
        </span>
      </div>

      <div className="w-full relative">
        <div
          ref={googleBtnRef}
          className={`w-full min-h-[44px] flex justify-center ${
            loading ? "opacity-50 pointer-events-none" : ""
          } ${isGisRendered ? "block" : "hidden"}`}
        />

        {!isGisRendered && (
          <button
            type="button"
            onClick={triggerGooglePrompt}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
