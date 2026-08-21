import { NextResponse } from 'next/server'

import { dbVerifyCode } from '@/app/services/servicesDB'
import sendEmail from '@/app/services/serviceSendEmail'
//4
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { fio, email, code, message, phone } = body

        if (!email || !code || !message) {
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
        const tasks: Promise<unknown>[] = [
            sendEmail(
                'doc.shev@mail.ru',
                'Сообщение от клиента',
                `<p>ФИО клиента: <b>${fio}</b></p>
                <p>Телефон клиента: <b>${phone}</b></p>
                <p>Email клиента: <b>${email}</b></p>
                <p>Сообщение от клиента: <b>${message}</b></p>`,
                '22 Сообщение от клиента',
            ),
        ]

        const results = await Promise.allSettled(tasks)
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.log('Ошибка в send-code:', index, result.reason)
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
