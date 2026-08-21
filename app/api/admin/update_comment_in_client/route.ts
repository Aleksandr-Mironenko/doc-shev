import { dbUpdateСommentInClient } from '@/app/services/adminServices'
import { NextRequest, NextResponse } from 'next/server'
// import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { clientId, comment } = body

        if (!clientId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Идентификатор клиента не передан.',
                },
                { status: 400 },
            )
        }

        const result = await dbUpdateСommentInClient(clientId, comment)
        if (result) {
            return NextResponse.json({
                success: true,
                message: 'Комментарий успешно сохранен.',
            })
        }
    } catch (error) {
        console.error('Ошибка при сохранении комментария:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Ошибка сервера при сохранении комментария.',
            },
            { status: 500 },
        )
    }
}
