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
    check: boolean,
    dateConsent_pd: false | string,
    dateConsent_promo: false | string,
) {
    if (!dateConsent_pd) {
        throw new Error('Обязательно согласие на обработку персональных данных')
    }
    // consent_pd	consent_promo
    // Превращаем false в null для SQL, чтобы COALESCE работал корректно
    const promoDateSql = dateConsent_promo ? dateConsent_promo : null
    const promoDatePdSql = dateConsent_pd ? dateConsent_pd : null
    const helpFinc = (count: number, date: string | Date | null) => {
        if (count <= 0 || date === null) {
            return false
        }
        const lastConsultDate = new Date(date)
        const now = new Date()

        const diffInMs = now.getTime() - lastConsultDate.getTime()
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
        return diffInDays >= 0 && diffInDays <= 21
    }

    // 1. Ищем клиента по телефону или email
    const clients = await sql`
        SELECT id, fio, phone, email, dateConsent_pd, dateConsent_promo, consent_pd, consent_promo
        FROM all_clients
        WHERE email = ${email}
           OR phone = ${phone}
    `

    const consent_pd = clients.some((el) => el.consent_pd) || !!dateConsent_pd
    const consent_promo =
        clients.some((el) => el.consent_promo) || !!dateConsent_promo

    // 2. Нет ни телефона, ни email
    if (clients.length === 0) {
        const result = await sql`
            INSERT INTO all_clients (fio, phone, email, data_last_consult, counter_consult, dateConsent_pd, dateConsent_promo, consent_promo, consent_pd)
            VALUES (${fio}, ${phone}, ${email}, null, 0, ${promoDatePdSql}, ${promoDateSql},	${consent_promo}, ${consent_pd}) 
            RETURNING data_last_consult, counter_consult,id
        `
        if (check) {
            return helpFinc(
                result[0].counter_consult,
                result[0].data_last_consult,
            )
        }
        return result[0].id
    }

    const clientByEmail = clients.find((client) => client.email === email)
    const clientByPhone = clients.find((client) => client.phone === phone)

    // 3. Есть и email, и телефон у одной записи
    if (
        clientByEmail &&
        clientByPhone &&
        clientByEmail.id === clientByPhone.id
    ) {
        const result = await sql`
            UPDATE all_clients
            SET fio = ${fio},  
                dateConsent_pd =  COALESCE(dateConsent_pd, ${promoDatePdSql}),
                dateConsent_promo = COALESCE(dateConsent_promo, ${promoDateSql}),
                consent_promo = ${consent_promo} ,
                consent_pd = ${consent_pd} 	
            WHERE id = ${clientByEmail.id}
            RETURNING data_last_consult, counter_consult, id
        `
        // const result = await sql`
        //     UPDATE all_clients
        //     SET fio = ${fio},
        //         dateConsent_pd = ${dateConsent_pd},
        //         dateConsent_promo = COALESCE(dateConsent_promo, ${promoDateSql})
        //         consent_pd},
        //         ${consent_promo}
        //     WHERE id = ${clientByEmail.id}
        //     RETURNING data_last_consult, counter_consult
        // `
        if (check) {
            return helpFinc(
                result[0].counter_consult,
                result[0].data_last_consult,
            )
        }
        return result[0].id
    }

    // 4. Есть только телефон
    if (clientByPhone && !clientByEmail) {
        const result = await sql`
            UPDATE all_clients
            SET fio = ${fio},
                email = ${email},
                dateConsent_pd =  COALESCE(dateConsent_pd, ${promoDatePdSql}),
                dateConsent_promo = COALESCE(dateConsent_promo, ${promoDateSql}),
                consent_promo = ${consent_promo} ,
                consent_pd = ${consent_pd} 	
            WHERE id = ${clientByPhone.id}
            RETURNING data_last_consult, counter_consult,id
        `
        //    const result = await sql`
        //     UPDATE all_clients
        //     SET fio = ${fio},
        //         email = ${email},
        //         dateConsent_pd = ${dateConsent_pd},
        //         dateConsent_promo = COALESCE(dateConsent_promo, ${promoDateSql})
        //     WHERE id = ${clientByPhone.id}
        //     RETURNING data_last_consult, counter_consult
        // `
        if (check) {
            return helpFinc(
                result[0].counter_consult,
                result[0].data_last_consult,
            )
        }
        return result[0].id
    }

    // 5. Есть только email
    if (clientByEmail && !clientByPhone) {
        // const result = await sql`
        //     UPDATE all_clients
        //     SET fio = ${fio},
        //         phone = ${phone},
        //         dateConsent_pd = ${dateConsent_pd},
        //         dateConsent_promo = COALESCE(dateConsent_promo, ${promoDateSql})
        //     WHERE id = ${clientByEmail.id}
        //     RETURNING data_last_consult, counter_consult
        // `
        const result = await sql`
            UPDATE all_clients
            SET fio = ${fio},
                phone = ${phone},
                dateConsent_pd =  COALESCE(dateConsent_pd, ${promoDatePdSql}),
                dateConsent_promo = COALESCE(dateConsent_promo, ${promoDateSql}),
                consent_promo = ${consent_promo} ,
                consent_pd = ${consent_pd} 	
            WHERE id = ${clientByEmail.id}
            RETURNING data_last_consult, counter_consult,id
        `

        if (check) {
            return helpFinc(
                result[0].counter_consult,
                result[0].data_last_consult,
            )
        }

        return result[0].id
    }

    // 6. Email и телефон существуют, но принадлежат разным клиентам
    throw new Error('Email и телефон принадлежат разным клиентам')
}

export async function updateClientReviewsConsent(
    email: string,
    consent_rewiews: boolean,
    consent_data_rewiews: string | null, // или Date, в зависимости от типа в БД
): Promise<boolean> {
    // Пытаемся обновить запись по email и сразу просим вернуть id (RETURNING id)
    const result = await sql`
        UPDATE all_clients
        SET consent_rewiews = ${consent_rewiews},
            consent_data_rewiews = ${consent_data_rewiews}
        WHERE email = ${email}
        RETURNING id, data_last_consult
    `

    // Если массив result не пустой, значит клиент с таким email был найден и успешно обновлен
    if (
        result.length > 0 &&
        result[0].data_last_consult !== null &&
        result[0].data_last_consult !== false &&
        result[0].data_last_consult !== ''
    ) {
        return true
    }

    // Если база ничего не вернула (длина 0), значит такого email нет в таблице
    return false
}
// export async function dbCreateClient(
//     fio: string,
//     phone: string,
//     email: string,
//     check: boolean,
//     dateConsent_pd: false | string,
//     dateConsent_promo: false | string,
// ) {
//     if (dateConsent_pd) {
//         const helpFinc = (count: number, date: string | Date | null) => {
//             if (count <= 0 || date === null) {
//                 return false
//             }
//             if (count <= 0 && date === null) {
//                 return false
//             }
//             const lastConsultDate = new Date(date)
//             const now = new Date()

//             // Получаем разницу в миллисекундах
//             const diffInMs = now.getTime() - lastConsultDate.getTime()

//             // Переводим миллисекунды в дни (1000 мс * 60 сек * 60 мин * 24 часа)
//             const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
//             return diffInDays >= 0 && diffInDays <= 21
//         }

//         // 1. Ищем клиента по телефону или email
//         const clients = await sql`
//         SELECT id, fio, phone, email, dateConsent_pd ,dateConsent_promo
//         FROM all_clients
//         WHERE email = ${email}
//            OR phone = ${phone}
//     `

//         // 2. Нет ни телефона, ни email
//         if (clients.length === 0) {
//             const result = await sql`
//             INSERT INTO all_clients (fio, phone, email, data_last_consult, counter_consult, dateConsent_pd, dateConsent_promo)
//             VALUES (${fio}, ${phone}, ${email}, null, 0,${dateConsent_pd}, ${dateConsent_promo})
//             RETURNING data_last_consult, counter_consult
//         `
//             if (check) {
//                 return helpFinc(
//                     result[0].counter_consult,
//                     result[0].data_last_consult,
//                 )
//             }
//             return
//         }

//         const clientByEmail = clients.find((client) => client.email === email)

//         const clientByPhone = clients.find((client) => client.phone === phone)

//         // 3. Есть и email, и телефон у одной записи
//         if (
//             clientByEmail &&
//             clientByPhone &&
//             clientByEmail.id === clientByPhone.id
//         ) {
//             const result = await sql`
//             UPDATE all_clients
//             SET fio = ${fio},
//                 dateConsent_pd = ${dateConsent_pd},
//                 dateConsent_promo=${dateConsent_promo}
//             WHERE id = ${clientByEmail.id}
//             RETURNING data_last_consult, counter_consult
//         `
//             if (check) {
//                 return helpFinc(
//                     result[0].counter_consult,
//                     result[0].data_last_consult,
//                 )
//             }
//             return
//         }

//         // 4. Есть только телефон
//         if (clientByPhone && !clientByEmail) {
//             const result = await sql`
//             UPDATE all_clients
//             SET fio = ${fio},
//                 email = ${email},
//                 dateConsent_pd = ${dateConsent_pd},
//                 dateConsent_promo=${dateConsent_promo}
//             WHERE id = ${clientByPhone.id}
//             RETURNING data_last_consult, counter_consult
//         `
//             if (check) {
//                 return helpFinc(
//                     result[0].counter_consult,
//                     result[0].data_last_consult,
//                 )
//             }
//             return
//         }
//         // 5. Есть только email
//         if (clientByEmail && !clientByPhone) {
//             const result = await sql`
//             UPDATE all_clients
//             SET fio = ${fio},
//                 phone = ${phone}
//                 dateConsent_pd = ${dateConsent_pd},
//                 dateConsent_promo=${dateConsent_promo}
//             WHERE id = ${clientByEmail.id}
//             RETURNING data_last_consult, counter_consult
//         `
//             if (check) {
//                 return helpFinc(
//                     result[0].counter_consult,
//                     result[0].data_last_consult,
//                 )
//             }
//             return
//         }
//     }
//     // 6. Email и телефон существуют,  но принадлежат разным клиентам
//     throw new Error('Email и телефон принадлежат разным клиентам')
// }

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

export async function dbUpdateListIpClients(
    idClient: number,
    clientIp: string,
) {
    const result = await sql`
    INSERT INTO ips_all_clients (id_client, ip)
    SELECT ${idClient}, ${clientIp}
    WHERE NOT EXISTS (
        SELECT 1 
        FROM ips_all_clients 
        WHERE id_client = ${idClient} 
          AND ip = ${clientIp}
    )RETURNING id
`
    // Если запись была добавлена, возвращаем её id
    if (result.length > 0) {
        return result[0].id
    }

    // Если связка клиента и IP уже существует, просто возвращаем null
    return null
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
    approove_oferta: boolean
    date_approove_oferta: false | string
    ip_order: string
}

export async function dbCreateOrder(orderData: OrderData) {
    // const price = orderData.price === 'consult' ? 1500 : 1000
    const approoveOferta = orderData.approove_oferta
        ? orderData.approove_oferta
        : null
    const dateApprooveOferta = orderData.date_approove_oferta
        ? orderData.date_approove_oferta
        : null
    const result = await sql`
        INSERT INTO orders (
            fio, phone, email, date, time, consent_pd, consent_promo, 
            verification_code, approve, approve_pr,  price, payment, approove_oferta, date_approove_oferta,ip_order
        ) VALUES (
            ${orderData.fio}, ${orderData.phone}, ${orderData.email}, 
            ${orderData.date}, ${orderData.time}, ${orderData.consent_pd}, 
            ${orderData.consent_promo}, ${orderData.verification_code},  
            true, true, ${orderData.price}, false,${approoveOferta},${dateApprooveOferta},${orderData.ip_order}
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

export async function dbUpdateDataLastConsultAndCounterConsult(id: number) {
    try {
        const result = await sql`
            UPDATE all_clients
            SET
                counter_consult = COALESCE(counter_consult, 0) + 1,
                data_last_consult = CURRENT_DATE
            WHERE id = ${id}
            RETURNING id, counter_consult, data_last_consult
        `

        if (result.length === 0) {
            return {
                success: false,
                message: 'Клиент не найден',
            }
        }

        return {
            success: true,
            message: 'дата последнего обращения и счетчик обновлены',
        }
    } catch (error) {
        console.error('Ошибка обновления даты и счётчика консультаций:', error)

        return {
            success: false,
            message: 'Ошибка при обновлении клиента',
        }
    }
}
export interface SiteContentItem {
    id: number
    entity_name: string
    title: string | null
    description_1: string | null
    description_2: string | null
    description_3: string | null
    price: number | null
    link: string | null
    image: string | null
    is_active: boolean
    created_at?: Date | string
}

// export async function dbGetAllSiteContentClient() {
//     try {
//         const result = await sql`
//       SELECT
//         id,
//         entity_name,
//         title,
//         description_1,
//         description_2,
//         description_3,
//         price,
//         link,
//         image,
//         is_active,
//         created_at
//       FROM site_content
//       ORDER BY id ASC
//     `
//         return { success: true, data: Array.from(result) as SiteContentItem[] }
//     } catch (error) {
//         console.error('Ошибка при получении значений контента сайта:', error)
//         return { success: false, data: [] }
//     }
// }
