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
        red_flags_count: Array.isArray(data?.redFlags) ? data.redFlags.length : 0,
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
    <section className="rounded-2xl border border-gray-800 bg-gray-950 p-6 space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your situation here..."
        className="w-full h-44 rounded-xl bg-black border border-gray-800 p-4 text-white"
      />

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-white text-black font-semibold rounded-xl"
      >
        Check Now
      </button>
    </section>
  );
}