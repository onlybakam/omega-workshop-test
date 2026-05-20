import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { streamText } from "ai";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "@/lib/s3";
import { getDb } from "@/lib/db";

const bedrock = createAmazonBedrock({
  region: process.env.BUCKET_REGION ?? "us-east-1",
  credentialProvider: fromNodeProviderChain(),
});

export async function POST(request: Request) {
  let sql: Awaited<ReturnType<typeof getDb>>;
  try {
    sql = await getDb();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database connection failed";
    return Response.json({ error: msg }, { status: 500 });
  }

  const { deckId } = await request.json();

  const [deck] = await sql`SELECT * FROM decks WHERE id = ${deckId}`;
  if (!deck) {
    return Response.json({ error: "Deck not found" }, { status: 404 });
  }

  let pdfBytes: Uint8Array;
  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: deck.s3_key })
    );
    pdfBytes = await obj.Body!.transformToByteArray();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch PDF from S3";
    return Response.json({ error: msg }, { status: 500 });
  }

  const modelId = process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-sonnet-4-20250514";

  let result: ReturnType<typeof streamText>;
  try {
    result = streamText({
      model: bedrock(modelId),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              data: Buffer.from(pdfBytes).toString("base64"),
              mediaType: "application/pdf",
            },
            {
              type: "text",
              text: `Analyze this pitch deck. Provide:
1. **Strengths** — what's compelling
2. **Weaknesses** — gaps or concerns
3. **Key Investor Questions** — what a VC would ask
4. **Overall Score** — 1 to 10 with a brief justification

Be concise and direct.`,
            },
          ],
        },
      ],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bedrock invocation failed";
    return Response.json({ error: msg }, { status: 500 });
  }

  let fullText = "";
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of result.textStream) {
          fullText += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        await sql`UPDATE decks SET analysis = ${fullText}, status = 'analyzed' WHERE id = ${deckId}`;
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
