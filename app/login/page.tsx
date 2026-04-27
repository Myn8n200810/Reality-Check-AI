"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = "/reality-check";
  };

  const handleGoogleLogin = async () => {
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/reality-check`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-sm text-white/60 hover:text-white mb-6 inline-block"
        >
          ← Back
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-semibold mb-6">Log in</h1>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-white/15 bg-white/10 hover:bg-white/15 transition rounded-xl py-3 mb-4"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <div className="text-center text-white/40 text-sm my-4">or</div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-black border border-white/10 focus:outline-none focus:border-white/30"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-black border border-white/10 focus:outline-none focus:border-white/30"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-white text-black font-semibold rounded-xl disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <p className="text-sm text-white/50 mt-6 text-center">
            New here?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Create new account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}