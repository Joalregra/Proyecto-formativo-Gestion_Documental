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
            const { folder_id, name } = req.query || {};

            let sql = `SELECT id, name, file_path, folder_id, tipo, size, NOW() AS created_at FROM files`;
            const conditions = [];
            const params = [];

            // 1. Handle search by name (for global search)
            if (name && name.length > 0) {
                conditions.push("name LIKE ?");
                params.push(`%${name}%`);
            }

            // 2. Handle folder_id (for navigation, only if not globally searching everything)
            // If global search is active, we ignore folder_id as we want all matches.
            if (!name || name.length === 0) {
                if (folder_id === undefined || folder_id === null || folder_id === "" || folder_id === "null") {
                    // Root level: show files with no folder_id
                    conditions.push("folder_id IS NULL");
                } else {
                    // Child level: show files with specific folder_id
                    conditions.push("folder_id = ?");
                    params.push(Number(folder_id)); // Use Number() for consistency and safety
                }
            }


            if (conditions.length > 0) {
                sql += " WHERE " + conditions.join(" AND ");
            }

            // Sort by name for better visibility
            sql += " ORDER BY name ASC";

            const [rows] = await db.query(sql, params);
            return res.status(200).json(rows);
        } else if (req.method === "POST") {
            // POST logic for file upload (changed to accept 'tipo' directly from frontend)
            const { name, folder_id, file, tipo, user_id } = req.body;

            // Note: 'tipo' is now expected to be "PDF" from the frontend payload.

            if (!file || !file.base64 || !name || !folder_id) {
                return res.status(400).json({ error: "Missing required fields (name, folder_id, file.base64)" });
            }

            const base64 = file.base64.split(",")[1];
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

            // Ensure id column in files table is large enough for UUID (VARCHAR(64))
            const sql = `INSERT INTO files (id, name, file_path, folder_id, tipo, user_id, size) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const params = [
                id,
                name,
                publicPath,
                Number(folder_id),
                // Use the 'tipo' value from the request body (which is now set to "PDF" by the frontend)
                tipo || file.mimeType || null,
                Number.isFinite(Number(user_id)) ? Number(user_id) : 1,
                buffer.length,
            ];

            await db.query(sql, params);

            return res.status(201).json({
                id,
                name,
                file_path: publicPath,
                folder_id: Number(folder_id),
                // Return the saved 'tipo' (e.g., "PDF")
                tipo: tipo || file.mimeType || null,
                size: buffer.length,
                created_at: new Date().toISOString(),
            });
        }

        return res.status(405).json({ error: "Method Not Allowed" });
    } catch (error) {
        console.error(`/api/files error (${req.method}):`, error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
