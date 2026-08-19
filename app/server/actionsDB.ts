'use server'

import {
    dbGetAvailableTimes,
    dbCreateClient,
    dbGenerateEmailCode,
    dbVerifyCode,
    dbCreateOrder,
    dbCheckSpecificTime,
    dbUpdatePaymentAndLink,
    dbGetOrderById,
} from '@/app/services/servicesDB'

import sendEmail from '../services/serviceSendEmail'

import serviceCreateMtsLink from '@/app/services/servicesCreateMtslLnk'

// 1. Проверка доступного времени (Шаг 1)
export async function getTimesAction(dateString: string) {
    return await dbGetAvailableTimes(dateString)
}
//

// 2. Проверка не записался ли кто то во время выбора времени(Шаг 2)
export async function actionCheckTimeInData(
    dateString: string,
    timeString: string,
) {
    return await dbCheckSpecificTime(dateString, timeString)
}
//

// 3. Отправка формы и запроса кода (Шаг 3)
export async function submitClientFormAction(formData: {
    fio: string
    phone: string
    email: string
}) {
    try {
        // Записываем клиента в общую базу
        await dbCreateClient(formData.fio, formData.phone, formData.email)

        // Генерируем код (срабатывает триггер в БД)
        const code = await dbGenerateEmailCode(formData.email)

        // Отправляем письмо через сервис
        // const emailSent = await sendEmail(
        //     formData.email,
        //     `Ваш код подтверждения: ${code}`,
        // ) //добавить samp ********************************************
        const tasks: Promise<unknown>[] = []

        tasks.push(
            //отправка сообщения клиенту
            sendEmail(
                formData.email,
                `Код поодтверждения а консультацию`,
                `<p>Ваш код для входа: <strong>${code}</strong></p><p>Код действителен 15 минут</p>`,
                `Проверочный код на консультацию`,
            ),
        )
        const results = await Promise.allSettled(tasks)

        await results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.log('Ошибка в send-code:', index, result.reason)
            }
        })
        return { success: true }
    } catch (error) {
        console.error(
            'Ошибка на этапе создания клиента и отправки кода:',
            error,
        )
        return { success: false }
    }
}

// 4. Проверка кода и создание заказа (Шаг 4)
export async function verifyCodeAndCreateOrderAction(
    email: string,
    code: string,
    orderDetails: any,
) {
    try {
        // Проверяем пару email + код
        const isValid = await dbVerifyCode(email, code)

        if (!isValid) {
            return { success: false, message: 'Неверный код' }
        }

        // Если код верный, создаем заказ. aprouwe и aprouwe_pr ставятся true в слое сервиса
        const orderId = await dbCreateOrder({
            ...orderDetails,
            email,
            verification_code: code, //нафига мне этот код, мб чтобы подтвердить что было подписано  да это определенно лучше
        })

        return { success: true, orderId }
    } catch (error) {
        console.error('Ошибка проверки кода:', error)
        return { success: false }
    }
}
// 5. Обработка оплаты, создание ссылки и отправка финального письма (Шаг 4)
export async function finalizePaymentAndOrderAction(
    isPaymentSuccess: boolean,
    orderId: number,
) {
    if (!isPaymentSuccess) {
        return { success: false, message: 'Оплата не подтверждена' }
    }

    try {
        // 1. Получаем данные заказа по ID (нужны для генерации ссылки и письма)
        const orderData = await dbGetOrderById(orderId)
        if (!orderData.success || !orderData.data) {
            console.error(`Заказ с ID ${orderId} не найден`)
            return { success: false, message: 'Заказ не найден' }
        }

        const { fio, email, date, time } = orderData.data

        // 2. Генерируем ссылку MTS Link
        const mtsResult = await serviceCreateMtsLink(date, time, fio)

        // Проверяем, вернула ли функция true + ссылку
        if (!mtsResult || !mtsResult.success || !mtsResult.link) {
            console.error('Не удалось сгенерировать ссылку MTS Link')
            return { success: false, message: 'Ошибка создания видеовстречи' }
        }

        // 3. Обновляем статус оплаты
        const isDbUpdated = await dbUpdatePaymentAndLink(orderId)

        if (!isDbUpdated) {
            console.error('Ошибка сохранения данных оплаты и ссылки в БД')
            return { success: false, message: 'Ошибка обновления БД' }
        }

        // 4. Отправляем письмо с подтверждением и ссылкой
        const emailHtml = `
            <h2>Здравствуйте, ${fio}!</h2>
            <p>Ваша консультация успешно оплачена и подтверждена.</p>
            <p><strong>Дата:</strong> ${date}</p>
            <p><strong>Время:</strong> ${time}</p>
            <p><strong>Ссылка на встречу:</strong> <a href="${mtsResult.link}">${mtsResult.link}</a></p>
            <p>Ждем вас!</p>
        `

        const tasks: Promise<unknown>[] = []

        tasks.push(
            sendEmail(
                email,
                'Оплата подтверждена: ссылка на консультацию',
                emailHtml,
                'Информация о предстоящей консультации',
            ),
        )

        const results = await Promise.allSettled(tasks)

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.log(
                    'Ошибка при отправке письма с ссылкой:',
                    index,
                    result.reason,
                )
            }
        })

        // Если мы дошли до сюда — вся цепочка выполнена успешно
        return { success: true }
    } catch (error) {
        console.error('Критическая ошибка на этапе финализации оплаты:', error)
        return { success: false }
    }
}
