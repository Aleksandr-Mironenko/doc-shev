import { NextResponse } from 'next/server'

import {
    dbCreateSiteContentItems,
    dbDeleteSiteContentItems,
    dbUpdateSiteContentItems,
} from '@/app/services/adminServices'

// Создание или обновление (UPSERT)
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { entity_name, id } = body
        if (!entity_name) {
            return NextResponse.json(
                { error: 'entity_name is required' },
                { status: 400 },
            )
        }
        let result
        if (id) {
            // Обновление существующей записи по ID
            result = await dbUpdateSiteContentItems(body)
        } else {
            result = await dbCreateSiteContentItems(body)
        }

        return NextResponse.json({ result })
    } catch (error) {
        console.error('Ошибка сохранения site_content:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

// Удаление записи из списка
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        const result = await dbDeleteSiteContentItems(Number(id))
        return NextResponse.json({ result })
    } catch (error) {
        console.error('Ошибка удаления:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}
