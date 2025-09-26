import mysql from "mysql2/promise";

let pool;

function getEnv(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
  }
  return value;
}

function ensureEnv(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var ${name}. Please set it in .env.local`);
  }
  return v;
}

export async function connectDB() {
  if (!pool) {
    // Validate required envs early with clear error messages
    const host = ensureEnv("DB_HOST");
    const user = ensureEnv("DB_USER");
    const database = ensureEnv("DB_NAME");
    const password = getEnv("DB_PASS", "");
    const port = Number(getEnv("DB_PORT", 3306));

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function verifyDB() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT 1 AS ok");
    return rows && rows[0] && rows[0].ok === 1;
  } catch (err) {
    // Re-throw with concise context
    const code = err && err.code ? ` code=${err.code}` : "";
    const errno = err && err.errno ? ` errno=${err.errno}` : "";
    const address = process.env.DB_HOST ? ` host=${process.env.DB_HOST}` : "";
    throw new Error(`DB connectivity check failed:${code}${errno}${address} -> ${err.message}`);
  }
}
