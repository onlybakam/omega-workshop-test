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
        Upload your pitch deck and get AI-powered feedback in seconds.
      </p>

      <div className="mt-10">
        <UploadForm onUpload={() => router.push("/decks")} />
      </div>
    </div>
  );
}
