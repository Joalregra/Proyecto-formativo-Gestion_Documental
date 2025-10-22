import { connectDB } from "../../src/modules/utils/db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    try {
        const db = await connectDB();

        // Check for both browsing (parent_id) and search (name) parameters
        const { parent_id, name } = req.query;
        let sql = "SELECT id, name, codigo_documental, tipo AS type, NOW() AS updated_at FROM folders";
        const params = [];

        // --- Search Logic (Highest Priority) ---
        // If a name is provided, perform a global search using LIKE
        if (name && name.length > 0) {
            sql += " WHERE name LIKE ?";
            params.push(`%${name}%`);
        }
            // --- Browsing Logic ---
        // If no name is provided, filter by parent_id (or look for root folders)
        else if (parent_id === undefined || parent_id === null || parent_id === "" || parent_id === "null") {
            // Root level: show items with no parent
            sql += " WHERE parent_id IS NULL";
        } else {
            sql += " WHERE parent_id = ?";
            params.push(Number(parent_id));
        }

        const [rows] = await db.query(sql, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error("/api/folders error:", error);
        res.status(500).json({ error: error.message });
    }
}
