"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import InputForm from "@/components/InputForm";
import ResultCard from "@/components/ResultCard";
import LoadingState from "@/components/LoadingState";

export default function RealityCheckPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [originalInput, setOriginalInput] = useState("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%),linear-gradient(to_bottom,#020202,#070707,#020202)]" />

      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-[12%] top-[18%] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[10%] top-[32%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[8%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="relative z-10 px-4 py-8 md:py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              ← Back
            </Link>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/45 backdrop-blur-xl">
              Mode 01
            </div>
          </div>

          <Hero />

          <InputForm
            setResult={setResult}
            setLoading={setLoading}
            setOriginalInput={setOriginalInput}
          />

          <div ref={resultRef} className="pt-2">
            {loading ? (
              <LoadingState />
            ) : (
              <ResultCard
                result={result}
                setResult={setResult}
                originalInput={originalInput}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}