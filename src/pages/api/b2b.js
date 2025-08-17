import { google } from "googleapis";
import rateLimit from "express-rate-limit";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const getCurrentFormattedDate = () => {
  const date = new Date();
  const options = {
    timeZone: "Asia/Almaty",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Intl.DateTimeFormat("en-GB", options)
    .format(date)
    .replace(",", "");
};

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again tomorrow." },
  headers: true,
});

async function appendToSheet({ values }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.COMPANY_SHEET_ID;
    const sheetName = process.env.COMPANY_SHEET_NAME || "Leads";
    const resource = { values };
    
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:J`,
      valueInputOption: "RAW",
      resource,
    });
    return result.status === 200;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    return false;
  }
}

export default async function handler(req, res) {
  // Расширенный список разрешенных доменов
  const allowedOrigins = [
    "https://www.nfactorial.school", 
    "https://nfactorial.school",
  ];
  
  const origin = req.headers.origin;
  
  // Проверка CORS с динамическим разрешением
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true"); // ВАЖНО!
  }
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  // Rate limiting
  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
  
  const userAgent = req.headers["user-agent"] || "";
  const blockedAgents = [
    "curl", "wget", "PostmanRuntime", 
    "Python", "bot", "crawl", "spider"
  ];
  
  if (blockedAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
    return res.status(403).json({ error: "Access denied: suspicious activity detected" });
  }
  
  if (req.method === "POST") {
    const { name, phone, company, utmData, referrer } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const formattedDate = getCurrentFormattedDate();
    
    const success = await appendToSheet({
      values: [
        [
          formattedDate,
          name,
          phone,
          company || "",
          referrer || "",
          utmData?.utm_source || "",
          utmData?.utm_medium || "",
          utmData?.utm_campaign || "",
          utmData?.utm_term || "",
          utmData?.utm_content || "",
          utmData?.attribution_type || "",
          utmData?.captured_at || "",
          utmData?.landing_page || "",
          utmData?.browser_id || "",
          utmData?.session_id || "",
          utmData?.page_view_count || "",
        ],
      ],
    });
    
    if (success) {
      return res.status(200).json({ message: "Data successfully submitted" });
    } else {
      return res.status(500).json({ error: "Failed to submit data" });
    }
  } else {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}