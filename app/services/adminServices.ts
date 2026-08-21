import sql from '@/app/services/lib/db'

interface AddSlotResult {
    success: boolean
    message?: string
}
export interface Article {
    id: number
    title: string
    description: string
    full_description: string | null
    preview_image_url: string | null
    external_link: string
    comment: string | null
    active: boolean
    created_at: Date | string
}

export interface Review {
    id: number
    external_link: string
    text: string
    active: boolean
    created_at: Date | string
    comment: string | null
}

export interface TimeSlot {
    id: number
    data: string | null
    time: string | null
    datatime_reserved: Date | string
    comment: string | null
}

export interface Client {
    id: number
    fio: string
    phone: string
    email: string
    comment: string | null
}

export interface Order {
    id: number
    fio: string
    phone: string
    email: string
    date: string
    time: string
    create_data_time: Date | string
    consent_pd: boolean
    consent_promo: boolean
    verification_code: string
    approve: boolean
    approve_pr: boolean
    payment: boolean | null
    link: string | null
    price: number
    room_id: string | null
    date_payment: Date | string | null
    comment: string | null
}

export async function dbAddAvailableTime(
    dateString: string,
    timeString: string,
): Promise<AddSlotResult> {
    try {
        if (!dateString || !timeString) {
            return { success: false, message: 'Дата и время обязательны' }
        }

        await sql`
            INSERT INTO time_slots (data, time)
            VALUES (${dateString}, ${timeString})
        `

        return { success: true }
    } catch (error) {
        console.error('Ошибка при добавлении слота:', error)
        return { success: false, message: 'Ошибка выполнения запроса к БД' }
    }
}
function isValidColumnName(columnName: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(columnName)
}

export async function getAllOrders(): Promise<{
    success: boolean
    data: Order[]
}> {
    try {
        const result = await sql`SELECT * FROM orders ORDER BY id DESC`
        return { success: true, data: Array.from(result) as Order[] }
    } catch (error) {
        console.error('Error fetching orders:', error)
        return { success: false, data: [] }
    }
}

export async function getAllClients(): Promise<{
    success: boolean
    data: Client[]
}> {
    try {
        const result = await sql`SELECT * FROM all_clients ORDER BY id DESC`
        return { success: true, data: Array.from(result) as Client[] }
    } catch (error) {
        console.error('Error fetching clients:', error)
        return { success: false, data: [] }
    }
}

export async function getTimeSlots(): Promise<{
    success: boolean
    data: TimeSlot[]
}> {
    try {
        const result = await sql`SELECT * FROM time_slots ORDER BY id ASC`
        return { success: true, data: Array.from(result) as TimeSlot[] }
    } catch (error) {
        console.error('Error fetching time slots:', error)
        return { success: false, data: [] }
    }
}
type FieldValue = string | number | boolean | null
export async function updateOrderField(
    id: number,
    columnName: string,
    value: FieldValue,
) {
    try {
        if (!isValidColumnName(columnName)) {
            throw new Error('Invalid column name')
        }

        const slot = await sql.unsafe(
            `
            UPDATE orders 
            SET "${columnName}" = $1 
            WHERE id = $2  
            RETURNING id
        `,
            [value, id],
        )

        if (slot.length > 0) {
            return { success: true }
        } else {
            return {
                success: false,
            }
        }
    } catch (error) {
        console.error(`Error updating order column ${columnName}:`, error)
        return { success: false }
    }
}

export async function updateClientField(
    id: number,
    columnName: string,
    value: FieldValue,
) {
    try {
        if (!isValidColumnName(columnName)) {
            throw new Error('Invalid column name')
        }

        const slot = await sql.unsafe(
            `
            UPDATE all_clients 
            SET "${columnName}" = $1 
            WHERE id = $2  
            RETURNING id
        `,
            [value, id],
        )

        if (slot.length > 0) {
            return { success: true }
        } else {
            return {
                success: false,
            }
        }
    } catch (error) {
        console.error(`Error updating all_clients column ${columnName}:`, error)
        return { success: false }
    }
}

export async function updateClientComment(
    id: number,
    columnName: string,
    value: FieldValue,
) {
    try {
        if (!isValidColumnName(columnName)) {
            throw new Error('Invalid column name')
        }

        const slot = await sql.unsafe(
            `
            UPDATE all_clients 
            SET "${columnName}" = $1 
            WHERE id = $2  
            RETURNING id
        `,
            [value, id],
        )

        if (slot.length > 0) {
            return { success: true }
        } else {
            return {
                success: false,
            }
        }
    } catch (error) {
        console.error(`Error updating all_clients column ${columnName}:`, error)
        return { success: false }
    }
}

export async function updateTimeSlotField(
    id: number,
    columnName: string,
    value: string,
) {
    try {
        if (!isValidColumnName(columnName)) {
            throw new Error('Invalid column name')
        }

        const slot = await sql.unsafe(
            `
            UPDATE time_slots 
            SET "${columnName}" = $1 
            WHERE id = $2  
            RETURNING id
        `,
            [value, id],
        )

        if (slot.length > 0) {
            return { success: true }
        } else {
            return {
                success: false,
            }
        }
    } catch (error) {
        console.error(`Error updating time_slots column ${columnName}:`, error)

        return { success: false }
    }
}

export async function getAllArticles(): Promise<{
    success: boolean
    data: Article[]
}> {
    try {
        const result =
            await sql`SELECT * FROM articles ORDER BY created_at DESC`
        return { success: true, data: Array.from(result) as Article[] }
    } catch (error) {
        console.error('Error fetching articles:', error)
        return { success: false, data: [] }
    }
}

export async function updateArticleField(
    id: number,
    columnName: string,
    value: string | number | boolean | null,
) {
    try {
        if (!isValidColumnName(columnName)) {
            throw new Error('Invalid column name')
        }

        const result = await sql.unsafe(
            `
            UPDATE articles 
            SET "${columnName}" = $1 
            WHERE id = $2  
            RETURNING id
        `,
            [value, id],
        )

        return { success: result.length > 0 }
    } catch (error) {
        console.error(`Error updating article column ${columnName}:`, error)
        return { success: false }
    }
}

export async function getAllReviews(): Promise<{
    success: boolean
    data: Review[]
}> {
    try {
        const result = await sql`SELECT * FROM reviews ORDER BY created_at DESC`
        return { success: true, data: Array.from(result) as Review[] }
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return { success: false, data: [] }
    }
}

export async function updateReviewField(
    id: number,
    columnName: string,
    value: string | number | boolean | null,
) {
    try {
        if (!isValidColumnName(columnName)) {
            throw new Error('Invalid column name')
        }

        const result = await sql.unsafe(
            `
            UPDATE reviews 
            SET "${columnName}" = $1 
            WHERE id = $2  
            RETURNING id
        `,
            [value, id],
        )

        return { success: result.length > 0 }
    } catch (error) {
        console.error(`Error updating review column ${columnName}:`, error)
        return { success: false }
    }
}

export interface AddArticlePayload {
    title: string
    description: string
    full_description?: string | null
    preview_image_url?: string | null
    external_link?: string | null
    comment?: string | null
    active?: boolean
}

export interface AddReviewPayload {
    external_link: string
    text: string
    active?: boolean
}

export async function dbAddArticle(data: AddArticlePayload) {
    try {
        // Базовая валидация обязательных полей
        if (!data.title || !data.description) {
            return {
                success: false,
                message: 'Название и описание обязательны',
            }
        }

        // Дефолтная ссылка, которую мы задавали при создании таблицы
        const defaultLink =
            'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_2x_r7.png'

        const result = await sql`
            INSERT INTO articles (
                title, 
                description, 
                full_description, 
                preview_image_url, 
                external_link, 
                comment, 
                active
            ) VALUES (
                ${data.title}, 
                ${data.description}, 
                ${data.full_description || null}, 
                ${data.preview_image_url || null}, 
                ${data.external_link || defaultLink}, 
                ${data.comment || null}, 
                ${data.active ?? false}
            )
            RETURNING id
        `

        return { success: true, id: result[0].id }
    } catch (error) {
        console.error('Ошибка при добавлении статьи:', error)
        return { success: false, message: 'Ошибка выполнения запроса к БД' }
    }
}

export async function dbAddReview(data: AddReviewPayload) {
    try {
        if (!data.text) {
            return { success: false, message: 'Ссылка и текст обязательны' }
        }

        const result = await sql`
            INSERT INTO reviews (
              
                text, 
                active
            ) VALUES (
             
                ${data.text}, 
                ${data.active ?? false}
            )
            RETURNING id
        `

        return { success: true, id: result[0].id }
    } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error)
        return { success: false, message: 'Ошибка выполнения запроса к БД' }
    }
}

export async function dbGetSucsessbyRoomId(roomId: string) {
    try {
        const order = await sql`
            SELECT link, phone, email
            FROM orders 
            WHERE room_id = ${roomId} 
        `
        const client =
            order.length > 0
                ? await sql`
                SELECT id
                FROM all_clients
                WHERE phone = ${order[0].phone} AND email = ${order[0].email}
            `
                : []

        return order.length > 0
            ? {
                  success: true,
                  link: order[0].link as string,
                  clientId: client[0].id,
              }
            : { success: false }
    } catch (error) {
        console.error('Ошибка поиска заказа в БД:', error)
        return { success: false }
    }
}
export async function dbGetСommentInClient(id: string) {
    try {
        const res = await sql`
            SELECT comment
            FROM all_clients 
            WHERE id = ${id} 
        `

        return res.length > 0
            ? {
                  success: true,

                  comment: res[0].comment,
              }
            : { success: false }
    } catch (error) {
        console.error('Ошибка поиска заказа в БД:', error)
        return { success: false }
    }
}
export async function dbUpdateСommentInClient(id: string, comment: string) {
    try {
        const result = await sql.unsafe(
            `
            UPDATE all_clients 
            SET comment = $1 
            WHERE id = $2  
            RETURNING id
        `,
            [comment, id],
        )
        return { success: result.length > 0 }
    } catch (error) {
        console.error(`Не удалось обновить комментарий`, error)
        return { success: false }
    }
}
