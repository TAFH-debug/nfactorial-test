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

async function appendToSheet({ name, phone, utmData, referrer, spreadsheetId, sheetName }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    // Prepare the data to append, including the current timestamp
    const timestamp = getCurrentTimestamp();
    const values = [
      [timestamp, name, phone, referrer, utmData.utm_source, utmData.utm_medium, utmData.utm_campaign, utmData.utm_term, utmData.utm_content]
    ];

    const resource = { values };

    // Append data to the sheet, adding it to columns A to I
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,  // Use the dynamically passed spreadsheetId
      range: `${sheetName}!A:I`, // Use the dynamically passed sheetName
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
    const { name, phone, utmData, referrer, formType } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Determine parameters for each form
    const { spreadsheetId, sheetName } = getSheetConfig(formType);

    const success = await appendToSheet({
      name,
      phone,
      utmData,
      referrer,
      spreadsheetId,
      sheetName,
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
  }
  throw new Error("Unknown form type");
};

