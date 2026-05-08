"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ProfileMenu from "@/components/ProfileMenu";

export default function HeaderAuth() {
  const [user, setUser] = useState<any>(null);

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

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (user) {
    return <ProfileMenu />;
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="btn-press rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white"
      >
        Log In
      </Link>

      <Link
        href="/signup"
        className="btn-press-light rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-black"
      >
        Sign Up
      </Link>
    </div>
  );
}