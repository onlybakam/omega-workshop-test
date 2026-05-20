"use client";

import { useState } from "react";
import UploadForm from "./components/UploadForm";

interface UploadedFile {
  filename: string;
  key: string;
}

export default function Home() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  return (
    <div className="flex flex-col items-center text-center py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Pitch Deck Analyzer
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-md">
        Upload your pitch deck and get AI-powered feedback in seconds.
      </p>

      <div className="mt-10">
        <UploadForm
          onUpload={(file) => setFiles((prev) => [file, ...prev])}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-10 w-full max-w-lg space-y-3">
          {files.map((file) => (
            <div
              key={file.key}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3"
            >
              <span className="text-sm text-gray-800 truncate">
                {file.filename}
              </span>
              <span className="ml-3 shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                Pending Analysis
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
