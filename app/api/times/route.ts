import { NextResponse } from 'next/server'
import { dbGetAvailableTimes } from '@/app/services/servicesDB'

// 1
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { date } = body

        if (!date) {
            return NextResponse.json(
                { success: false, message: 'Параметр date обязателен' },
                { status: 400 },
            )
        }

        const times = await dbGetAvailableTimes(date)
        return NextResponse.json(times)
    } catch (error) {
        console.error('Ошибка получения времени:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
