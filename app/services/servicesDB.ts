// services.ts
import sql from '@/app/services/lib/db' // Подключение к вашей БД

// --- РАБОТА С БД ---
interface FetchDatesResult {
    dates: string[]
    success: boolean
}

export async function dbGetAvailableDates(): Promise<FetchDatesResult> {
    try {
        // Получаем уникальные даты, отсортированные по возрастанию
        const result = await sql`
            SELECT DISTINCT data::text AS date 
            FROM time_slots 
            WHERE data IS NOT NULL
            ORDER BY date ASC
        `

        // Извлекаем массив строк с датами
        const dates = result.map((row) => row.date)

        return {
            dates,
            success: true,
        }
    } catch (error) {
        console.error('Ошибка при получении списка дат:', error)

        // В случае ошибки возвращаем пустой массив и false
        return {
            dates: [],
            success: false,
        }
    }
}
export async function dbGetAvailableTimes(dateString: string) {
    const slots = await sql`
        SELECT time FROM time_slots 
        WHERE data = ${dateString} 
          AND (datatime_reserved IS NULL OR datatime_reserved < NOW())
        ORDER BY time ASC
    `
    return slots.length > 0
        ? { success: true, times: slots.map((s) => s.time), date: dateString }
        : { success: false }
}

export async function dbCheckSpecificTime(
    dateString: string,
    timeString: string,
) {
    // Делаем UPDATE строки, которая подходит под условия.
    // Если время занято, условие WHERE не выполнится, и UPDATE ничего не обновит.
    const slot = await sql`
        UPDATE time_slots 
        SET datatime_reserved = NOW() + INTERVAL '900 seconds'
        WHERE data = ${dateString} 
          AND time = ${timeString}
          AND (datatime_reserved IS NULL OR datatime_reserved < NOW())
        RETURNING data, datatime_reserved
    `
    // Если UPDATE успешно нашел и обновил строку, он вернет массив с этой строкой
    return slot.length > 0
        ? {
              success: true,
              date: slot[0].data,
              datatime_reserved: slot[0].datatime_reserved,
          }
        : {
              success: false,
          }
}

export async function dbNullSpecificTime(
    dateString: string,
    timeString: string,
) {
    try {
        const result = await sql`
            UPDATE time_slots 
            SET datatime_reserved = NULL 
            WHERE data = ${dateString} AND time = ${timeString}
        `

        // 2. В большинстве SQL-библиотек (включая pg и @vercel/postgres)
        // количество затронутых строк хранится в свойстве rowCount, а не length.
        if (result.length === 0) {
            return {
                success: false,
                message: 'Слот не найден или уже свободен',
            }
        }

        return { success: true, message: 'Бронь успешно снята' }
    } catch (error) {
        console.error('Ошибка при снятии брони (dbNullSpecificTime):', error)
        return { success: false, message: 'Внутренняя ошибка сервера' }
    }
}

export async function dbDeleteTimeSlot(dateString: string, timeString: string) {
    try {
        const result = await sql`
            DELETE FROM time_slots 
            WHERE data = ${dateString} AND time = ${timeString}
            RETURNING data, time
        `

        // Возвращаем true, если строка была найдена и успешно удалена
        return result.length > 0
    } catch (error) {
        console.error('Ошибка при удалении слота времени из БД:', error)
        return false
    }
}

// export async function dbCreateClient(
//     fio: string,
//     phone: string,
//     email: string,
// ) {
//     await sql`INSERT INTO all_clients (fio, phone, email) VALUES (${fio}, ${phone}, ${email})`
// }замена

export async function dbCreateClient(
    fio: string,
    phone: string,
    email: string,
) {
    // 1. Ищем клиента по телефону или email
    const clients = await sql`
        SELECT id, fio, phone, email
        FROM all_clients
        WHERE email = ${email}
           OR phone = ${phone}
    `

    // 2. Нет ни телефона, ни email
    if (clients.length === 0) {
        await sql`
            INSERT INTO all_clients (fio, phone, email)
            VALUES (${fio}, ${phone}, ${email})
        `

        return
    }

    const clientByEmail = clients.find((client) => client.email === email)

    const clientByPhone = clients.find((client) => client.phone === phone)

    // 3. Есть и email, и телефон у одной записи
    if (
        clientByEmail &&
        clientByPhone &&
        clientByEmail.id === clientByPhone.id
    ) {
        await sql`
            UPDATE all_clients
            SET fio = ${fio}
            WHERE id = ${clientByEmail.id}
        `

        return
    }

    // 4. Есть только телефон
    if (clientByPhone && !clientByEmail) {
        await sql`
            UPDATE all_clients
            SET fio = ${fio},
                email = ${email}
            WHERE id = ${clientByPhone.id}
        `

        return
    }

    // 5. Есть только email
    if (clientByEmail && !clientByPhone) {
        await sql`
            UPDATE all_clients
            SET fio = ${fio},
                phone = ${phone}
            WHERE id = ${clientByEmail.id}
        `

        return
    }

    // 6. Email и телефон существуют,  но принадлежат разным клиентам
    throw new Error('Email и телефон принадлежат разным клиентам')
}

export async function dbGenerateEmailCode(email: string) {
    // Передаем 'q', триггер БД сам сгенерирует 5 цифр
    const result = await sql`
        INSERT INTO email_codes (email, verification_code) 
        VALUES (${email}, 'q') 
        RETURNING verification_code
    `
    return result[0].verification_code
}

export async function dbVerifyCode(email: string, code: string) {
    const result = await sql`
        SELECT id FROM email_codes 
        WHERE email = ${email} AND verification_code = ${code}
        ORDER BY created_at DESC LIMIT 1
    `
    return result.length !== 0
}

//выбрать конкретный тип orderData
interface OrderData {
    fio: string
    phone: string
    email: string
    date: string
    time: string
    consent_pd: boolean
    consent_promo: boolean
    verification_code: string
    price: string
}

export async function dbCreateOrder(orderData: OrderData) {
    const price = orderData.price === 'consult' ? 1500 : 1000

    const result = await sql`
        INSERT INTO orders (
            fio, phone, email, date, time, consent_pd, consent_promo, 
            verification_code, approve, approve_pr,  price, payment
        ) VALUES (
            ${orderData.fio}, ${orderData.phone}, ${orderData.email}, 
            ${orderData.date}, ${orderData.time}, ${orderData.consent_pd}, 
            ${orderData.consent_promo}, ${orderData.verification_code},  
            true, true, ${price}, false
        ) RETURNING id
    `
    return result[0].id
}

export async function dbUpdatePaymentStatus(orderId: number) {
    const result = await sql`
        UPDATE orders 
        SET paiment = true 
        WHERE id = ${orderId}
        RETURNING fio, email, date, time
    `
    return result[0]
}

export async function dbGetOrderById(orderId: number) {
    try {
        const order = await sql`
            SELECT fio, email, date, time, price
            FROM orders 
            WHERE id = ${orderId}
        `

        return order.length > 0
            ? { success: true, data: order[0] }
            : { success: false }
    } catch (error) {
        console.error('Ошибка поиска заказа в БД:', error)
        return { success: false }
    }
}

// // Обновление статуса оплаты и сохранение сгенерированной ссылки
// export async function dbUpdatePaymentAndLink(orderId: number, link: string) {
//     try {
//         const result = await sql`
//             UPDATE orders
//             SET paiment = true, link = ${link}
//             WHERE id = ${orderId}
//             RETURNING id
//         `

//         // Возвращаем true, если строка была успешно обновлена
//         return result.length > 0
//     } catch (error) {
//         console.error('Ошибка обновления оплаты и ссылки в БД:', error)
//         return false
//     }
// }
// Обновление статуса оплаты и получение сгенерированной ссылки из БД
export async function dbUpdatePaymentAndLink(orderId: number) {
    try {
        //console.log(orderId)
        const result = await sql`
            UPDATE orders 
            SET payment = true
            WHERE id = ${orderId}
            RETURNING id,  room_id  
        ` //RETURNING id,  room_id, link

        // Если запись успешно обновлена, возвращаем id и сгенерированную ссылку
        if (result.length > 0) {
            return {
                id: result[0].id,
                // link: result[0].link,
                room_id: result[0].room_id,
            }
        }

        // Если заказ с таким orderId не найден
        return null // return { success: false }
    } catch (error) {
        console.error(
            'Ошибка обновления оплаты и получения ссылки из БД:',
            error,
        )
        return null // return { success: false }
    }
}

export async function dbGetLinkByRoomId(roomId: string) {
    try {
        const orders = await sql`
            SELECT link, time, date, payment, fio, email 
            FROM orders 
            WHERE room_id = ${roomId}
        `
        if (orders.length === 0) {
            return { success: false, error: 'NOT_FOUND' }
        }

        const row = orders[0]

        if (!row.payment) {
            return { success: false, error: 'NOT_PAID' }
        }

        // 1. Формируем ISO-строку (UTC+3)
        const isoString = `${row.date}T${row.time}:00+03:00`
        const startTime = new Date(isoString)
        const now = new Date()
        //console.log('startTime 259', startTime)
        //console.log('now 260', now)
        // 2. Временные рамки
        const durationMinutes = 60
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000)
        const allowedStartTime = new Date(startTime.getTime() - 5 * 60000)
        //console.log('endTime 265', endTime)
        //console.log('allowedStartTime 266', allowedStartTime)
        let status: 'too_early' | 'active' | 'expired' = 'active'

        if (now < allowedStartTime) {
            status = 'too_early'
        } else if (now > endTime) {
            status = 'expired'
        }
        //console.log('status 274', status)
        return {
            success: true,
            data: {
                fio: row.fio as string,
                email: row.email as string,
                status,
                link: row.link as string,
                startTime: startTime.toISOString(),
            },
        }
    } catch (error) {
        console.error('Ошибка проверки заказа в БД:', error)
        return { success: false, error: 'SERVER_ERROR' }
    }
}

export async function dbGeSucsessbyPassworsEmail(
    email: string,
    password: number,
    roomId: string,
) {
    try {
        const order = await sql`
            SELECT link
            FROM orders 
            WHERE email = ${email} 
              AND verification_code = ${password} 
              AND room_id = ${roomId}
        `

        return order.length > 0
            ? { success: true, link: order[0].link as string } // Берем именно строку ссылки
            : { success: false }
    } catch (error) {
        console.error('Ошибка поиска заказа в БД:', error)
        return { success: false }
    }
}
