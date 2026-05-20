import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "@/lib/s3";

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

  return Response.json({ key, filename: file.name });
}
