import {
  appendToSheet,
  applyCors,
  applyRateLimit,
  createDailyRateLimiter,
  formatTimestamp,
  getCurrentFormattedDate,
  isSuspiciousUserAgent,
} from "@/lib/googleSheets";

const limiter = createDailyRateLimiter();

export default async function handler(req, res) {
  applyCors(req, res, {
    allowedOrigins: [
      "https://www.nfactorial.school",
      "https://test.nfactorial.school",
      "http://localhost:3000",
    ],
  });

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

  const {
    name,
    phone,
    grade,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    fbclid,
    gclid,
    yclid,
    utm_referrer,
    landing_page,
    form_page_url,
    attribution_type,
    attribution_timestamp,
    attribution_window,
    browser_id,
    session_id,
    page_view_count,
    device_type,
    screen_resolution,
    timezone,
    language,
    utmData,
    referrer,
  } = req.body;

  if (!name || !phone || !grade) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name, phone, grade" });
  }

  const spreadsheetId = process.env.ADMISSIONS_SHEET_ID;
  const sheetName = process.env.ADMISSIONS_SHEET_NAME || "FormLeads";
  const formattedDate = getCurrentFormattedDate();

  let finalAttributionType = attribution_type;
  if (fbclid && (!attribution_type || attribution_type === "direct")) {
    finalAttributionType = "click";
  } else if (gclid && (!attribution_type || attribution_type === "direct")) {
    finalAttributionType = "click";
  } else if (utm_source && !attribution_type) {
    finalAttributionType = "utm";
  } else if (!attribution_type) {
    finalAttributionType = "direct";
  }

  const rowData = [
    formattedDate, // A: Date
    name, // B: Name
    phone, // C: Phone
    grade, // D: Grade
    utm_referrer || referrer || "", // E: utm_referrer
    utm_source || utmData?.utm_source || "", // F: utm_source
    utm_medium || utmData?.utm_medium || "", // G: utm_medium
    utm_campaign || utmData?.utm_campaign || "", // H: utm_campaign
    utm_term || utmData?.utm_term || "", // I: utm_term
    utm_content || utmData?.utm_content || "", // J: utm_content
    fbclid || "", // K: fbclid
    gclid || "", // L: gclid
    yclid || "", // M: yclid
    landing_page || "", // N: Landing_Page
    finalAttributionType, // O: Attribution_Type
    browser_id || "", // P: Browser_ID
    session_id || "", // Q: Session_ID
    page_view_count || "1", // R: Page_View_Count
    formatTimestamp(attribution_timestamp), // S: Attribution_Timestamp
    form_page_url || "", // T: Form_Page_URL
    device_type || "", // U: Device_Type
    attribution_window || "", // V: Attribution_Window
    screen_resolution || "", // W: Screen_Resolution
    timezone || "", // X: Timezone
    language || "", // Y: Language
  ];

  const success = await appendToSheet({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    values: [rowData],
  });

  if (success) {
    return res.status(200).json({
      message: "Data successfully submitted",
      leadId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    });
  }
  return res.status(500).json({ error: "Failed to submit data" });
}
