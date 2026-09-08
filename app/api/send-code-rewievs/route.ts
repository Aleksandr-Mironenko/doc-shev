import { NextResponse } from 'next/server'
import {
    dbGenerateEmailCode,
    updateClientReviewsConsent,
} from '@/app/services/servicesDB'
import sendEmail from '@/app/services/serviceSendEmail' // Путь скорректируйте под ваш проект
//3
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, dateConsent_rewiews, consent_rewiews } = body

        if (!consent_rewiews || !dateConsent_rewiews || !email) {
            return NextResponse.json(
                { success: false, message: 'Заполнены не все поля' },
                { status: 400 },
            )
        }
      
        const clientExists = await updateClientReviewsConsent(
            email,
            consent_rewiews,
            dateConsent_rewiews,
        )
        if (!clientExists) {
            return NextResponse.json(
                { success: false, message: 'Клиент не найден в базе данных' },
                { status: 404 },
            )
        }
        // Генерируем код
        const code = await dbGenerateEmailCode(email)

        // Отправка письма
        const tasks: Promise<unknown>[] = [
            sendEmail(
                email,
                'Код подтверждения (отправка сообщения)',
                `<p>Здравствуйте!</p>
                <p>Ваш код для подтверждения электронной почты: <strong>${code}</strong></p>
                <p>Код действителен 15 минут</p>`,
                'Код подтверждения doctor-shev.ru',
            ),
        ]

        const results = await Promise.allSettled(tasks)
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                //  console.log('Ошибка в send-code:', index, result.reason)
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
