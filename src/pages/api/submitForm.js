import { google } from "googleapis";

// Setup Google Sheets API Authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replacing escaped newlines
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Function to get the current date and time in a readable format
const getCurrentTimestamp = () => {
  const date = new Date();
  return date.toLocaleString("en-US", { timeZone: "UTC" }); // Adjust timeZone as needed
};

async function appendToSheet(name, phone) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    // Prepare the data to append, including the current timestamp
    const timestamp = getCurrentTimestamp();
    const values = [[timestamp, name, phone]];

    const resource = { values };

    // Append data to the sheet, adding it to columns A, B, and C
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID, // Use Google Sheets ID from environment
      range: `${process.env.SHEET_NAME || "QuizFormLeads"}!A:C`, // Default to "QuizFormLeads" or use SHEET_NAME from .env
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
  if (req.method === "POST") {
    const { name, phone } = req.body;

    // Validate data
    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const success = await appendToSheet(name, phone);

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
