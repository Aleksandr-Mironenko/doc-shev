import { NextResponse } from 'next/server'
import {
    dbCreateClient,
    dbGenerateEmailCode,
    dbUpdateListIpClients,
} from '@/app/services/servicesDB'
import sendEmail from '@/app/services/serviceSendEmail' // Путь скорректируйте под ваш проект
//3
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { fio, phone, email, check, dateConsent_pd, dateConsent_promo } =
            body

        if (!fio || !phone || !email) {
            return NextResponse.json(
                { success: false, message: 'Заполнены не все поля' },
                { status: 400 },
            )
        }

        //узнаем ip
        const forwardedFor = request.headers.get('x-forwarded-for')
        const clientIp = forwardedFor
            ? forwardedFor.split(',')[0].trim()
            : request.headers.get('x-real-ip') || '127.0.0.1' // защита локальной разработки

        // Далее сохраняем clientIp вместе с заказом и датами согласий в PostgreSQL
        // console.log('IP клиента:', clientIp)

        // Записываем клиента в базу
        const createAndCheckClient = await dbCreateClient(
            fio,
            phone,
            email,
            check,
            dateConsent_pd,
            dateConsent_promo,
        )
        if (createAndCheckClient === false) {
            return NextResponse.json(
                { success: false, message: 'Временные рамки нарушены' },
                { status: 200 },
            )
        }
        const sendIpInList = await dbUpdateListIpClients(
            createAndCheckClient,
            clientIp,
        )
        if (sendIpInList === false) {
            return NextResponse.json(
                { success: false, message: 'ip не записан' },
                { status: 200 },
            )
        }

        // Генерируем код
        const code = await dbGenerateEmailCode(email)

        // Отправка письма
        const tasks: Promise<unknown>[] = [
            sendEmail(
                email,
                'Код подтверждения на консультацию',
                `<p>Ваш код для подтверждения записи на консультацию: <strong>${code}</strong></p><p>Код действителен 15 минут</p>
                 <p>Для завершения бронирования потребуется подтвердить согласие с условиями Публичной оферты. 
                 <p>Пожалуйста, заранее ознакомьтесь с <a style={{ textDecoration: 'underline', color: 'black', fontWeight: 700, }} target="_blank" rel="noopener noreferrer" href="/public-offer" > <b>Публичной офертой на оказание услуг</b> </a>  </p>`,

                'Проверочный код на консультацию',
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
        console.error(
            'Ошибка на этапе создания клиента и отправки кода:',
            error,
        )
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
