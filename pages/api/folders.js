import { connectDB } from "../../src/modules/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const db = await connectDB();

    const { parent_id } = req.query;
    let sql = "SELECT id, name, tipo AS type, NOW() AS updated_at FROM folders";
    const params = [];

    if (parent_id === undefined || parent_id === null || parent_id === "" || parent_id === "null") {
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
