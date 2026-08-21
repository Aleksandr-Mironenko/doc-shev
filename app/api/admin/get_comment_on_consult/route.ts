// Импортируйте вашу базу данных, например:
// import prisma from '@/lib/prisma';
import { dbGetСommentInClient } from '@/app/services/adminServices'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { clientId } = body

        if (!clientId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Идентификатор клиента не передан.',
                },
                { status: 400 },
            )
        }

        const comment = await dbGetСommentInClient(clientId)

        // Заглушка: замените на ваш реальный запрос к БД

        if (!comment) {
            return NextResponse.json({
                success: false,
                comment: 'Нет клиента с таким ID',
            })
        }

        return NextResponse.json({
            success: true,
            comment: comment.comment || '',
        })
    } catch (error) {
        console.error('Ошибка при получении комментария:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Ошибка сервера при получении комментария.',
            },
            { status: 500 },
        )
    }
}
