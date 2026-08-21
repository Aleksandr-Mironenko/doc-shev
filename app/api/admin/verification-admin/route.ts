import { NextResponse } from 'next/server'

import { dbGetSucsessbyRoomId } from '@/app/services/adminServices'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { roomId } = body

        // Базовая валидация: проверяем, что все поля переданы
        if (!roomId) {
            return NextResponse.json(
                { success: false, error: 'Отсутствует roomId' },
                { status: 400 },
            )
        }

        // Запрашиваем БД
        const result = await dbGetSucsessbyRoomId(roomId)

        if (result.success && result.link && result.clientId) {
            return NextResponse.json({
                success: true,
                link: result.link,
                clientId: result.clientId,
            })
        } else {
            // Если заказ не найден (неверный код или email)
            return NextResponse.json(
                { success: false, error: 'Неверный email или код' },
                { status: 401 },
            )
        }
    } catch (error) {
        console.error('Ошибка в POST /api/get-room-link:', error)
        return NextResponse.json(
            { success: false, error: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
