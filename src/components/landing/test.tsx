// ============================================
// ULTRA CLEAN FORM - NO TRACKING AT ALL
// Only validates and sends to backend
// ============================================

import React, { useState, useEffect, CSSProperties } from "react"

export default function TestForm() {
    const [phone, setPhone] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        window.addEventListener("resize", handleResize)
        handleResize() // initial check
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Format phone number as user types
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, "").substring(0, 11)
        if (!numbers) return ""

        let formatted = "+7"
        const phoneBody =
            numbers.startsWith("7") || numbers.startsWith("8")
                ? numbers.substring(1)
                : numbers

        if (phoneBody.length > 0) formatted += ` (${phoneBody.substring(0, 3)}`
        if (phoneBody.length > 3) formatted += `) ${phoneBody.substring(3, 6)}`
        if (phoneBody.length > 6) formatted += `-${phoneBody.substring(6, 8)}`
        if (phoneBody.length > 8) formatted += `-${phoneBody.substring(8, 10)}`

        return formatted
    }

    // Check if phone is valid
    const isPhoneValid = () => {
        const numbers = phone.replace(/\D/g, "")
        return (
            numbers.length === 11 ||
            (numbers.length === 10 && !numbers.startsWith("7"))
        )
    }

    // Get attribution data (keep for backend, but no tracking)
    const getAttributionData = () => {
        const stored = window.getStoredAttribution?.() || {}
        const params = new URLSearchParams(window.location.search)

        return {
            // UTM params
            utm_source: params.get("utm_source") || stored.utm_source || "",
            utm_medium: params.get("utm_medium") || stored.utm_medium || "",
            utm_campaign:
                params.get("utm_campaign") || stored.utm_campaign || "",
            utm_term: params.get("utm_term") || stored.utm_term || "",
            utm_content: params.get("utm_content") || stored.utm_content || "",

            // Click IDs
            fbclid: params.get("fbclid") || stored.fbclid || "",
            gclid: params.get("gclid") || stored.gclid || "",
            yclid: params.get("yclid") || stored.yclid || "",

            // Basic data
            landing_page: stored.landing_page || window.location.href,
            referrer: document.referrer || "",
            browser_id: stored.browser_id || "",
            session_id: stored.session_id || "",
            device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent)
                ? "mobile"
                : "desktop",
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate
        if (!name.trim()) {
            setError("Пожалуйста, введите имя")
            return
        }
        if (!email.trim()) {
            setError("Пожалуйста, введите email")
            return
        }
        if (!isPhoneValid()) {
            setError("Введите номер в формате +7 (XXX) XXX-XX-XX")
            return
        }

        if (isSubmitting) return

        setIsSubmitting(true)
        setError("")

        // Format phone for backend
        const phoneClean = phone.replace(/\D/g, "")
        const formattedPhone = phoneClean.startsWith("8")
            ? "+7" + phoneClean.substring(1)
            : "+" + phoneClean

        // Get attribution for backend
        const attribution = getAttributionData()

        // Prepare data for backend
        const data = {
            name,
            phone: formattedPhone,
            email,
            date: new Date().toISOString(),
            timestamp: Date.now(),
            form_page_url: window.location.href,
            ...attribution,
        }

        try {
            // Send to backend
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

            // Success - redirect
            window.location.href = "https://www.nfactorial.school/thanks"
        } catch (err) {
            setError("Ошибка отправки. Попробуйте еще раз.")
            setIsSubmitting(false)
            console.error("Form error:", err)
        }
    }

    const formStyle2: CSSProperties = {
        ...styles.formStyle2,
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "10px" : "12px",
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                {error && <p style={styles.error}>{error}</p>}
                <div style={formStyle2}>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    required
                    style={{
                        ...styles.input,
                        borderColor:
                            phone && !isPhoneValid() ? "#ff6b6b" : "#EAE7E3",
                    }}
                />
                <button
                    type="submit"
                    disabled={
                        isSubmitting || !name || !email || !isPhoneValid()
                    }
                    style={{
                        ...styles.button,
                        opacity:
                            isSubmitting || !name || !email || !isPhoneValid()
                                ? 0.6
                                : 1,
                        cursor:
                            isSubmitting || !name || !email || !isPhoneValid()
                                ? "not-allowed"
                                : "pointer",
                    }}
                >
                    {isSubmitting ? "Отправка..." : "Получить консультацию"}
                </button>
            </form>
        </div>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        backgroundColor: "rgba(246, 246, 246, 0.2)",
        padding: "8px",
        borderRadius: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        borderRadius: "8px",
    },
    formStyle2: {
        display: "flex",
        width: "auto",
        gap: "12px",
    },
    input: {
        padding: "16px",
        border: "1px solid #EAE7E3",
        borderRadius: "28px",
        fontSize: "18px",
        color: "black",
        width: "100%",
        boxSizing: "border-box",
    },
    button: {
        padding: "16px",
        border: "none",
        borderRadius: "28px",
        backgroundColor: "#E01424",
        color: "white",
        fontSize: "18px",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    error: {
        color: "red",
        fontWeight: "600",
        textAlign: "center",
    },
}
