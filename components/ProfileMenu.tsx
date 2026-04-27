"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileMenu() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

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
    window.addEventListener("close-profile-menu", closeProfile);

    return () => {
      window.removeEventListener("close-profile-menu", closeProfile);
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!user) return null;

  const name =
    user.user_metadata?.first_name ||
    user.email?.split("@")[0] ||
    "User";

  const initials =
    user.user_metadata?.first_name?.[0]?.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="relative z-50">
      {/* BUTTON */}
      <button
        onClick={() => {
          window.dispatchEvent(new Event("close-navbar-menu"));
          setOpen(!open);
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-black"
      >
        {initials}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-[#111]/95 p-4 backdrop-blur-2xl">
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
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-red-400 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}