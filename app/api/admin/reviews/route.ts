import { NextRequest, NextResponse } from 'next/server'

import {
    dbAddReview,
    getAllReviews,
    updateReviewField,
    type AddReviewPayload,
} from '@/app/services/adminServices'

interface UpdateReviewBody {
    id: number
    columnName: string
    value: string | number | boolean | null
}

export async function GET() {
    const result = await getAllReviews()

    if (!result.success) {
        return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as AddReviewPayload

        const result = await dbAddReview(body)

        if (!result.success) {
            return NextResponse.json(result, { status: 400 })
        }

        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        console.error('POST /api/admin/reviews:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Ошибка сервера',
            },
            { status: 500 },
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = (await request.json()) as UpdateReviewBody

        if (typeof body.id !== 'number' || !body.columnName) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Некорректные данные',
                },
                { status: 400 },
            )
        }

        const result = await updateReviewField(
            body.id,
            body.columnName,
            body.value,
        )

        if (!result.success) {
            return NextResponse.json(result, { status: 400 })
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('PATCH /api/admin/reviews:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Ошибка сервера',
            },
            { status: 500 },
        )
    }
}
