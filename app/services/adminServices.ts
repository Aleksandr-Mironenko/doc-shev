// adminServices.ts
import sql from '@/app/services/lib/db' // Подключение к вашей БД

interface AddSlotResult {
    success: boolean
    message?: string
}

export async function dbAddAvailableTime(
    dateString: string,
    timeString: string,
): Promise<AddSlotResult> {
    try {
        if (!dateString || !timeString) {
            return { success: false, message: 'Дата и время обязательны' }
        }

        // Вставка новой записи в таблицу time_slots
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
