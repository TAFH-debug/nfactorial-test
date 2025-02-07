import { google } from "googleapis";
import rateLimit from "express-rate-limit";

// Google API Authentication setup
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    projectId: process.env.GOOGLE_PROJECT_ID,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Sheet ID mapping
const SHEET_IDS = {
    PROGRAMMING_SHEET_ID: process.env.PROGRAMMING_SHEET_ID,
    PRODUCT_SHEET_ID: process.env.PRODUCT_SHEET_ID,
    QA_SHEET_ID: process.env.QA_SHEET_ID,
    DATA_SHEET_ID: process.env.DATA_SHEET_ID,
    BACKUP_SHEET_ID: process.env.BACKUP_SHEET_MINI_ID // Add backup sheet ID
};

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

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again tomorrow." },
    headers: true,
});

async function appendToSheet({ spreadsheetId, values }) {
    try {
        const sheets = google.sheets({ version: "v4", auth });
        const resource = { values };
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `FreeCourses!A:K`,
            valueInputOption: "RAW",
            resource,
        });
        return result.status === 200;
    } catch (error) {
        console.error("Error appending to sheet:", error);
        return false;
    }
}

async function appendToMultipleSheets(data, courseSheetId) {
    const formattedDate = getCurrentFormattedDate();
    const rowData = [
        formattedDate,
        data.name,
        data.phone,
        data.email || "",
        data.course,
        data.referrer || "",
        data.utmData?.utm_source || "",
        data.utmData?.utm_medium || "",
        data.utmData?.utm_campaign || "",
        data.utmData?.utm_term || "",
        data.utmData?.utm_content || "",
    ];

    // Write to course-specific sheet
    const courseSheetSuccess = await appendToSheet({
        spreadsheetId: courseSheetId,
        values: [rowData],
    });

    // Write to backup sheet
    const backupSheetSuccess = await appendToSheet({
        spreadsheetId: SHEET_IDS.BACKUP_SHEET_ID,
        values: [rowData],
    });

    return courseSheetSuccess && backupSheetSuccess;
}

export default async function handler(req, res) {
    // CORS protection
    const allowedOrigins = ["https://www.nfactorial.school"];
    const origin = req.headers.origin;
    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "Access denied by CORS policy" });
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    // Apply rate limiting
    await new Promise((resolve, reject) => {
        limiter(req, res, (result) => 
            result instanceof Error ? reject(result) : resolve(result)
        );
    });

    // User-Agent check
    const userAgent = req.headers["user-agent"] || "";
    const blockedAgents = ["curl", "wget", "PostmanRuntime", "Python", "bot", "crawl", "spider"];
    if (blockedAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
        return res.status(403).json({ error: "Access denied: suspicious activity detected" });
    }

    if (req.method === "POST") {
        const { name, phone, email, course, sheetId, utmData, referrer } = req.body;

        // Validation
        if (!name || !phone || !course || !sheetId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Get the actual sheet ID from environment variables
        const actualSheetId = SHEET_IDS[sheetId];
        if (!actualSheetId) {
            return res.status(400).json({ error: "Invalid sheet ID" });
        }

        // Write to both course-specific and backup sheets
        const success = await appendToMultipleSheets(
            { name, phone, email, course, utmData, referrer },
            actualSheetId
        );

        if (success) {
            return res.status(200).json({ message: "Data successfully submitted" });
        } else {
            return res.status(500).json({ error: "Failed to submit data" });
        }
    } else {
        res.setHeader("Allow", ["POST", "OPTIONS"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}