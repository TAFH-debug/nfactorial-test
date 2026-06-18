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
  applyCors(req, res, {
    allowedOrigins: [
      "https://www.nfactorial.school",
      "https://nfactorial.school",
      "http://localhost:3000",
    ],
    credentials: true,
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
    company,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    gclid,
    fbclid,
    yclid,
    utm_referrer,
    timestamp,
    utmData,
    referrer,
  } = req.body;

  if (!name || !phone) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name and phone" });
  }

  const formattedDate = getCurrentFormattedDate();

  let attribution_type = "direct";
  if (utm_source || utmData?.utm_source) {
    attribution_type = "utm";
  }
  if (gclid) {
    attribution_type = "google_ads";
  }
  if (fbclid) {
    attribution_type = "facebook_ads";
  }
  if (yclid) {
    attribution_type = "yandex_ads";
  }

  const rowData = [
    formattedDate, // A: Date
    name, // B: Name
    phone, // C: Phone
    company || "", // D: Company
    utm_referrer || referrer || "", // E: Referrer
    utm_source || utmData?.utm_source || "", // F: UTM_Source
    utm_medium || utmData?.utm_medium || "", // G: UTM_Medium
    utm_campaign || utmData?.utm_campaign || "", // H: UTM_Campaign
    utm_term || utmData?.utm_term || "", // I: UTM_Term
    utm_content || utmData?.utm_content || "", // J: UTM_Content
    gclid || "", // K: GCLID
    fbclid || "", // L: FBCLID
    yclid || "", // M: YCLID
    attribution_type, // N: Attribution_Type
    timestamp ? new Date(timestamp).toISOString() : "", // O: Timestamp
  ];

  const success = await appendToSheet({
    spreadsheetId: process.env.COMPANY_SHEET_ID,
    range: `${process.env.COMPANY_SHEET_NAME || "Leads"}!A:O`,
    values: [rowData],
  });

  if (success) {
    console.log("✅ Lead saved from cookies:", {
      name,
      phone,
      company: company || "not provided",
      utm_source: utm_source || utmData?.utm_source || "none",
      attribution_type,
      has_gclid: !!gclid,
      has_fbclid: !!fbclid,
      cookies_utm_found: !!(utm_source || utm_medium || utm_campaign),
    });

    return res.status(200).json({
      message: "Data successfully submitted",
      leadId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      attribution_type,
    });
  }

  console.error("❌ Failed to save lead from cookies");
  return res.status(500).json({ error: "Failed to submit data" });
}
