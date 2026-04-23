"use client";

import { useRef, useState } from "react";
import Hero from "@/components/Hero";
import InputForm from "@/components/InputForm";
import ResultCard from "@/components/ResultCard";
import LoadingState from "@/components/LoadingState";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [originalInput, setOriginalInput] = useState("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
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
            <ResultCard result={result} setResult={setResult} originalInput={originalInput} />
          )}
        </div>
      </div>
    </main>
  );
}