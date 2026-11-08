import { NextResponse } from 'next/server'

import { dbVerifyCode } from '@/app/serv/servicesDB'
import sendEmail from '@/app/serv/serviceSendEmail'
// import { sendBookingNotifications } from '@/app/serv/sendTG'
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

        //узнаем ip
        const forwardedFor = request.headers.get('x-forwarded-for')
        const clientIp = forwardedFor
            ? forwardedFor.split(',')[0].trim()
            : request.headers.get('x-real-ip') || '127.0.0.1' // защита локальной разработки

        const tasks: Promise<unknown>[] = [
            sendEmail(
                'doc.shev@mail.ru',
                'Сообщение от клиента',

                `)<p>(был написан пользователем на сайте doctor-shev.ru)</p>
                 <p>Ip клиента: <b>${clientIp}</b></p>
                <p>ФИО клиента: <b>${fio}</b></p>
                <p>Телефон клиента: <b>${phone}</b></p>
                <p>Email клиента: <b>${email}</b></p>
                <p>Сообщение от клиента: <b>${message}</b></p>`,
                'Сообщение от клиента',
            ),
        ]
        const adminText = `⚠️ <b>Админ — прислали сообщение через форму сайта\nЗайди посмотри doctor-shev.ru/admin\nТо что написал клиент ${message}`

        // try {
        //     await sendBookingNotifications({
        //         text: adminText,
        //     })
        // } catch {
        //     // Логируем ошибку отправки сообщений, но клиенту отвечаем, что запись прошла успешно это только сообщеие админу
        //     await sendEmail(
        //         'sanek.miron2@gmail.com',
        //         'внимание! ошибка отправки в телегу админу',
        //         'ошибка отправки в телегу админу про бесплатный материал',
        //         'Ошибка отправки в телегу админу',
        //     )
        // }
        await sendEmail(
            'doc.shev@mail.ru',
            'Прислали сообщение через форму сайта',
            adminText,
            'Прислали сообщение через форму сайта',
        )

        const results = await Promise.allSettled(tasks)
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                // console.log('Ошибка в send-code:', index, result.reason)
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
