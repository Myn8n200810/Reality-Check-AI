"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileMenu() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    const closeProfile = () => setOpen(false);

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("close-profile-menu", closeProfile);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("close-profile-menu", closeProfile);
      document.removeEventListener("mousedown", handleClickOutside);
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!user) return null;

  const name =
    user.user_metadata?.first_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  const initials =
    user.user_metadata?.first_name?.[0]?.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div ref={menuRef} className="relative z-[999]">
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new Event("close-navbar-menu"));
          setOpen((prev) => !prev);
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-black shadow-[0_12px_40px_rgba(52,211,153,0.25)] transition-all duration-150 hover:scale-105 hover:bg-emerald-300 active:scale-90 active:bg-emerald-500"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-[9999] w-72 rounded-2xl border border-white/10 bg-[#111]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="mb-3 flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-black">
              {initials}
            </div>

            <div>
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs text-white/45">Plus</p>
            </div>
          </div>

          <div className="space-y-1 text-sm text-white/75">
            <button
              onClick={() => {
                window.dispatchEvent(new Event("close-navbar-menu"));
                window.dispatchEvent(new Event("close-profile-menu"));
              }}
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-white/10 hover:text-white"
            >
              Profile
            </button>

            <div className="my-2 border-t border-white/10" />

            <button
              onClick={() => {
                window.dispatchEvent(new Event("close-navbar-menu"));
                window.dispatchEvent(new Event("close-profile-menu"));
              }}
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-white/10 hover:text-white"
            >
              Add new account
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(new Event("close-navbar-menu"));
                window.dispatchEvent(new Event("close-profile-menu"));
              }}
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-white/10 hover:text-white"
            >
              Switch account
            </button>

            <button
              onClick={async () => {
                window.dispatchEvent(new Event("close-navbar-menu"));
                window.dispatchEvent(new Event("close-profile-menu"));
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}