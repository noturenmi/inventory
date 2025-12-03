import path from "path";
import { fileURLToPath } from "url";

export default function handler(req, res) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, "..", "public", "swagger", "swagger.json");
  res.setHeader("Content-Type", "application/json");
  res.sendFile(filePath);
}