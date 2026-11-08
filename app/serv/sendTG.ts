interface SendNotificationParams {
    text: string | null // ID пользователя (клиента) в Telegram, если есть
}

export async function sendBookingNotifications({
    text,
}: SendNotificationParams) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID // Чат или ID администратора  TELEGRAM_ADMIN_ID

    if (!token) {
        console.error('TELEGRAM_BOT_TOKEN is not set')
        return
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`

    // 1. Уведомление для администратора (отправляем всегда)
    if (adminChatId) {
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: adminChatId,
                    text: text,
                    parse_mode: 'HTML',
                }),
                cache: 'no-store',
            })
        } catch (error) {
            console.error('Failed to send notification to admin:', error)
        }
    }
}
