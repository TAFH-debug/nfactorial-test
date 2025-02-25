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

    // Проверим существование листа и создадим его, если нужно
    try {
      // Получаем информацию о листах
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties.title',
      });
      
      // Проверяем, существует ли наш лист
      const sheetExists = sheetsInfo.data.sheets.some(
        sheet => sheet.properties.title === sheetName
      );
      
      // Если лист не существует, создаем его
      if (!sheetExists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          resource: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });
        console.log(`Created new sheet: ${sheetName}`);
      }
    } catch (checkError) {
      console.error("Error checking/creating sheet:", checkError);
      // Продолжаем работу, возможно лист уже существует
    }

    const resource = { values };

    // Append data to the sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:K`, // Обновленный диапазон для включения столбца компании
      valueInputOption: "RAW",
      resource,
    });

    return result.status === 200;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    return false;
  }
}

async function appendToBackup({ name, phone, email, company, utmData, referrer }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const sheetName = process.env.BACKUP_SHEET_NAME || "BackupLeads";
    const spreadsheetId = process.env.BACKUP_SHEET_ID;

    // Проверим существование листа и создадим его, если нужно
    try {
      // Получаем информацию о листах
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties.title',
      });
      
      // Проверяем, существует ли наш лист
      const sheetExists = sheetsInfo.data.sheets.some(
        sheet => sheet.properties.title === sheetName
      );
      
      // Если лист не существует, создаем его
      if (!sheetExists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          resource: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });
        console.log(`Created new sheet: ${sheetName}`);
      }
    } catch (checkError) {
      console.error("Error checking/creating sheet:", checkError);
      // Продолжаем работу, возможно лист уже существует
    }

    const formattedDate = getCurrentFormattedDate();

    const values = [
      [
        formattedDate, // Дата и время
        name,
        phone,
        email || "",
        company || "", // Added company field
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
      spreadsheetId,
      range: `${sheetName}!A:K`, // Updated range for company field
      valueInputOption: "RAW",
      resource,
    });

    return result.status === 200;
  } catch (error) {
    console.error("Error appending to backup sheet:", error);
    return false;
  }
}

// New function to send data to the company-specific sheet
async function appendToCompanySheet({ name, phone, email, company, utmData, referrer }) {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const sheetName = process.env.COMPANY_SHEET_NAME || "CompanyLeads";
    const spreadsheetId = process.env.COMPANY_SHEET_ID;

    // Проверим существование листа и создадим его, если нужно
    try {
      // Получаем информацию о листах
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties.title',
      });
      
      // Проверяем, существует ли наш лист
      const sheetExists = sheetsInfo.data.sheets.some(
        sheet => sheet.properties.title === sheetName
      );
      
      // Если лист не существует, создаем его
      if (!sheetExists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          resource: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });
        console.log(`Created new sheet: ${sheetName}`);
      }
    } catch (checkError) {
      console.error("Error checking/creating sheet:", checkError);
      // Продолжаем работу, возможно лист уже существует
    }

    const formattedDate = getCurrentFormattedDate();

    const values = [
      [
        formattedDate, // Дата и время
        name,
        phone,
        email || "",
        company, // Company name
        referrer,
        utmData?.utm_source || "",
        utmData?.utm_medium || "",
        utmData?.utm_campaign || "",
        utmData?.utm_term || "",
        utmData?.utm_content || "",
      ],
    ];

    const resource = { values };

    // Append data to the company sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:K`,
      valueInputOption: "RAW",
      resource,
    });

    return result.status === 200;
  } catch (error) {
    console.error("Error appending to company sheet:", error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, phone, email, company, utmData, referrer, formType = "company" } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Всегда записываем в company sheet
      const success = await appendToCompanySheet({
        name,
        phone,
        email, 
        company: company || "", // Компания может быть пустой, но параметр всегда присутствует
        utmData,
        referrer,
      });

      if (success) {
        return res
          .status(200)
          .json({ message: "Data successfully submitted" });
      } else {
        return res
          .status(500)
          .json({ error: "Failed to submit data" });
      }
    } catch (error) {
      console.error("Unexpected error in handler:", error);
      return res
        .status(500)
        .json({ error: "Server error", message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper function to get the right spreadsheetId and sheetName
const getSheetConfig = (formType) => {
  // Для b2b API по умолчанию используем COMPANY_SHEET_ID
  const defaultSpreadsheetId = process.env.COMPANY_SHEET_ID || process.env.BACKUP_SHEET_ID;
  
  if (!defaultSpreadsheetId) {
    throw new Error("No spreadsheet ID configured. Please set COMPANY_SHEET_ID or BACKUP_SHEET_ID in your environment variables.");
  }

  if (formType === "first") {
    return {
      spreadsheetId: process.env.FIRST_SHEET_ID || defaultSpreadsheetId,
      sheetName: "QuizFormLeads",
    };
  } else if (formType === "second") {
    return {
      spreadsheetId: process.env.SECOND_SHEET_ID || defaultSpreadsheetId,
      sheetName: "UxuiFormLeads",
    };
  } else if (formType === "third") {
    return {
      spreadsheetId: process.env.THIRD_SHEET_ID || defaultSpreadsheetId,
      sheetName: "SatFormLeads",
    };
  } else if (formType === "job") {
    return {
      spreadsheetId: process.env.JOB_SHEET_ID || defaultSpreadsheetId,
      sheetName: "JobsQuizFormLeads",
    };
  } else if (formType === "company" || formType === "b2b") { // New form types for company leads
    return {
      spreadsheetId: process.env.COMPANY_SHEET_ID || defaultSpreadsheetId,
      sheetName: process.env.COMPANY_SHEET_NAME || "B2BLeads",
    };
  } else { // Default case
    return {
      spreadsheetId: defaultSpreadsheetId,
      sheetName: "B2BLeads",
    };
  }
};