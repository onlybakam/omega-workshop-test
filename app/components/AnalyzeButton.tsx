"use client";

import { useState } from "react";
import { Streamdown } from "streamdown";

export default function AnalyzeButton({ deckId }: { deckId: string }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(null);
    setResult("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResult((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  if (result) {
    return (
      <div className="mt-3 rounded-md bg-gray-50 border border-gray-200 p-4">
        <Streamdown animated>{result}</Streamdown>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleAnalyze}
        disabled={analyzing}
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {analyzing ? "Analyzing..." : "Analyze"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
