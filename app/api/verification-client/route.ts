import { NextResponse } from 'next/server'
import {
    dbGeSucsessbyPassworsEmail,
    dbUpdateDataLastConsultAndCounterConsult,
} from '@/app/services/servicesDB' // Укажите правильный путь
import { dbGetSucsessbyRoomId } from '@/app/services/adminServices'
import sendEmail from '@/app/services/serviceSendEmail'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { roomId, email, password, fio } = body

        console.log(roomId, email, password, fio)
        // Базовая валидация: проверяем, что все поля переданы
        if (!roomId || !email || !password || !fio) {
            return NextResponse.json(
                { success: false, error: 'Заполните все поля' },
                { status: 400 },
            )
        }

        // Преобразуем пароль в число, так как в БД функция ждет number
        const numericPassword = Number(password)

        // Запрашиваем БД
        const result = await dbGeSucsessbyPassworsEmail(
            email,
            numericPassword,
            roomId,
        )

        if (!result.success || !result.link) {
            // Если заказ не найден (неверный код или email)
            return NextResponse.json(
                { success: false, error: 'Неверный email или код' },
                { status: 401 },
            )
        }
        const client = await dbGetSucsessbyRoomId(roomId)

        if (!client.success || !client.clientId) {
            return NextResponse.json(
                { success: false, error: 'clientId не найден' },
                { status: 401 },
            )
        }

        const updateClient = await dbUpdateDataLastConsultAndCounterConsult(
            client.clientId,
        )
        if (!updateClient.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Счетчик и последний вход клиента обновить не удалось',
                },
                { status: 500 },
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
        const safeFio = escapeHtml(fio)

        const emailHtml = `
            <h2>Встреча началась и ${safeFio} подключился!</h2>
            <p>Прямая ссылка ${result.link} </p>       
        `

        await sendEmail(
            'doc.shev@mail.ru',
            'Консультация началась',
            emailHtml,
            'Консультация началась doctor-shev',
        )
        if (result.success && result.link) {
            return NextResponse.json({ success: true, link: result.link })
        }
    } catch (error) {
        console.error('Ошибка в POST /api/get-room-link:', error)
        return NextResponse.json(
            { success: false, error: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
