import { NextResponse } from 'next/server'
import crypto from 'crypto'
// Импортируйте ваши функции для работы с БД, MTS Link и почтой
// import { dbUpdateOrderPaymentStatus } from '@/app/services/servicesDB'
// import { createMtsLink } from '@/app/services/serviceMtsLink'
// import sendEmail from '@/app/services/serviceSendEmail'

export async function POST(request: Request) {
    try {
        // Робокасса присылает данные в формате form-data
        const formData = await request.formData()

        const OutSum = formData.get('OutSum') as string
        const InvId = formData.get('InvId') as string
        const SignatureValue = formData.get('SignatureValue') as string

        // Проверяем, что все нужные параметры пришли
        if (!OutSum || !InvId || !SignatureValue) {
            return new NextResponse('Bad Request', { status: 400 })
        }

        // Ваш Пароль #2 из настроек магазина в Робокассе (обязательно храните в .env)
        const password2 = process.env.ROBOKASSA_PASSWORD_2 || 'ВАШ_ПАРОЛЬ_2'

        // Формируем строку для проверки подписи: "Сумма:НомерЗаказа:Пароль2"
        const signatureString = `${OutSum}:${InvId}:${password2}`

        // Генерируем MD5-хеш
        const mySignature = crypto
            .createHash('md5')
            .update(signatureString)
            .digest('hex')
            .toUpperCase()

        // Сверяем нашу подпись с той, что прислала Робокасса
        if (mySignature !== SignatureValue.toUpperCase()) {
            console.error('Ошибка проверки подписи Робокассы', { InvId })
            return new NextResponse('Bad signature', { status: 400 })
        }

        // === ЕСЛИ ПОДПИСЬ ВЕРНАЯ, ВЫПОЛНЯЕМ БИЗНЕС-ЛОГИКУ ===

        // 1. Меняем статус заказа в базе данных на "Оплачено" (paiment = true)
        // await dbUpdateOrderPaymentStatus(InvId, true)

        // 2. Создаем ссылку в MTS Link
        // const mtsLink = await createMtsLink(...)

        // 3. Отправляем ссылку клиенту на почту
        // Получаем email клиента из БД по InvId и отправляем письмо
        // await sendEmail(email, 'Ссылка на консультацию', `Ваша ссылка: ${mtsLink}`, ...)

        // ===================================================

        // ВАЖНО: Робокасса ожидает в ответ только строку "OK" и номер заказа
        return new NextResponse(`OK${InvId}`, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
        })
    } catch (error) {
        console.error('Ошибка в обработчике Робокассы:', error)
        // В случае ошибки на сервере возвращаем ошибку,
        // чтобы Робокасса попробовала отправить запрос позже
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
