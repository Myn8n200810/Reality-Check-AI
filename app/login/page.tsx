"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Back */}
        <Link
          href="/"
          className="text-sm text-white/60 hover:text-white mb-6 inline-block"
        >
          ← Back
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">

          <h1 className="text-3xl font-semibold mb-6">
            Log in
          </h1>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-3 border border-white/15 bg-white/10 hover:bg-white/15 transition rounded-xl py-3 mb-4">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <div className="text-center text-white/40 text-sm my-4">
            or
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-3 rounded-xl bg-black border border-white/10 focus:outline-none focus:border-white/30"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-black border border-white/10 focus:outline-none focus:border-white/30"
          />

          <button className="w-full py-3 bg-white text-black font-semibold rounded-xl">
            Continue with Email
          </button>

          {/* Footer */}
          <p className="text-sm text-white/50 mt-6 text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}