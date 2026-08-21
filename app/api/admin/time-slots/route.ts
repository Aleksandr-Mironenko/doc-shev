import { NextResponse } from 'next/server'
import { dbAddAvailableTime } from '@/app/services/adminServices'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { date, time } = body

        if (!date || !time) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Параметры date и time обязательны',
                },
                { status: 400 },
            )
        }

        const result = await dbAddAvailableTime(date, time)

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message || 'Ошибка БД' },
                { status: 500 },
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Ошибка в эндпоинте добавления времени:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
