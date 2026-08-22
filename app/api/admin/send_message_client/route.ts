import { NextResponse } from 'next/server'

import sendEmail from '@/app/services/serviceSendEmail'
//5
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { message, email } = body

        if (!message) {
            return NextResponse.json(
                { success: false, message: 'Нет сообщения' },
                { status: 400 },
            )
        }
        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Нет электронной почты' },
                { status: 400 },
            )
        }
        const escapeHtml = (text: string) => {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
        }
        const safeMessage = escapeHtml(message)

        const emailHtml = `
    <div style="white-space: pre-wrap;">
        ${safeMessage}
    </div>

    <p>Буду рада если оставите отзыв о нашей консультации!</p>
`

        await sendEmail(
            email,
            'Сообщение после консультации doctor-shev',
            emailHtml,
            'Спасибо за доверие',
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Критическая ошибка на отправки сообщения', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
