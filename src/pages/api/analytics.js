import {
  appendToSheet,
  applyCors,
  applyRateLimit,
  createDailyRateLimiter,
  getCurrentFormattedDate,
  isSuspiciousUserAgent,
} from "@/lib/googleSheets";

const limiter = createDailyRateLimiter();

export default async function handler(req, res) {
  const isAllowed = applyCors(req, res, {
    allowedOrigins: ["https://www.nfactorial.school"],
  });
  if (!isAllowed) {
    return res.status(403).json({ error: "Access denied by CORS policy" });
  }

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await applyRateLimit(limiter, req, res);

  if (isSuspiciousUserAgent(req)) {
    return res
      .status(403)
      .json({ error: "Access denied: suspicious activity detected" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name, phone, email" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const spreadsheetId = "1ieCp5oVmqbLYbrjcm2ZuV3fJ870AmAAJyM4dUs_gK7g";
  const sheetName = "Leads";
  const formattedDate = getCurrentFormattedDate();

  const success = await appendToSheet({
    spreadsheetId,
    range: `${sheetName}!A:D`,
    values: [[formattedDate, name, phone, email]],
  });

  if (success) {
    return res.status(200).json({ message: "Data successfully submitted" });
  }
  return res.status(500).json({ error: "Failed to submit data" });
}
