import { NextResponse } from 'next/server'
import { dbCheckSpecificTime } from '@/app/services/servicesDB'
//2
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { dateString, timeString } = body

        if (!dateString || !timeString) {
            return NextResponse.json(
                { success: false, message: 'Не указана дата или время' },
                { status: 400 },
            )
        }

        const result = await dbCheckSpecificTime(dateString, timeString)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Ошибка проверки времени:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
