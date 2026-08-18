import { NextResponse } from 'next/server'
// Укажите правильный путь к файлу, где лежит ваша функция dbNullSpecificTime
import { dbNullSpecificTime } from '@/app/services/servicesDB'

export async function POST(request: Request) {
    try {
        // Читаем JSON из тела запроса
        const body = await request.json()
        const { dateString, timeString } = body

        // Проверяем, что клиент прислал необходимые данные
        if (!dateString || !timeString) {
            return NextResponse.json(
                { success: false, message: 'Не переданы дата или время' },
                { status: 400 },
            )
        }

        // Обращаемся к серверной функции
        const result = await dbNullSpecificTime(dateString, timeString)

        // В зависимости от успеха функции возвращаем соответствующий статус
        if (result.success) {
            return NextResponse.json(result, { status: 200 })
        } else {
            // Если функция вернула success: false (например, слот не найден)
            return NextResponse.json(result, { status: 400 })
        }
    } catch (error) {
        console.error('Ошибка в эндпоинте /api/cancel-time:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
