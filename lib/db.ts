import { DsqlSigner } from "@aws-sdk/dsql-signer";
import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

export async function getDb() {
  if (sql) return sql;

  const host = process.env.PG_HOST;
  const user = process.env.PG_USER ?? "admin";
  const region = process.env.PG_REGION ?? "us-east-1";

  if (!host) {
    throw new Error("PG_HOST is not configured");
  }

  const signer = new DsqlSigner({ hostname: host, region });
  const token = await signer.getDbConnectAdminAuthToken();

  sql = postgres({
    host,
    port: 5432,
    username: user,
    password: token,
    database: "postgres",
    ssl: "require",
  });

  return sql;
}
