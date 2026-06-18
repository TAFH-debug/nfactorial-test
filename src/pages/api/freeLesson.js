import {
  appendToSheet,
  applyCors,
  applyRateLimit,
  createDailyRateLimiter,
  getCurrentFormattedDate,
} from "@/lib/googleSheets";

const SHEET_MAPPING = {
  "Основы программирования": process.env.PROGRAMMING_SHEET_ID,
  "Продакт-менеджер": process.env.PRODUCT_SHEET_ID,
  "QA-инженер": process.env.QA_SHEET_ID,
  "Дата-аналитик": process.env.DATA_SHEET_ID,
};

const FREE_COURSES_RANGE = "FreeCourses!A:K";

const limiter = createDailyRateLimiter();

export default async function handler(req, res) {
  const isAllowed = applyCors(req, res, {
    allowedOrigins: [
      "https://www.nfactorial.school",
      "https://test.nfactorial.school",
    ],
  });
  if (!isAllowed) {
    return res.status(403).json({ error: "Access denied by CORS policy" });
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await applyRateLimit(limiter, req, res);
  } catch (error) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { name, phone, email, course, utmData, referrer } = req.body;

    if (!name || !phone || !course) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const courseSheetId = SHEET_MAPPING[course];
    if (!courseSheetId) {
      return res.status(400).json({ error: "Invalid course selected" });
    }

    const formattedDate = getCurrentFormattedDate();
    const rowData = [
      formattedDate,
      name,
      phone,
      email || "",
      course,
      referrer || "",
      utmData?.utm_source || "",
      utmData?.utm_medium || "",
      utmData?.utm_campaign || "",
      utmData?.utm_term || "",
      utmData?.utm_content || "",
    ];

    const courseSheetSuccess = await appendToSheet({
      spreadsheetId: courseSheetId,
      range: FREE_COURSES_RANGE,
      values: [rowData],
    });

    const backupSheetSuccess = await appendToSheet({
      spreadsheetId: process.env.BACKUP_SHEET_MINI_ID,
      range: FREE_COURSES_RANGE,
      values: [rowData],
    });

    if (courseSheetSuccess && backupSheetSuccess) {
      return res.status(200).json({ message: "Data successfully submitted" });
    }
    throw new Error("Failed to write to one or both sheets");
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
