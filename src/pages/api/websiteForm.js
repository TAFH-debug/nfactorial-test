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
    return new Intl.DateTimeFormat("en-GB", options).format(date).replace(",", "");
};

// Функция форматирования timestamp в читаемую дату
const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "";
        
        const options = {
            timeZone: "Asia/Almaty",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Intl.DateTimeFormat("en-GB", options).format(date).replace(",", "");
    } catch (e) {
        return "";
    }
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
            range: `${sheetName}!A:Y`, // 25 колонок (A-Y)
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
    const allowedOrigins = [
        "https://www.nfactorial.school", 
        "https://test.nfactorial.school",
        "http://localhost:3000" // для локальной разработки
    ];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    
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
            date, // Игнорируем ISO date из фронтенда
            
            // UTM параметры (проверяем оба варианта)
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
            return res.status(400).json({ error: "Missing required fields: name and phone" });
        }
        
        const spreadsheetId = process.env.WEBSITE_SHEET_ID;
        const sheetName = process.env.WEBSITE_SHEET_NAME || "FormLeads";
        
        // Используем читаемый формат даты вместо ISO
        const formattedDate = getCurrentFormattedDate();
        
        // Определяем правильный attribution_type если он неверный
        let finalAttributionType = attribution_type;
        if (fbclid && (!attribution_type || attribution_type === 'direct')) {
            finalAttributionType = 'click';
        } else if (gclid && (!attribution_type || attribution_type === 'direct')) {
            finalAttributionType = 'click';
        } else if (utm_source && !attribution_type) {
            finalAttributionType = 'utm';
        } else if (!attribution_type) {
            finalAttributionType = 'direct';
        }
        
        // Формируем строку для Google Sheets в правильном порядке колонок
        const rowData = [
            formattedDate,                                    // A: Date (читаемый формат)
            name,                                             // B: Name
            phone,                                            // C: Phone
            email || "",                                      // D: Email
            utm_referrer || referrer || "",                  // E: utm_referrer
            utm_source || utmData?.utm_source || "",         // F: utm_source
            utm_medium || utmData?.utm_medium || "",         // G: utm_medium
            utm_campaign || utmData?.utm_campaign || "",     // H: utm_campaign
            utm_term || utmData?.utm_term || "",             // I: utm_term
            utm_content || utmData?.utm_content || "",       // J: utm_content
            fbclid || "",                                     // K: fbclid
            gclid || "",                                      // L: gclid
            yclid || "",                                      // M: yclid
            landing_page || "",                               // N: Landing_Page
            finalAttributionType,                             // O: Attribution_Type (исправленный)
            browser_id || "",                                 // P: Browser_ID
            session_id || "",                                 // Q: Session_ID
            page_view_count || "1",                           // R: Page_View_Count
            formatTimestamp(attribution_timestamp),           // S: Attribution_Timestamp (читаемый формат)
            form_page_url || "",                              // T: Form_Page_URL
            device_type || "",                                // U: Device_Type
            attribution_window || "",                         // V: Attribution_Window
            screen_resolution || "",                          // W: Screen_Resolution (если добавите колонку)
            timezone || "",                                   // X: Timezone (если добавите колонку)
            language || ""                                    // Y: Language (если добавите колонку)
        ];
        
        const success = await appendToSheet({
            spreadsheetId,
            sheetName,
            values: [rowData],
        });
        
        if (success) {
            // Логируем для отладки
            console.log('✅ Lead saved:', {
                name,
                phone,
                utm_source: utm_source || utmData?.utm_source || 'none',
                attribution_type: finalAttributionType,
                browser_id: browser_id ? 'present' : 'missing',
                session_id: session_id ? 'present' : 'missing'
            });
            
            return res.status(200).json({ 
                message: "Data successfully submitted",
                leadId: `${Date.now()}-${Math.random().toString(36).substring(7)}`
            });
        } else {
            console.error('❌ Failed to save lead');
            return res.status(500).json({ error: "Failed to submit data" });
        }
    } else {
        res.setHeader("Allow", ["POST", "OPTIONS"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}