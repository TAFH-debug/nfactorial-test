import { google } from "googleapis";
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

async function appendToBackup({ name, phone, email, utmData, referrer }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const formattedDate = getCurrentFormattedDate();

    const values = [
      [
        formattedDate, // Дата и время
        name,
        phone,
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
      range: `${process.env.BACKUP_SHEET_NAME || "BackupLeads"}!A:I`, // Подогнать диапазон
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
  // Set CORS headers for nfactorial.school
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://nfactorial.school');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    const { name, phone, email, utmData, referrer, formType } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { spreadsheetId, sheetName } = getSheetConfig(formType);

    const formattedDate = getCurrentFormattedDate();

    const success = await appendToSheet({
      spreadsheetId,
      sheetName,
      values: [
        [
          formattedDate, // Дата и время
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
      return res
        .status(200)
        .json({ message: "Data successfully submitted and backed up" });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to submit or backup data" });
    }
  } else {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
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
      sheetName: "JobsQuizFormLeads",
    };
  }
  throw new Error("Unknown form type");
};