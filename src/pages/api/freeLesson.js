// freeLesson.js (API Route)
import { google } from "googleapis";
import rateLimit from "express-rate-limit";

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    projectId: process.env.GOOGLE_PROJECT_ID,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Mapping course names to sheet IDs
const SHEET_MAPPING = {
    "Основы программирования": process.env.PROGRAMMING_SHEET_ID,
    "Продакт-менеджер": process.env.PRODUCT_SHEET_ID,
    "QA-инженер": process.env.QA_SHEET_ID,
    "Дата-аналитик": process.env.DATA_SHEET_ID
};

// Rate limiter setup
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again tomorrow." },
    headers: true,
});

// Get current date in Almaty timezone
const getCurrentFormattedDate = () => {
    const date = new Date();
    const options = {
        timeZone: "Asia/Almaty",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date).replace(",", "");
};

// Function to append data to a specific sheet
async function appendToSheet(spreadsheetId, values) {
    try {
        const sheets = google.sheets({ version: "v4", auth });
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1!A:K", // Using standard range for all sheets
            valueInputOption: "RAW",
            resource: { values: [values] },
        });
        return result.status === 200;
    } catch (error) {
        console.error(`Error appending to sheet ${spreadsheetId}:`, error);
        return false;
    }
}

export default async function handler(req, res) {
    // CORS setup
    const allowedOrigins = ["https://www.nfactorial.school", "https://test.nfactorial.school"];
    const origin = req.headers.origin;

    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "Access denied by CORS policy" });
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Rate limiting
    try {
        await new Promise((resolve, reject) => {
            limiter(req, res, (result) => {
                if (result instanceof Error) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        return res.status(429).json({ error: "Too many requests" });
    }

    if (req.method === "POST") {
        try {
            const { name, phone, email, course, utmData, referrer } = req.body;

            // Validation
            if (!name || !phone || !course) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Get correct sheet ID for the course
            const courseSheetId = SHEET_MAPPING[course];
            if (!courseSheetId) {
                return res.status(400).json({ error: "Invalid course selected" });
            }

            const formattedDate = getCurrentFormattedDate();
            const rowData = [
                formattedDate,
                name,
                phone,
                email || "",
                course,
                referrer || "",
                utmData?.utm_source || "",
                utmData?.utm_medium || "",
                utmData?.utm_campaign || "",
                utmData?.utm_term || "",
                utmData?.utm_content || "",
            ];

            // Write to course-specific sheet
            const courseSheetSuccess = await appendToSheet(courseSheetId, rowData);

            // Write to backup sheet
            const backupSheetSuccess = await appendToSheet(process.env.BACKUP_SHEET_ID, rowData);

            if (courseSheetSuccess && backupSheetSuccess) {
                return res.status(200).json({ message: "Data successfully submitted" });
            } else {
                throw new Error("Failed to write to one or both sheets");
            }
        } catch (error) {
            console.error("Error processing request:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.setHeader("Allow", ["POST", "OPTIONS"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}