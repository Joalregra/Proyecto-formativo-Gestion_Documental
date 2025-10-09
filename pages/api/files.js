import fs from "fs";
import path from "path";
import crypto from "crypto";
import { connectDB } from "../../src/modules/utils/db";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
}

function makeId() {
  // Make a URL-safe, hyphenless UUID (32 hex chars)
  return crypto.randomUUID().replace(/-/g, "");
}

function sanitizeFilename(name) {
  return (name || "file").replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const db = await connectDB();
      const { folder_id } = req.query || {};

      let sql = `SELECT id, name, file_path, folder_id, tipo, size, NOW() AS created_at FROM files`;
      const params = [];

      if (folder_id === undefined || folder_id === null || folder_id === "" || folder_id === "null") {
        sql += " WHERE folder_id IS NULL";
      } else {
        sql += " WHERE folder_id = ?";
        params.push(Number(folder_id));
      }

      const [rows] = await db.query(sql, params);
      return res.status(200).json(Array.isArray(rows) ? rows : []);
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { name, folder_id, tipo, user_id, file } = req.body || {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'name'" });
    }

    // Determine destination folder ID (nullable)
    const folderId = Number.isFinite(Number(folder_id)) ? Number(folder_id) : null;

    if (!file || typeof file.base64 !== "string") {
      return res.status(400).json({ error: "Missing 'file.base64' in request body" });
    }

    const base64 = file.base64.includes(",") ? file.base64.split(",")[1] : file.base64;
    const buffer = Buffer.from(base64, "base64");

    const uploads = ensureUploadsDir();
    const id = makeId();

    const orig = sanitizeFilename(file.filename || `${name}`);
    // Prefer extension from original filename; fallback to mime type
    const extFromName = path.extname(orig);
    let finalName = extFromName ? `${id}_${orig}` : `${id}_${orig}`;

    const destPath = path.join(uploads, finalName);
    fs.writeFileSync(destPath, buffer);

    const publicPath = `/uploads/${finalName}`;

    // Insert DB row
    const db = await connectDB();

    const sql = `INSERT INTO files (id, name, file_path, folder_id, tipo, user_id, size) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id, // NOTE: requires files.id column to accept VARCHAR; if it's INT, please migrate to VARCHAR(64)
      name,
      publicPath,
      folderId,
      tipo || file.mimeType || null,
      Number.isFinite(Number(user_id)) ? Number(user_id) : 1,
      buffer.length,
    ];

    await db.query(sql, params);

    return res.status(201).json({
      id,
      name,
      file_path: publicPath,
      folder_id: folderId,
      tipo: tipo || file.mimeType || null,
      user_id: Number.isFinite(Number(user_id)) ? Number(user_id) : 1,
      size: buffer.length,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("/api/files error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
