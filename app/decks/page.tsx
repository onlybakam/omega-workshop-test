import { getDb } from "@/lib/db";
import Link from "next/link";
import AnalyzeButton from "../components/AnalyzeButton";
import MarkdownContent from "../components/MarkdownContent";

interface Deck {
  id: string;
  filename: string;
  s3_key: string;
  uploaded_at: string;
  status: string;
  analysis: string | null;
}

export const dynamic = "force-dynamic";

export default async function DecksPage() {
  const sql = await getDb();
  const decks = await sql<Deck[]>`SELECT * FROM decks ORDER BY uploaded_at DESC`;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Decks</h1>
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Upload another
        </Link>
      </div>

      {decks.length === 0 ? (
        <p className="text-gray-500 text-sm">No decks uploaded yet.</p>
      ) : (
        <div className="space-y-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="rounded-md border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {deck.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(deck.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    deck.status === "analyzed"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {deck.status === "analyzed" ? "✓ Analyzed" : "Pending"}
                </span>
              </div>

              {deck.status === "analyzed" && deck.analysis && (
                <div className="mt-3 rounded-md bg-gray-50 border border-gray-200 p-4">
                  <MarkdownContent content={deck.analysis} />
                </div>
              )}

              {deck.status !== "analyzed" && (
                <div className="mt-3">
                  <AnalyzeButton deckId={deck.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
