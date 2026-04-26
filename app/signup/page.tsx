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

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

          <h1 className="text-3xl font-semibold mb-6">Create account</h1>

          {/* Google */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 border border-white/15 bg-white/10 hover:bg-white/15 rounded-xl py-3 mb-4"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="text-center text-white/40 text-sm my-4">or</div>

          {/* Names */}
          <div className="flex gap-3">
            <input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 px-4 py-3 rounded-xl bg-black border border-white/10"
            />
            <input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 px-4 py-3 rounded-xl bg-black border border-white/10"
            />
          </div>

          {/* Email */}
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-3 px-4 py-3 rounded-xl bg-black border border-white/10"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-3 px-4 py-3 rounded-xl bg-black border border-white/10"
          />

          {/* Submit */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full mt-4 py-3 bg-white text-black font-semibold rounded-xl"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Messages */}
          {message && (
            <p className="mt-4 text-sm text-green-400">{message}</p>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          {/* Link */}
          <p className="text-sm text-white/50 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Log in
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}