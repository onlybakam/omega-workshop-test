import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "@/lib/s3";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  if (!BUCKET) {
    return Response.json(
      { error: "S3 bucket not configured" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const key = `decks/${Date.now()}-${file.name}`;
  const bytes = await file.arrayBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(bytes),
      ContentType: file.type,
    })
  );

  const sql = await getDb();
  await sql`INSERT INTO decks (filename, s3_key, status) VALUES (${file.name}, ${key}, 'pending')`;

  return Response.json({ key, filename: file.name });
}
