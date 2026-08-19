import { NextResponse } from 'next/server'
import {
    dbDeleteTimeSlot,
    dbGetOrderById,
    dbUpdatePaymentAndLink,
} from '@/app/services/servicesDB'
import serviceCreateMtsLink from '@/app/services/servicesCreateMtslLnk'
import sendEmail from '@/app/services/serviceSendEmail'
//5
export async function POST(request: Request) {
    console.log('финал')
    try {
        const body = await request.json()
        const { isPaymentSuccess, orderId } = body
        console.log(body)
        // { isPaymentSuccess: true, orderId: null }
        if (!isPaymentSuccess) {
            return NextResponse.json(
                { success: false, message: 'Оплата не подтверждена' },
                { status: 400 },
            )
        }

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Не указан ID заказа' },
                { status: 400 },
            )
        }
        console.log(orderId)
        // 1. Получаем данные заказа по ID
        const orderData = await dbGetOrderById(orderId)
        if (!orderData.success || !orderData.data) {
            return NextResponse.json(
                { success: false, message: 'Заказ не найден' },
                { status: 404 },
            )
        }

        const { fio, email, date, time } = orderData.data

        // // 2. Генерируем ссылку MTS Link
        // const mtsResult = await serviceCreateMtsLink(date, time, fio)

        // if (!mtsResult || !mtsResult.success || !mtsResult.link) {
        //     return NextResponse.json(
        //         { success: false, message: 'Ошибка создания видеовстречи' },
        //         { status: 500 },
        //     )
        // }

        // 3. Обновляем статус оплаты и сохраняем ссылку в БД
        const isDbUpdated = await dbUpdatePaymentAndLink(orderId)
        // isDbUpdated?.link
        // isDbUpdated?.id
        // isDbUpdated?.room_id
        if (!isDbUpdated) {
            return NextResponse.json(
                { success: false, message: 'Ошибка обновления БД' },
                { status: 500 },
            )
        }

        // 4. Удаляем занятый слот
        const deleteSlot = await dbDeleteTimeSlot(date, time)
        if (!deleteSlot) {
            return NextResponse.json(
                { success: false, message: 'Ошибка удаления занятого слота' },
                { status: 500 },
            )
        }

        // 5. Отправляем письмо с подтверждением и ссылкой
        const emailHtml = `
            <h2>Здравствуйте, ${fio}!</h2>
            <p>Ваша консультация успешно оплачена и подтверждена.</p>
            <p><strong>Дата:</strong> ${date}</p>
            <p><strong>Время:</strong> ${time}</p>
            <p><strong>Ссылка на встречу:</strong> <a href="https://doc-shev.relaxdev.ru/room/${isDbUpdated.room_id}">${`https://doc-shev.relaxdev.ru/room/${isDbUpdated.room_id}`}</a></p>
            <p>Ждем вас!</p>
        `

        await sendEmail(
            email,
            'Оплата подтверждена: ссылка на консультацию',
            emailHtml,
            'Информация о предстоящей консультации',
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Критическая ошибка на этапе финализации оплаты:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
