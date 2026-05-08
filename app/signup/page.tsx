"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    setMessage("");

    if (!email || !password || !firstName || !lastName) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Account created. Check your email to confirm.");
  };

  const handleGoogleSignup = async () => {
    setError("");
    setMessage("");

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
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="btn-press mb-6 inline-block rounded-full px-3 py-2 text-sm text-white/60 hover:text-white"
        >
          ← Back
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="mb-6 text-3xl font-semibold">Create account</h1>

          <button
            onClick={handleGoogleSignup}
            className="btn-press mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/10 py-3 text-white"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-5 w-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <div className="my-4 text-center text-sm text-white/40">or</div>

          <div className="flex gap-3">
            <input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />

            <input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="btn-press-light mt-4 w-full rounded-xl bg-white py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {message && <p className="mt-4 text-sm text-green-400">{message}</p>}

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link
              href="/login"
              className="btn-press inline-block rounded-full px-2 py-1 text-white hover:no-underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}