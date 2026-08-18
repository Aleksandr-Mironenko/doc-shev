import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import {
    dbVerifyCode,
    dbCreateOrder,
    // dbDeleteTimeSlot,
} from '@/app/services/servicesDB'
//4
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, code, orderDetails } = body
        const { price } = orderDetails //date, time,
        console.log(email, code, orderDetails)
        if (!email || !code || !orderDetails) {
            return NextResponse.json(
                { success: false, message: 'Недостаточно данных' },
                { status: 400 },
            )
        }
        console.log(22, price)
        // Проверяем пару email + код
        const isValid = await dbVerifyCode(email, code)

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: 'Неверный код' },
                { status: 400 },
            )
        }
        console.log('isValid', isValid)

        // Создаем заказ
        const orderId = await dbCreateOrder({
            ...orderDetails,
            email,
            verification_code: code,
        })
        console.log('orderId', orderId)

        // const merchantLogin = process.env.ROBOKASSA_LOGIN || 'ВАШ_ЛОГИН'
        // const password1 = process.env.ROBOKASSA_PASSWORD_1 || 'ВАШ_ПАРОЛЬ_1'
        // const outSum = orderDetails.price.toString() // Сумма к оплате

        // Формируем строку для подписи: Логин:Сумма:НомерЗаказа:Пароль1
        // const signatureString = `${merchantLogin}:${outSum}:${orderId}:${password1}`

        // // Генерируем MD5-хеш
        // const signatureValue = createHash('md5')
        //     .update(signatureString)
        //     .digest('hex')
        //     .toUpperCase()

        // const mrh_login = 'Test1999'
        // const mrh_pass1 = 'password_1'
        // const inv_id = 678678
        // const inv_desc = 'Товары для животных'
        // const out_summ = '100.00'
        // const IsTest = 1
        // const crc = `${mrh_login}:${out_summ}:${inv_id}:${mrh_pass1}`
        // Генерируем MD5-хеш
        // const signatureValue = createHash('md5')
        //     .update(crc)
        //     .digest('hex')
        //     .toUpperCase()

        //auth.robokassa.ru/Merchant/PaymentForm/FormMS.js?" .
        // const paymentUrl = `https://auth.robokassa.ru/MerchantLogin=${mrh_login}&OutSum=${out_summ}&InvoiceID=${inv_id}&Description=${inv_desc}&SignatureValue=${signatureValue}&IsTest=${IsTest}&Iframe=1`
        const mrh_login = (process.env.ROBOKASSA_MERCHANT_LOGIN || '').trim()
        const mrh_pass1 = (process.env.ROBOKASSA_PASSWORD_1 || '').trim() // Тестовый пароль #1 из ЛК
        const isTest = (process.env.ROBOKASSA_TEST || '1').trim()

        const inv_id = Number(orderId)
        const inv_desc = 'Консультационные услуги'
        const out_summ = Number(price).toFixed(2)

        // Oo5qkAK6Q0fL1dTXjUB7

        // M0DGfuv66Bo7hnN8quSx
        // 1. Формируем строго: Логин:Сумма:НомерЗаказа:ТестовыйПароль1
        const crcString = `${mrh_login}:${out_summ}:${inv_id}:${mrh_pass1}`

        // 2. Генерация MD5 в верхнем регистре
        const signatureValue = createHash('md5')
            .update(crcString)
            .digest('hex')
            .toUpperCase()

        // 3. Кодируем кириллицу в описании
        const encodedDesc = encodeURIComponent(inv_desc)

        // 4. Валидный URL к скрипту /Merchant/Index.aspx
        const paymentUrl = `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=${mrh_login}&OutSum=${out_summ}&InvId=${inv_id}&Description=${encodedDesc}&SignatureValue=${signatureValue}&IsTest=${isTest}&Iframe=1`
        // Формируем итоговую ссылку для оплаты (с параметром iframe=1)
        // const paymentUrl = `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=${merchantLogin}&OutSum=${outSum}&InvId=${orderId}&SignatureValue=${signatureValue}&IsTest=1&Iframe=1`

        console.log(97, mrh_login)
        console.log(98, mrh_pass1)
        console.log(99, inv_id)
        console.log(100, inv_desc)
        console.log(101, out_summ)
        console.log(102, isTest)
        console.log(103, paymentUrl)
        //
        //
        //
        //
        // УДАЛЯЕМ СЛОТ НАВСЕГДА, так как заказ успешно создан    нужно перенести в модуль успешной оплаты, чтобы слот удалялся только после успешной оплаты
        // await dbDeleteTimeSlot(date, time)
        //
        //
        //
        //

        return NextResponse.json({ success: true, orderId, paymentUrl })
    } catch (error) {
        console.error('Ошибка проверки кода:', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}

// const mrh_login = 'Test1999'
// const mrh_pass1 = 'password_1' // Тестовый пароль #1 из ЛК Робокассы
// const inv_id = 678678
// const inv_desc = 'Товары для животных'
// const out_summ = '100.00'
// const IsTest = 1

// // 1. Формируем строку подписи (mrh_login:out_summ:inv_id:mrh_pass1)
// const crc = `${mrh_login}:${out_summ}:${inv_id}:${mrh_pass1}`
// const signatureValue = createHash('md5').update(crc).digest('hex').toUpperCase()

// // 2. Кодируем описание для передачи в URL
// const encodedDesc = encodeURIComponent(inv_desc)

// // 3. Полный корректный URL с эндпоинтом /Merchant/Index.aspx? и параметром InvId
// const paymentUrl = `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=${mrh_login}&OutSum=${out_summ}&InvId=${inv_id}&Description=${encodedDesc}&SignatureValue=${signatureValue}&IsTest=${IsTest}&Iframe=1`
