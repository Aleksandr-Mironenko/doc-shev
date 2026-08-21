import { NextRequest, NextResponse } from 'next/server'

import { getAllOrders, updateOrderField } from '@/app/services/adminServices'

interface UpdateOrderBody {
    id: number
    columnName: string
    value: string | number | boolean | null
}

export async function GET() {
    const result = await getAllOrders()

    if (!result.success) {
        return NextResponse.json(
            {
                success: false,
                data: [],
            },
            { status: 500 },
        )
    }

    return NextResponse.json(result)
}

export async function PATCH(request: NextRequest) {
    try {
        const body = (await request.json()) as UpdateOrderBody

        if (typeof body.id !== 'number' || !body.columnName) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Некорректные данные',
                },
                { status: 400 },
            )
        }

        const result = await updateOrderField(
            body.id,
            body.columnName,
            body.value,
        )

        if (!result.success) {
            return NextResponse.json(result, { status: 400 })
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('PATCH /api/admin/orders:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Ошибка сервера',
            },
            { status: 500 },
        )
    }
}
