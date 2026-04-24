"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function InputForm({
  setResult,
  setLoading,
  setOriginalInput,
}: any) {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setOriginalInput(trimmed);

    trackEvent("analysis_submitted", {
      input_length: trimmed.length,
      has_question_mark: trimmed.includes("?"),
    });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error);
      }

      setResult(data);

      trackEvent("analysis_completed", {
        risk: data?.risk || "unknown",
        red_flags_count: Array.isArray(data?.redFlags)
          ? data.redFlags.length
          : 0,
      });
    } catch (error: any) {
      const message = error?.message || "Request failed";

      setResult({
        risk: "Error",
        verdict: message,
        redFlags: ["Request failed", "Could not reach AI", "Try again"],
        nextStep: "Please try again.",
      });

      trackEvent("analysis_failed", {
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.09),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_28%)]" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Situation Input
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              What needs a reality check?
            </h2>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/50 backdrop-blur-xl md:block">
            AI Risk Engine
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your situation here..."
          className="h-48 w-full resize-none rounded-2xl border border-white/10 bg-black/60 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none placeholder:text-white/30 focus:border-white/25"
        />

        <button
          onClick={handleSubmit}
          className="w-full rounded-2xl bg-white py-3.5 font-semibold text-black shadow-[0_18px_60px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
        >
          Check Now
        </button>
      </div>
    </section>
  );
}