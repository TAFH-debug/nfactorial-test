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

const getCurrentDateComponents = () => {
  const date = new Date();

  // Format the date using Almaty timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Almaty",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Extract formatted parts
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;

  return { year, month, day };
};

async function appendToSheet({ spreadsheetId, sheetName, values }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const resource = { values };

    // Append data to the sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:K`, // Update range to match new format
      valueInputOption: "RAW",
      resource,
    });

    return result.status === 200;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    return false;
  }
}

async function appendToBackup({ name, phone, email, utmData, referrer }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const { year, month, day } = getCurrentDateComponents();

    const values = [
      [
        "Quiz leads", // Source
        year,
        month,
        day,
        name,
        phone,
        email || "", // Email may be optional
        referrer,
        utmData?.utm_source || "",
        utmData?.utm_medium || "",
        utmData?.utm_campaign || "",
        utmData?.utm_term || "",
        utmData?.utm_content || "",
      ],
    ];

    const resource = { values };

    // Append data to the backup sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.BACKUP_SHEET_ID, // Backup spreadsheet ID from .env
      range: `${process.env.BACKUP_SHEET_NAME || "BackupLeads"}!A:M`, // Structure matches backup format
      valueInputOption: "RAW",
      resource,
    });

    return result.status === 200;
  } catch (error) {
    console.error("Error appending to backup sheet:", error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, phone, email, utmData, referrer, formType } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { spreadsheetId, sheetName } = getSheetConfig(formType);

    const success = await appendToSheet({
      spreadsheetId,
      sheetName,
      values: [
        [
          getCurrentDateComponents().year,
          getCurrentDateComponents().month,
          getCurrentDateComponents().day,
          name,
          phone,
          referrer,
          utmData?.utm_source || "",
          utmData?.utm_medium || "",
          utmData?.utm_campaign || "",
          utmData?.utm_term || "",
          utmData?.utm_content || "",
        ],
      ],
    });

    const backupSuccess = await appendToBackup({
      name,
      phone,
      email,
      utmData,
      referrer,
    });

    if (success && backupSuccess) {
      return res.status(200).json({ message: "Data successfully submitted and backed up" });
    } else {
      return res.status(500).json({ error: "Failed to submit or backup data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper function to get the right spreadsheetId and sheetName
const getSheetConfig = (formType) => {
  if (formType === "first") {
    return {
      spreadsheetId: process.env.FIRST_SHEET_ID,
      sheetName: "QuizFormLeads",
    };
  } else if (formType === "second") {
    return {
      spreadsheetId: process.env.SECOND_SHEET_ID,
      sheetName: "UxuiFormLeads",
    };
  } else if (formType === "third") {
    return {
      spreadsheetId: process.env.THIRD_SHEET_ID,
      sheetName: "SatFormLeads",
    };
  } else if (formType === "job") {
    return {
      spreadsheetId: process.env.JOB_SHEET_ID,
      sheetName: "SatFormLeads",
    };
  }
  throw new Error("Unknown form type");
};
