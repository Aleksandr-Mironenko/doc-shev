import { NextResponse } from 'next/server'
import {
    dbGetAllServices,
    dbCreateService,
    dbUpdateService,
    dbDeleteService,
} from '@/app/service/adminServices'

// Получение списка всех услуг
export async function GET() {
    try {
        const result = await dbGetAllServices()
        if (!result.success) {
            return NextResponse.json(
                { error: 'Database error' },
                { status: 500 },
            )
        }

        return NextResponse.json(result.data, { status: 200 })
    } catch (error) {
        console.error('Ошибка GET /api/services:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// Создание или обновление (UPSERT)
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { id, title, price, is_check } = body

        if (!title || price === undefined || is_check === undefined) {
            return NextResponse.json(
                {
                    error: 'Fields "title", "price" and "is_check" are required',
                },
                { status: 400 },
            )
        }

        const result = id
            ? await dbUpdateService(body)
            : await dbCreateService(body)

        return NextResponse.json({ result }, { status: 200 })
    } catch (error) {
        console.error('Ошибка POST /api/services:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

// Удаление услуги
// export async function DELETE(req: Request) {
//     try {
//         const body = await req.json()
//         const { id, url, link, entity } = body

//         if (!id) {
//             return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
//         }

//         const result = await dbDeleteService(Number(id))

//         if (!result.success) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: 'Ошибка удаления в RelaxDev',
//                 },
//                 { status: result.success ? 200 : 500 },
//             )
//         }

//         const apiKey = process.env.STORAGE_API_KEY

//         const pathStartIndex = url.indexOf('users/')
//         if (pathStartIndex === -1) {
//             return NextResponse.json(
//                 { success: false, message: 'Не удалось извлечь путь из URL' },
//                 { status: 400 },
//             )
//         }
//         // const pathStartIndex2 = link.indexOf('users/')
//         // if (pathStartIndex2 === -1) {
//         //     return NextResponse.json(
//         //         { success: false, message: 'Не удалось извлечь путь из URL' },
//         //         { status: 400 },
//         //     )
//         // }

//         const filePath = url.substring(pathStartIndex)
//         // const filePath2 = link.substring(pathStartIndex2)

//         // Формируем URL для DELETE запроса с query-параметром ?path=
//         const apiUrl = new URL('https://relaxdev.ru/api/v1/storage/files')
//         apiUrl.searchParams.append('path', filePath)

//         //  const apilink = new URL('https://relaxdev.ru/api/v1/storage/files')
//         //  apilink.searchParams.append('path', filePath2)

//         // Отправляем запрос в RelaxDev
//         const res = await fetch(apiUrl.toString(), {
//             method: 'DELETE',
//             headers: {
//                 Authorization: `Bearer ${apiKey}`,
//             },
//         })

//         if (entity === 'paid_content') {
//             const pathStartIndex2 = link.indexOf('users/')
//             if (pathStartIndex2 === -1) {
//                 return NextResponse.json(
//                     { success: false, message: 'Не удалось извлечь путь из URL' },
//                     { status: 400 },
//                 )
//             }

//             const filePath2 = link.substring(pathStartIndex2)
//             const apilink = new URL('https://relaxdev.ru/api/v1/storage/files')
//             apilink.searchParams.append('path', filePath2)
//             const res2 = await fetch(apilink.toString(), {
//                 method: 'DELETE',
//                 headers: {
//                     Authorization: `Bearer ${apiKey}`,
//                 },
//             })

//             if (!res2.ok) {
//                 return NextResponse.json(
//                     {
//                         success: false,
//                         message: 'Ошибка удаления в RelaxDev',
//                     },
//                     { status: res2.status },
//                 )
//             }
//         }

//         // RelaxDev может вернуть пустой ответ (204) или JSON (200)
//         // Поэтому безопасно проверяем, есть ли тело ответа
//         let data = {}
//         const contentType = res.headers.get('content-type')
//         if (contentType && contentType.includes('application/json')) {
//             data = await res.json()
//         }

//         if (!res.ok) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: 'Ошибка удаления в RelaxDev',
//                     details: data,
//                 },
//                 { status: res.status },
//             )
//         }

//         return NextResponse.json({ result }, { status: 200 })
//     } catch (error) {
//         console.error('Ошибка DELETE /api/services:', error)
//         return NextResponse.json({ error: 'Database error' }, { status: 500 })
//     }
// }
export async function DELETE(req: Request) {
    try {
        const body = await req.json()
        const { id, url, link } = body // url = картинка, link = методичка

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        // 1. Удаляем саму запись из базы данных
        const result = await dbDeleteService(Number(id))

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: 'Ошибка удаления из базы данных' },
                { status: 500 },
            )
        }

        const apiKey = process.env.STORAGE_API_KEY

        // 2. Вспомогательная функция для безопасного удаления файла
        const deleteStorageFileSafe = async (
            fileUrl: string | null | undefined,
        ) => {
            if (!fileUrl) return // Выходим, если ссылки нет

            const pathStartIndex = fileUrl.indexOf('users/')
            if (pathStartIndex === -1) return // Выходим, если формат ссылки неизвестен

            const filePath = fileUrl.substring(pathStartIndex)
            const apiUrl = new URL('https://relaxdev.ru/api/v1/storage/files')
            apiUrl.searchParams.append('path', filePath)

            try {
                const res = await fetch(apiUrl.toString(), {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${apiKey}` },
                })
                if (!res.ok) {
                    console.warn(
                        `Не удалось удалить файл (статус ${res.status}):`,
                        fileUrl,
                    )
                }
            } catch (err) {
                console.error(
                    `Ошибка при запросе на удаление файла ${filePath}:`,
                    err,
                )
            }
        }

        // 3. Пытаемся удалить картинку и методичку (если они есть)
        // Выполняем параллельно для скорости
        await Promise.all([
            deleteStorageFileSafe(url),
            deleteStorageFileSafe(link),
        ])

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Ошибка DELETE /api/services:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
