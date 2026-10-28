import { NextResponse } from 'next/server'

import { dbVerifyCode } from '@/app/serv/servicesDB'
import sendEmail from '@/app/serv/serviceSendEmail'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const { text, email, code } = body

        if (!email || !code || !text) {
            return NextResponse.json(
                { success: false, message: 'Недостаточно данных' },
                { status: 400 },
            )
        }

        // Проверяем пару email + код
        const isValid = await dbVerifyCode(email, code)

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: 'Неверный код' },
                { status: 400 },
            )
        }

        //узнаем ip
        const forwardedFor = request.headers.get('x-forwarded-for')
        const clientIp = forwardedFor
            ? forwardedFor.split(',')[0].trim()
            : request.headers.get('x-real-ip') || '127.0.0.1' // защита локальной разработки

        const tasks: Promise<unknown>[] = [
            sendEmail(
                'doc.shev@mail.ru',
                `Новый отзыв от клиента`,
                `<p>Email клиента: <b>${email}</b></p>
                 <p>Ip клиента: <b>${clientIp}</b></p>
                 <p>Текст отзыва (был написан пользователем на сайте doctor-shev.ru): <b>${text}</b></p>`,
                'Новый отзыв от клиента',
            ),
        ]

        const results = await Promise.allSettled(tasks)
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error('Ошибка в sendEmail:', index, result.reason)
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Ошибка проверки кода:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
