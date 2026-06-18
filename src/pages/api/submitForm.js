import { appendToSheet, getCurrentFormattedDate } from "@/lib/googleSheets";

function buildLeadRow({ formattedDate, name, phone, email, utmData, referrer, formType }) {
  return [
    formattedDate,
    name,
    phone,
    email || "",
    utmData?.utm_referrer || referrer || "",
    utmData?.utm_source || "",
    utmData?.utm_medium || "",
    utmData?.utm_campaign || "",
    utmData?.utm_term || "",
    utmData?.utm_content || "",
    utmData?.fbclid || "",
    utmData?.gclid || "",
    utmData?.yclid || "",
    utmData?.landing_page || "",
    utmData?.attribution_type || "",
    utmData?.browser_id || "",
    utmData?.session_id || "",
    utmData?.page_view_count || "",
    utmData?.attribution_timestamp || "",
    utmData?.form_page_url || "",
    utmData?.device_type || "",
    utmData?.attribution_window || "",
    utmData?.screen_resolution || "",
    utmData?.timezone || "",
    utmData?.language || "",
    formType || "",
  ];
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, phone, email, utmData, referrer, formType } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const formattedDate = getCurrentFormattedDate();
  const rowData = buildLeadRow({
    formattedDate,
    name,
    phone,
    email,
    utmData,
    referrer,
    formType,
  });

  const success = await appendToSheet({
    spreadsheetId: process.env.FIRST_SHEET_ID,
    range: "QuizFormLeads!A:Z",
    values: [rowData],
  });

  const backupSuccess = await appendToSheet({
    spreadsheetId: process.env.BACKUP_SHEET_ID,
    range: `${process.env.BACKUP_SHEET_NAME || "BackupLeads"}!A:Z`,
    values: [rowData],
  });

  if (success && backupSuccess) {
    return res
      .status(200)
      .json({ message: "Data successfully submitted and backed up" });
  }
  return res.status(500).json({ error: "Failed to submit or backup data" });
}
