// import { NextResponse } from 'next/server'
// import {
//     dbDeleteTimeSlot,
//     dbGetOrderById,
//     dbUpdatePaymentAndLink,
// } from '@/app/services/servicesDB'

// import sendEmail from '@/app/services/serviceSendEmail'
// //5
// export async function POST(request: Request) {
//     try {
//         const body = await request.json()
//         const { isPaymentSuccess, orderId, code } = body

//         if (!isPaymentSuccess) {
//             return NextResponse.json(
//                 { success: false, message: 'Оплата не подтверждена' },
//                 { status: 400 },
//             )
//         }

//         if (!orderId) {
//             return NextResponse.json(
//                 { success: false, message: 'Не указан ID заказа' },
//                 { status: 400 },
//             )
//         }
//         if (!code) {
//             return NextResponse.json(
//                 { success: false, message: 'Не указан код к встрече' },
//                 { status: 400 },
//             )
//         }

//         // 1. Получаем данные заказа по ID
//         const orderData = await dbGetOrderById(orderId)
//         if (!orderData.success || !orderData.data) {
//             return NextResponse.json(
//                 { success: false, message: 'Заказ не найден' },
//                 { status: 404 },
//             )
//         }

//         const { fio, email, date, time } = orderData.data

//         // 3. Обновляем статус оплаты и сохраняем ссылку в БД
//         const isDbUpdated = await dbUpdatePaymentAndLink(orderId)

//         if (!isDbUpdated) {
//             return NextResponse.json(
//                 { success: false, message: 'Ошибка обновления БД' },
//                 { status: 500 },
//             )
//         }

//         // 4. Удаляем занятый слот
//         const deleteSlot = await dbDeleteTimeSlot(date, time)
//         if (!deleteSlot) {
//             return NextResponse.json(
//                 { success: false, message: 'Ошибка удаления занятого слота' },
//                 { status: 500 },
//             )
//         }
//         const escapeHtml = (fio: string) => {
//             return fio
//                 .replace(/&/g, '&amp;')
//                 .replace(/</g, '&lt;')
//                 .replace(/>/g, '&gt;')
//                 .replace(/"/g, '&quot;')
//                 .replace(/'/g, '&#039;')
//         }
//         const safeFio = escapeHtml(fio)
//         // 5. Отправляем письмо с подтверждением и ссылкой
//         const emailHtml = `
//             <h2>Здравствуйте, ${safeFio}!</h2>
//             <p>Ваша консультация успешно оплачена и подтверждена.</p>
//             <p><strong>Дата:</strong> ${date}</p>
//             <p><strong>Время:</strong> ${time}</p>
//             <p><strong>Ссылка на встречу:</strong> <a href="https://doc-shev.relaxdev.ru/room/${isDbUpdated.room_id}">${`https://doc-shev.relaxdev.ru/room/${isDbUpdated.room_id}`}</a></p>
//             <p><strong>Код доступа к встрече:</strong> ${code}</p>
//             <p>Ждем вас!</p>
//         `

//         await sendEmail(
//             email,
//             'Оплата подтверждена: ссылка на консультацию',
//             emailHtml,
//             'Информация о предстоящей консультации',
//         )

//         return NextResponse.json({ success: true })
//     } catch (error) {
//         console.error('Критическая ошибка на этапе финализации оплаты:', error)
//         return NextResponse.json(
//             { success: false, message: 'Внутренняя ошибка сервера' },
//             { status: 500 },
//         )
//     }
// }

/////////////////////////////////////////////////////////////////////////////////////////
import { NextResponse } from 'next/server'
import {
    dbDeleteTimeSlot,
    dbDownloadFineMaterial,
    dbGetOrderById,
    dbUpdatePaymentAndLink,
} from '@/app/service/servicesDB'
import sendEmail from '@/app/service/serviceSendEmail'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { isPaymentSuccess, orderId, code, productCard } = body

        // 1. Валидация входных данных
        if (!isPaymentSuccess) {
            return NextResponse.json(
                { success: false, message: 'Оплата не подтверждена' },
                { status: 400 },
            )
        }

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Не указан ID заказа' },
                { status: 400 },
            )
        }

        // Код встречи обязателен только при отсутствии productCard
        if (!productCard && !code) {
            return NextResponse.json(
                { success: false, message: 'Не указан код к встрече' },
                { status: 400 },
            )
        }

        // 2. Получение данных заказа
        const orderData = await dbGetOrderById(orderId)
        if (!orderData?.success || !orderData?.data) {
            return NextResponse.json(
                { success: false, message: 'Заказ не найден' },
                { status: 404 },
            )
        }

        const { fio, email, date, time } = orderData.data

        // 3. Обновление статуса оплаты
        const isDbUpdated = await dbUpdatePaymentAndLink(orderId)
        if (!isDbUpdated) {
            return NextResponse.json(
                { success: false, message: 'Ошибка обновления БД' },
                { status: 500 },
            )
        }

        const escapeHtml = (str: string = '') =>
            str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')

        const safeFio = escapeHtml(fio)
        let attachments: File[] | undefined
        let deleteSlot
        // 4. Логика отправки файла (Методички)
        if (productCard) {
            const downloadedFile = await dbDownloadFineMaterial(productCard.id)

            if (!downloadedFile?.ok || !downloadedFile.buffer) {
                // Извещаем администратора об ошибке
                await sendEmail(
                    'doc.shev@Mail.ru',
                    'Клиент не получил оплаченный материал',
                    `<p>Ошибка при получении файла для товара:</p><pre>${JSON.stringify(
                        productCard,
                        null,
                        2,
                    )}</pre>`,
                    'Ошибка при получении файла',
                )

                return NextResponse.json(
                    { success: false, message: 'Ошибка получения файла' },
                    { status: 500 },
                )
            }

            // Формируем объект File из буфера, который возвращает dbDownloadFineMaterial
            const fileBuffer = downloadedFile.buffer
            const contentType =
                downloadedFile.contentType ?? 'application/octet-stream'
            const filename = downloadedFile.filename || 'material'

            attachments = [
                new File([fileBuffer], filename, { type: contentType }),
            ]
        } else {
            // 5. Логика удаление слота консультации
            deleteSlot = await dbDeleteTimeSlot(date, time)
            if (!deleteSlot) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Ошибка удаления занятого слота',
                    },
                    { status: 500 },
                )
            }
        }

        // 6. Подготовка письма
        const emailHtml = productCard
            ? `
                <h2>Здравствуйте, ${safeFio}!</h2>
                <p>Методичка во вложении.</p>
                <p><strong>Очень надеюсь, что вам понравится ее содержание, она будет познавательна и полезна.</strong></p>
                <p><strong>Очень важно помнить! Никакие методические материалы не заменят обращение к врачу.</strong></p>
                <p><strong>Пожалуйста, не занимайтесь самолечением и берегите свое здоровье!</strong></p>
            `
            : `
                <h2>Здравствуйте, ${safeFio}!</h2>
                <p>Ваша консультация успешно оплачена и подтверждена.</p>
                <p><strong>Дата:</strong> ${escapeHtml(date)}</p>
                <p><strong>Время:</strong> ${escapeHtml(time)}</p>
                <p><strong>Ссылка на встречу:</strong> <a href="https://doc-shev.relaxdev.ru/room/${isDbUpdated.room_id}">https://doc-shev.relaxdev.ru/room/${isDbUpdated.room_id}</a></p>
                <p><strong>Код доступа к встрече:</strong> ${escapeHtml(code)}</p>
                <p>Ждем вас!</p>
            `

        const subject = productCard
            ? 'Оплата подтверждена'
            : 'Оплата подтверждена: ссылка на консультацию'

        const fromText = productCard
            ? 'Материал во вложении'
            : 'Информация о предстоящей консультации'

        // Отправка письма с передачей массива File[] в оригинальную функцию
        await sendEmail(email, subject, emailHtml, fromText, attachments)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Критическая ошибка на этапе финализации оплаты:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
