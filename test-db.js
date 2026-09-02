import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();

  const result = await client.query("SELECT NOW()");

  console.log("POSTGRES CONNECTED:");
  console.log(result.rows);
} catch (error) {
  console.error("POSTGRES ERROR:");
  console.error(error);
} finally {
  await client.end();
}
