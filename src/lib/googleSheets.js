import { google } from "googleapis";
import rateLimit from "express-rate-limit";

let cachedSheets = null;

// Lazily build the Google Sheets client. Doing this lazily (instead of at module
// load) avoids crashing the whole route at import time when credentials are missing.
function getSheets() {
  if (cachedSheets) return cachedSheets;

  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("GOOGLE_PRIVATE_KEY environment variable is not set");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
    projectId: process.env.GOOGLE_PROJECT_ID,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedSheets = google.sheets({ version: "v4", auth });
  return cachedSheets;
}

const ALMATY_DATE_TIME = {
  timeZone: "Asia/Almaty",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const ALMATY_DATE_TIME_NO_SECONDS = {
  timeZone: "Asia/Almaty",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export function getCurrentFormattedDate() {
  return new Intl.DateTimeFormat("en-GB", ALMATY_DATE_TIME)
    .format(new Date())
    .replace(",", "");
}

export function formatTimestamp(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", ALMATY_DATE_TIME_NO_SECONDS)
    .format(date)
    .replace(",", "");
}

// Appends one or more rows to a spreadsheet. `range` controls the target sheet
// (tab) and column span, e.g. "Leads!A:Z". Returns true on success.
export async function appendToSheet({ spreadsheetId, range, values }) {
  try {
    const sheets = getSheets();
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values },
    });
    return result.status === 200;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    return false;
  }
}

export function createDailyRateLimiter(max = 100) {
  return rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max,
    message: { error: "Too many requests, please try again tomorrow." },
    headers: true,
  });
}

export function applyRateLimit(limiter, req, res) {
  return new Promise((resolve, reject) => {
    limiter(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });
}

const BLOCKED_USER_AGENTS = [
  "curl",
  "wget",
  "PostmanRuntime",
  "Python",
  "bot",
  "crawl",
  "spider",
];

export function isSuspiciousUserAgent(req) {
  const userAgent = (req.headers["user-agent"] || "").toLowerCase();
  return BLOCKED_USER_AGENTS.some((agent) => userAgent.includes(agent));
}

// Sets CORS headers when the request origin is allowed. Returns whether the
// origin is in the allow-list so callers can decide to reject or continue.
export function applyCors(
  req,
  res,
  { allowedOrigins, methods = "POST, OPTIONS", credentials = false } = {}
) {
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (credentials) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  return isAllowed;
}
