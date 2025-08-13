import { google } from "googleapis";
import rateLimit from "express-rate-limit";

// Настройка аутентификации Google API
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    projectId: process.env.GOOGLE_PROJECT_ID,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Функция получения текущей даты и времени
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

// Rate limiting - ограничение до 100 запросов в день с одного IP
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 день
    max: 100, // Максимум 100 запросов в день
    message: { error: "Too many requests, please try again tomorrow." },
    headers: true, // Добавляет заголовки с информацией о лимите
});

// Функция добавления данных в Google Sheets
async function appendToSheet({ spreadsheetId, sheetName, values }) {
    try {
        const sheets = google.sheets({ version: "v4", auth });
        const resource = { values };
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:Z`, // Расширяем диапазон для всех колонок
            valueInputOption: "RAW",
            resource,
        });
        return result.status === 200;
    } catch (error) {
        console.error("Error appending to sheet:", error);
        return false;
    }
}

// API-обработчик с защитой
export default async function handler(req, res) {
    // CORS защита - разрешен доступ только с вашего сайта
    const allowedOrigins = ["https://www.nfactorial.school", "https://test.nfactorial.school"];
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
    
    // Rate limiting
    await new Promise((resolve, reject) => {
        limiter(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
    });
    
    // Проверка заголовка User-Agent
    const userAgent = req.headers["user-agent"] || "";
    const blockedAgents = [
        "curl",
        "wget",
        "PostmanRuntime",
        "Python",
        "bot",
        "crawl",
        "spider",
    ];
    
    if (blockedAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
        return res.status(403).json({ error: "Access denied: suspicious activity detected" });
    }
    
    if (req.method === "POST") {
        const { 
            // Основные данные
            name, 
            phone, 
            email,
            date,
            
            // UTM параметры
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            
            // Click IDs
            fbclid,
            gclid,
            yclid,
            
            // Данные о страницах
            utm_referrer,
            landing_page,
            form_page_url,
            
            // Атрибуционные данные
            attribution_type,
            attribution_timestamp,
            attribution_window,
            browser_id,
            session_id,
            page_view_count,
            
            // Технические данные
            device_type,
            screen_resolution,
            timezone,
            language,
            
            // Для обратной совместимости
            utmData,
            referrer
        } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const spreadsheetId = process.env.WEBSITE_SHEET_ID;
        const sheetName = process.env.WEBSITE_SHEET_NAME || "FormLeads";
        const formattedDate = date || getCurrentFormattedDate();
        
        // Формируем строку для Google Sheets в правильном порядке колонок
        const rowData = [
            formattedDate,                                    // Date
            name,                                             // Name
            phone,                                            // Phone
            email || "",                                      // Email
            utm_referrer || referrer || "",                  // utm_referrer
            utm_source || utmData?.utm_source || "",         // utm_source
            utm_medium || utmData?.utm_medium || "",         // utm_medium
            utm_campaign || utmData?.utm_campaign || "",     // utm_campaign
            utm_term || utmData?.utm_term || "",             // utm_term
            utm_content || utmData?.utm_content || "",       // utm_content
            fbclid || "",                                     // fbclid
            gclid || "",                                      // gclid
            yclid || "",                                      // yclid
            landing_page || "",                               // Landing_Page
            attribution_type || "",                           // Attribution_Type
            browser_id || "",                                 // Browser_ID
            session_id || "",                                 // Session_ID
            page_view_count || "",                            // Page_View_Count
            attribution_timestamp || "",                      // Attribution_Timestamp
            form_page_url || "",                              // Form_Page_URL
            device_type || "",                                // Device_Type
            attribution_window || "",                         // Attribution_Window
            screen_resolution || "",                          // Screen_Resolution
            timezone || "",                                   // Timezone
            language || ""                                    // Language
        ];
        
        const success = await appendToSheet({
            spreadsheetId,
            sheetName,
            values: [rowData],
        });
        
        if (success) {
            // Логируем успешную отправку (опционально)
            if (process.env.NODE_ENV === 'development') {
                console.log('Lead saved:', {
                    name,
                    phone,
                    utm_source: utm_source || utmData?.utm_source,
                    attribution_type,
                    device_type
                });
            }
            
            return res.status(200).json({ 
                message: "Data successfully submitted",
                leadId: `${Date.now()}-${Math.random().toString(36).substring(7)}`
            });
        } else {
            return res.status(500).json({ error: "Failed to submit data" });
        }
    } else {
        res.setHeader("Allow", ["POST", "OPTIONS"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}