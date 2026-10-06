import { NextResponse } from 'next/server'
import { dbDownloadFineMaterial } from '@/app/service/servicesDB'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { id } = body

        if (!id) {
            return NextResponse.json(
                { message: 'ID материала не указан' },
                { status: 400 },
            )
        }

        // Вызываем вашу готовую функцию из БД
        const downloadedFile = await dbDownloadFineMaterial(Number(id))

        if (!downloadedFile?.ok || !downloadedFile.buffer) {
            return NextResponse.json(
                { message: 'Не удалось получить файл' },
                { status: 404 },
            )
        }

        // Возвращаем сам файл (буфер) с заголовками для скачивания
        return new NextResponse(downloadedFile.buffer, {
            status: 200,
            headers: {
                'Content-Type':
                    downloadedFile.contentType || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(
                    downloadedFile.filename || 'material.pdf',
                )}"`,
            },
        })
    } catch (error) {
        console.error('Ошибка в эндпоинте скачивания:', error)
        return NextResponse.json(
            { message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
