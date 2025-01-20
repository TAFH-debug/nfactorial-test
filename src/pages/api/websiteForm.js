import { google } from "googleapis";
import fetch from "node-fetch";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replacing escaped newlines
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const getCurrentFormattedDate = () => {
  const date = new Date();

  // Форматируем дату и время
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
    .replace(",", ""); // Убираем запятую, если есть
};

async function appendToSheet({ spreadsheetId, sheetName, values }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const resource = { values };

    // Append data to the sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:H`, // Подогнать диапазон
      valueInputOption: "RAW",
      resource,
    });

    return result.status === 200;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    return false;
  }
}

async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const url = "https://www.google.com/recaptcha/api/siteverify";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, phone, email, utmData, referrer, recaptchaToken } = req.body;

    if (!name || !phone || !recaptchaToken) {
      return res.status(400).json({ error: "Missing required fields or reCAPTCHA token" });
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    const spreadsheetId = process.env.WEBSITE_SHEET_ID;
    const sheetName = process.env.WEBSITE_SHEET_NAME || "FormLeads";

    const formattedDate = getCurrentFormattedDate();

    const success = await appendToSheet({
      spreadsheetId,
      sheetName,
      values: [
        [
          formattedDate, // Дата и время
          name,
          phone,
          email || "",
          referrer || "",
          utmData?.utm_source || "",
          utmData?.utm_medium || "",
          utmData?.utm_campaign || "",
          utmData?.utm_term || "",
          utmData?.utm_content || "",
        ],
      ],
    });

    if (success) {
      return res.status(200).json({ message: "Data successfully submitted" });
    } else {
      return res.status(500).json({ error: "Failed to submit data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
