import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null
        const path = formData.get('path') as string | null
        const webp = formData.get('webp') as string | null

        if (!file) {
            return NextResponse.json(
                { error: 'Файл не передан' },
                { status: 400 },
            )
        }

        const apiKey = process.env.STORAGE_API_KEY
        if (!apiKey) {
            console.error(
                'STORAGE_API_KEY is not defined in environment variables',
            )
            return NextResponse.json(
                { error: 'Конфигурация сервера нарушена' },
                { status: 500 },
            )
        }

        // Формируем multipart/form-data для RelaxDev API
        const uploadData = new FormData()
        uploadData.append('file', file, file.name)

        if (path) uploadData.append('path', path)
        if (webp !== null) uploadData.append('webp', webp)

        // Исправленный URL: https://relaxdev.ru/api/v1/storage/upload
        const res = await fetch('https://relaxdev.ru/api/v1/storage/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            body: uploadData,
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                {
                    error: data.message || 'Ошибка загрузки в RelaxDev',
                    details: data,
                },
                { status: res.status },
            )
        }

        // Возвращаем полный ответ платформы (success, url, path, webp)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Storage error:', error)
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const { url } = body

        if (!url) {
            return NextResponse.json(
                { success: false, message: 'URL не предоставлен' },
                { status: 400 },
            )
        }

        const apiKey = process.env.STORAGE_API_KEY
        if (!apiKey) {
            console.error('STORAGE_API_KEY is not defined')
            return NextResponse.json(
                { success: false, message: 'Конфигурация сервера нарушена' },
                { status: 500 },
            )
        }

        // Извлекаем нужный path из полного URL.
        // Документация указывает, что путь начинается с "users/".
        // Если полный URL: "https://relaxdev.ru/storage/users/email/project/photo.jpg"
        // То мы отсекаем домен и достаем часть, начиная с "users/"
        const pathStartIndex = url.indexOf('users/')
        if (pathStartIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Не удалось извлечь путь из URL' },
                { status: 400 },
            )
        }

        const filePath = url.substring(pathStartIndex)

        // Формируем URL для DELETE запроса с query-параметром ?path=
        const apiUrl = new URL('https://relaxdev.ru/api/v1/storage/files')
        apiUrl.searchParams.append('path', filePath)

        // Отправляем запрос в RelaxDev
        const res = await fetch(apiUrl.toString(), {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        })

        // RelaxDev может вернуть пустой ответ (204) или JSON (200)
        // Поэтому безопасно проверяем, есть ли тело ответа
        let data = {}
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            data = await res.json()
        }

        if (!res.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Ошибка удаления в RelaxDev',
                    details: data,
                },
                { status: res.status },
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Файл успешно удален',
            deleted: filePath,
        })
    } catch (error: unknown) {
        console.error('Ошибка удаления файла API:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка при удалении файла' },
            { status: 500 },
        )
    }
}
