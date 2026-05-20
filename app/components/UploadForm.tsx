"use client";

import { useState } from "react";

interface UploadedFile {
  filename: string;
  key: string;
}

export default function UploadForm({
  onUpload,
}: {
  onUpload: (file: UploadedFile) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { key, filename } = await res.json();
      onUpload({ filename, key });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <label className="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-gray-300 p-12 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
        <svg
          className="w-8 h-8 text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
          />
        </svg>
        <span className="text-sm text-gray-600">
          {uploading ? "Uploading..." : "Click to upload a PDF"}
        </span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />
      </label>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
