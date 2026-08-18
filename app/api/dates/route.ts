import { NextResponse } from 'next/server'
import { dbGetAvailableDates } from '@/app/services/servicesDB'

export async function POST() {
    try {
        const { dates, success } = await dbGetAvailableDates()

        // Если функция БД сама вернула success: false (например, внутри упал catch)
        if (!success) {
            return NextResponse.json(
                { success: false, dates: [] },
                { status: 500 },
            )
        }

        return NextResponse.json({ success: true, dates })
    } catch (error) {
        console.error('Ошибка в эндпоинте получения дат:', error)
        return NextResponse.json({ success: false, dates: [] }, { status: 500 })
    }
}
