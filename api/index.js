export default function handler(req, res) {
  res.status(200).json({ message: "📦 Inventory API running! Visit /swagger for docs." });
}