import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replacing escaped newlines
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Функция для получения текущей отформатированной даты и времени
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

// Функция для добавления данных в Google Sheets
async function appendToSheet({ values }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.COMPANY_SHEET_ID;
    const sheetName = process.env.COMPANY_SHEET_NAME || "Leads";
    
    const resource = { values };

    // Append data to the sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:J`, // Расширенный диапазон для включения компании
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
    const { name, phone, email, company, utmData, referrer } = req.body;

    // Проверка обязательных полей
    if (!name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const formattedDate = getCurrentFormattedDate();

    // Добавляем запись в Google Sheets
    const success = await appendToSheet({
      values: [
        [
          formattedDate, // Дата и время
          name,
          phone,
          email || "",
          company || "", // Новое поле для компании
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