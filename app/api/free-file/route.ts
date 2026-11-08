import { NextResponse } from 'next/server'
import { dbDownloadFineMaterial } from '@/app/serv/servicesDB'
import sendEmail from '@/app/serv/serviceSendEmail'
import { sendBookingNotifications } from '@/app/serv/sendTG'

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

        const adminTextMaterial = `⚠️ <b>Админ — скачан один из бесплатных материалов\nЗайди посмотри doctor-shev.ru/admin`

        try {
            await sendBookingNotifications({
                text: adminTextMaterial,
            })
        } catch {
            // Логируем ошибку отправки сообщений, но клиенту отвечаем, что запись прошла успешно это только сообщеие админу
            await sendEmail(
                'sanek.miron2@gmail.com',
                'внимание! ошибка отправки в телегу админу',
                'ошибка отправки в телегу админу про бесплатный материал',
                'Ошибка отправки в телегу админу',
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
