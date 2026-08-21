import { NextRequest, NextResponse } from 'next/server'

import { getAllClients, updateClientField } from '@/app/services/adminServices'

interface UpdateClientBody {
    id: number
    columnName: string
    value: string | number | boolean | null
}

export async function GET() {
    const result = await getAllClients()

    if (!result.success) {
        return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
}

export async function PATCH(request: NextRequest) {
    try {
        const body = (await request.json()) as UpdateClientBody

        if (typeof body.id !== 'number' || !body.columnName) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Некорректные данные',
                },
                { status: 400 },
            )
        }

        const result = await updateClientField(
            body.id,
            body.columnName,
            body.value,
        )

        if (!result.success) {
            return NextResponse.json(result, { status: 400 })
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('PATCH /api/admin/clients:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Ошибка сервера',
            },
            { status: 500 },
        )
    }
}
