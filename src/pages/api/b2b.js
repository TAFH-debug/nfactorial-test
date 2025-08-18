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

// Функция получения текущей даты и времени в читаемом формате
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
    return new Intl.DateTimeFormat("en-GB", options)
        .format(date)
        .replace(",", "");
};

// Rate limiting - ограничение до 100 запросов в день с одного IP
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 день
    max: 100, // Максимум 100 запросов в день
    message: { error: "Too many requests, please try again tomorrow." },
    headers: true, // Добавляет заголовки с информацией о лимите
});

// Функция добавления данных в Google Sheets
async function appendToSheet({ values }) {
    try {
        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = process.env.COMPANY_SHEET_ID;
        const sheetName = process.env.COMPANY_SHEET_NAME || "Leads";
        const resource = { values };
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:O`, // Сокращено до 15 колонок (A-O)
            valueInputOption: "RAW",
            resource,
        });
        return result.status === 200;
    } catch (error) {
        console.error("Error appending to sheet:", error);
        return false;
    }
}

// API-обработчик
export default async function handler(req, res) {
    // Расширенный список разрешенных доменов
    const allowedOrigins = [
        "https://www.nfactorial.school",
        "https://nfactorial.school",
        "http://localhost:3000" // для локальной разработки
    ];
    const origin = req.headers.origin;
    
    // Проверка CORS с динамическим разрешением
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    
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
        "curl", "wget", "PostmanRuntime",
        "Python", "bot", "crawl", "spider"
    ];
    
    if (blockedAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
        return res.status(403).json({ error: "Access denied: suspicious activity detected" });
    }
    
    if (req.method === "POST") {
        const { 
            // Основные данные формы
            name, 
            phone, 
            company,
            
            // UTM параметры из cookies
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            
            // Click IDs из cookies
            gclid,
            fbclid,
            yclid,
            
            // Дополнительные данные
            utm_referrer,
            timestamp,
            date,
            
            // Для обратной совместимости
            utmData,
            referrer
        } = req.body;
        
        // Валидация обязательных полей
        if (!name || !phone) {
            return res.status(400).json({ error: "Missing required fields: name and phone" });
        }
        
        // Используем читаемый формат даты
        const formattedDate = getCurrentFormattedDate();
        
        // Определяем тип атрибуции на основе UTM данных из cookies
        let attribution_type = 'direct';
        if (utm_source || utmData?.utm_source) {
            attribution_type = 'utm';
        }
        if (gclid) {
            attribution_type = 'google_ads';
        }
        if (fbclid) {
            attribution_type = 'facebook_ads';
        }
        if (yclid) {
            attribution_type = 'yandex_ads';
        }
        
        // Формируем строку для Google Sheets
        const rowData = [
            formattedDate,                                    // A: Date
            name,                                             // B: Name
            phone,                                            // C: Phone
            company || "",                                    // D: Company
            utm_referrer || referrer || "",                  // E: Referrer
            utm_source || utmData?.utm_source || "",         // F: UTM_Source
            utm_medium || utmData?.utm_medium || "",         // G: UTM_Medium
            utm_campaign || utmData?.utm_campaign || "",     // H: UTM_Campaign
            utm_term || utmData?.utm_term || "",             // I: UTM_Term
            utm_content || utmData?.utm_content || "",       // J: UTM_Content
            gclid || "",                                      // K: GCLID
            fbclid || "",                                     // L: FBCLID
            yclid || "",                                      // M: YCLID
            attribution_type,                                 // N: Attribution_Type
            timestamp ? new Date(timestamp).toISOString() : "" // O: Timestamp
        ];
        
        const success = await appendToSheet({
            values: [rowData],
        });
        
        if (success) {
            // Логируем для отладки
            console.log('✅ Lead saved from cookies:', {
                name,
                phone,
                company: company || 'not provided',
                utm_source: utm_source || utmData?.utm_source || 'none',
                attribution_type,
                has_gclid: !!gclid,
                has_fbclid: !!fbclid,
                cookies_utm_found: !!(utm_source || utm_medium || utm_campaign)
            });
            
            return res.status(200).json({ 
                message: "Data successfully submitted",
                leadId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                attribution_type
            });
        } else {
            console.error('❌ Failed to save lead from cookies');
            return res.status(500).json({ error: "Failed to submit data" });
        }
    } else {
        res.setHeader("Allow", ["POST", "OPTIONS"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}