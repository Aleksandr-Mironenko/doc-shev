import { NextResponse } from 'next/server'
import { dbGeSucsessbyPassworsEmail } from '@/app/services/servicesDB' // Укажите правильный путь

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { roomId, email, password } = body

        // Базовая валидация: проверяем, что все поля переданы
        if (!roomId || !email || !password) {
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

        if (result.success && result.link) {
            return NextResponse.json({ success: true, link: result.link })
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
