// interface SendNotificationParams {
//     text: string | null // ID пользователя (клиента) в Telegram, если есть
// }

// export async function sendBookingNotifications({
//     text,
// }: SendNotificationParams) {
//     const token = process.env.TELEGRAM_BOT_TOKEN
//     const adminChatId = process.env.TELEGRAM_ADMIN_ID // Чат или ID администратора  TELEGRAM_ADMIN_ID    TELEGRAM_ADMIN_CHAT_ID

//     if (!token) {
//         console.error('TELEGRAM_BOT_TOKEN is not set')
//         return
//     }

//     const url = `https://api.telegram.org/bot${token}/sendMessage`

//     // 1. Уведомление для администратора (отправляем всегда)
//     if (adminChatId) {
//         try {
//             await fetch(url, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     chat_id: adminChatId,
//                     text: text,
//                     parse_mode: 'HTML',
//                 }),
//                 cache: 'no-store',
//             })
//         } catch (error) {
//             console.error('Failed to send notification to admin:', error)
//         }
//     }
// }

interface SendNotificationParams {
    text: string // Текст сообщения для отправки
}

export async function sendBookingNotifications({
    text,
}: SendNotificationParams) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const adminChatId = process.env.TELEGRAM_ADMIN_ID

    if (!token) {
        console.error('TELEGRAM_BOT_TOKEN is not set')
        return
    }

    if (!adminChatId) {
        console.error('TELEGRAM_ADMIN_ID is not set')
        return
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: adminChatId,
                text: text,
                parse_mode: 'HTML',
            }),
            cache: 'no-store',
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Telegram API error:', data)
        }
    } catch (error) {
        console.error(
            'Failed to send notification to admin (network error):',
            error,
        )
    }
}
