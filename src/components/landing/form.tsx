import { useState, useRef } from "react"

export default function TestForm() {
    const [isPhoneValid, setIsPhoneValid] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const formRef = useRef(null)

    const handleNumberInput = (event) => {
        let value = event.target.value
        let numbers = value.replace(/\D/g, "")
        numbers = numbers.substring(0, 11)

        let formattedNumber = ""

        if (numbers.length > 0) {
            if (numbers[0] === "7" || numbers[0] === "8") {
                formattedNumber = "+7"
                numbers = numbers.substring(1)
            } else if (numbers[0] === "9") {
                formattedNumber = "+7"
            } else if (numbers.length > 1) {
                formattedNumber = "+7"
            }

            if (numbers.length > 0) {
                formattedNumber += " (" + numbers.substring(0, 3)
            }
            if (numbers.length > 3) {
                formattedNumber += ") " + numbers.substring(3, 6)
            }
            if (numbers.length > 6) {
                formattedNumber += "-" + numbers.substring(6, 8)
            }
            if (numbers.length > 8) {
                formattedNumber += "-" + numbers.substring(8, 10)
            }
        }

        event.target.value = formattedNumber

        const isValid =
            numbers.length === 10 ||
            (numbers.length === 11 && numbers[0] === "7")
        setIsPhoneValid(isValid)
        setErrorMessage(
            isValid ? "" : "Введите номер в формате +7 (XXX) XXX-XX-XX"
        )
    }

    // Вспомогательные функции для получения данных
    const getDeviceType = () => {
        const ua = navigator.userAgent
        if (/Mobile|Android|iPhone/i.test(ua)) return "mobile"
        if (/iPad|Tablet/i.test(ua)) return "tablet"
        return "desktop"
    }

    const calculateAttributionWindow = (firstVisitTimestamp) => {
        if (!firstVisitTimestamp) return "same_session"
        const days = Math.floor(
            (Date.now() - firstVisitTimestamp) / (1000 * 60 * 60 * 24)
        )
        if (days === 0) return "same_day"
        if (days === 1) return "1_day"
        if (days <= 3) return "2-3_days"
        if (days <= 7) return "4-7_days"
        return "over_7_days"
    }

    const getCompleteAttributionData = () => {
        // Получаем сохраненные данные из AttributionTracker
        const stored = window.getStoredAttribution
            ? window.getStoredAttribution()
            : {}

        // Проверяем текущий URL (свежие параметры в приоритете)
        const currentParams = new URLSearchParams(window.location.search)

        // Собираем все UTM параметры
        const utmData = {
            utm_source:
                currentParams.get("utm_source") || stored.utm_source || "",
            utm_medium:
                currentParams.get("utm_medium") || stored.utm_medium || "",
            utm_campaign:
                currentParams.get("utm_campaign") || stored.utm_campaign || "",
            utm_term: currentParams.get("utm_term") || stored.utm_term || "",
            utm_content:
                currentParams.get("utm_content") || stored.utm_content || "",
        }

        // Click IDs для рекламных систем
        const clickIds = {
            fbclid: currentParams.get("fbclid") || stored.fbclid || "",
            gclid: currentParams.get("gclid") || stored.gclid || "",
            yclid: currentParams.get("yclid") || stored.yclid || "",
        }

        // Данные о странице и сессии
        const pageData = {
            landing_page: stored.landing_page || "",
            form_page_url: window.location.href,
            utm_referrer: stored.referrer || document.referrer || "",
        }

        // Атрибуционные данные (ИСПРАВЛЕНО)
        const attributionData = {
            attribution_type: stored.attribution_type || "direct",
            attribution_timestamp: stored.captured_at || stored.timestamp || "",
            attribution_window: calculateAttributionWindow(
                stored.captured_at || stored.timestamp
            ),
            browser_id: stored.browser_id || "",
            session_id: stored.session_id || "",
            page_view_count: stored.page_view_count || 1,
        }

        // Технические данные
        const techData = {
            device_type: getDeviceType(),
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || navigator.userLanguage,
        }

        return {
            ...utmData,
            ...clickIds,
            ...pageData,
            ...attributionData,
            ...techData,
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!isPhoneValid || isSubmitting) return

        setIsSubmitting(true)

        const formData = new FormData(event.target)
        const phoneNumber = formData.get("number").replace(/\D/g, "")
        const formattedPhone = phoneNumber.startsWith("8")
            ? "+7" + phoneNumber.substring(1)
            : "+" + phoneNumber

        // Получаем ВСЕ атрибуционные данные
        const attributionData = getCompleteAttributionData()

        // Формируем полный объект данных для отправки
        const data = {
            // Основные данные формы
            name: formData.get("name"),
            phone: formattedPhone,
            email: formData.get("email") || "",

            // Временные метки
            date: new Date().toISOString(),
            timestamp: Date.now(),

            // UTM параметры
            utm_source: attributionData.utm_source,
            utm_medium: attributionData.utm_medium,
            utm_campaign: attributionData.utm_campaign,
            utm_term: attributionData.utm_term,
            utm_content: attributionData.utm_content,

            // Click IDs для рекламных систем
            fbclid: attributionData.fbclid,
            gclid: attributionData.gclid,
            yclid: attributionData.yclid,

            // Данные о страницах
            landing_page: attributionData.landing_page,
            form_page_url: attributionData.form_page_url,
            utm_referrer: attributionData.utm_referrer,

            // Атрибуционные метрики
            attribution_type: attributionData.attribution_type,
            attribution_timestamp: attributionData.attribution_timestamp,
            attribution_window: attributionData.attribution_window,
            browser_id: attributionData.browser_id,
            session_id: attributionData.session_id,
            page_view_count: attributionData.page_view_count,

            // Технические данные
            device_type: attributionData.device_type,
            user_agent: attributionData.user_agent,
            screen_resolution: attributionData.screen_resolution,
            timezone: attributionData.timezone,
            language: attributionData.language,

            // Для обратной совместимости
            referrer: window.location.href || document.referrer || "",
            utmData: {
                utm_source: attributionData.utm_source,
                utm_medium: attributionData.utm_medium,
                utm_campaign: attributionData.utm_campaign,
                utm_term: attributionData.utm_term,
                utm_content: attributionData.utm_content,
            },
        }

        try {
            // Отправляем событие в PostHog
            if (typeof posthog !== "undefined") {
                posthog.capture("form_submitted", {
                    form_name: "website_form",
                    utm_source: data.utm_source,
                    utm_campaign: data.utm_campaign,
                    attribution_type: data.attribution_type,
                    device_type: data.device_type,
                })
            }

            // Отправляем событие в Google Tag Manager
            if (typeof dataLayer !== "undefined") {
                dataLayer.push({
                    event: "form_submit",
                    formName: "website_form",
                    utm_source: data.utm_source,
                    utm_medium: data.utm_medium,
                    utm_campaign: data.utm_campaign,
                    fbclid: data.fbclid,
                    gclid: data.gclid,
                })
            }

            // Отправляем в Facebook Pixel
            if (typeof fbq !== "undefined") {
                fbq("track", "Lead", {
                    content_name: "website_form",
                    currency: "KZT",
                    value: 0,
                    utm_source: data.utm_source,
                    utm_campaign: data.utm_campaign,
                })
            }

            // Отправляем форму на сервер
            const response = await fetch(
                "https://test.nfactorial.school/api/websiteForm",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Успешная отправка
            if (typeof posthog !== "undefined") {
                posthog.capture("form_success", {
                    form_name: "website_form",
                })
            }

            // Переход на страницу благодарности
            window.location.href = "https://www.nfactorial.school/thanks"
        } catch (error) {
            setErrorMessage(
                "Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз."
            )
            setIsSubmitting(false)

            // Трекаем ошибку
            if (typeof posthog !== "undefined") {
                posthog.capture("form_error", {
                    form_name: "website_form",
                    error_message: error.message,
                })
            }
        }
    }

    return (
        <div style={containerStyle}>
            <form ref={formRef} onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="text"
                    name="name"
                    placeholder="Имя"
                    required
                    style={inputStyle}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    style={inputStyle}
                />
                <input
                    type="tel"
                    name="number"
                    placeholder="+7 (___) ___-__-__"
                    required
                    style={inputStyle}
                    onChange={handleNumberInput}
                />
                <button
                    type="submit"
                    disabled={!isPhoneValid || isSubmitting}
                    style={{
                        ...buttonStyle,
                        opacity: !isPhoneValid || isSubmitting ? 0.6 : 1,
                        cursor:
                            !isPhoneValid || isSubmitting
                                ? "not-allowed"
                                : "pointer",
                    }}
                >
                    {isSubmitting ? "Отправка..." : "Получить консультацию"}
                </button>
            </form>
            {errorMessage && <p style={messageStyle}>{errorMessage}</p>}
        </div>
    )
}

const containerStyle = {
    backgroundColor: "rgba(246, 246, 246, 0.2)",
    padding: "8px",
    borderRadius: "20px",
}

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
}

const inputStyle = {
    padding: "16px",
    border: "1px solid #EAE7E3",
    borderRadius: "12px",
    fontSize: "18px",
    color: "black",
}

const buttonStyle = {
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#E01424",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    transition: "all 0.3s ease",
}

const messageStyle = {
    color: "red",
    fontWeight: "600",
    textAlign: "center",
}
