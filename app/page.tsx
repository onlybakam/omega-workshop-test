"use client";

import { useRouter } from "next/navigation";
import UploadForm from "./components/UploadForm";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Pitch Deck Analyzer
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-md">
        Upload your pitch deck and get{" "}
        <span className="font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">instant AI-powered</span>{" "}
        analysis.
      </p>

      <div className="mt-10">
        <UploadForm onUpload={() => router.push("/decks")} />
      </div>
    </div>
  );
}
