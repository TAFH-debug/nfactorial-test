import { google } from "googleapis";

// Setup Google Sheets API Authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Function to get the current date and time in a readable format
const getCurrentTimestamp = () => {
  return new Date().toLocaleString("en-US", { timeZone: "UTC" });
};

// Function to validate phone number format
const isValidPhone = (phone) => /^\+?\d{10,15}$/.test(phone);

async function appendToSheet({ name, phone, utmData, referrer }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = getCurrentTimestamp();
    const values = [
      [
        timestamp, name, phone, referrer,
        utmData.utm_source || '', utmData.utm_medium || '', 
        utmData.utm_campaign || '', utmData.utm_term || '', 
        utmData.utm_content || ''
      ]
    ];

    const resource = { values };

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `${process.env.SHEET_NAME || "QuizFormLeads"}!A:I`,
      valueInputOption: "RAW",
      resource,
    });

    return true;
  } catch (error) {
    console.error("Error appending to sheet:", error.message);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, phone, utmData, referrer } = req.body;

    // Validate data
    if (!name || !phone || !isValidPhone(phone)) {
      return res.status(400).json({ error: "Missing required fields or invalid phone format" });
    }

    const success = await appendToSheet({ name, phone, utmData, referrer });

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
