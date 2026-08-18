// ..создаем ССЫЛКУ В MTS LINK

export default async function serviceCreateMtsLink(
    dateString: string,
    timeString: string,
    fio: string,
) {
    try {
        // dateString формата "YYYY-MM-DD", timeString формата "HH:MM"
        const [year, month, day] = dateString.split('-')
        const [hour, minute] = timeString.split(':')

        const TOKEN = process.env.MTS_LINK_TOKEN // Токен из переменных окружения

        // 1. Создаем эвент
        const eventResponse = await fetch(
            'https://userapi.mts-link.ru/v3/events',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-auth-token': TOKEN!,
                },
                body: new URLSearchParams({
                    name: `Консультация: ${fio}`,
                }),
            },
        )

        const eventData = await eventResponse.json()
        if (!eventData.eventId) return { success: false }

        const eventId = eventData.eventId

        // 2. Создаем сессию с конкретной датой и временем
        const sessionResponse = await fetch(
            `https://userapi.mts-link.ru/v3/events/${eventId}/sessions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-auth-token': TOKEN!,
                },
                body: new URLSearchParams({
                    'startsAt[date][year]': year,
                    'startsAt[date][month]': month,
                    'startsAt[date][day]': day,
                    'startsAt[time][hour]': hour,
                    'startsAt[time][minute]': minute,
                }),
            },
        )

        const sessionData = await sessionResponse.json()

        // Возвращаем сгенерированную ссылку на встречу
        // (в зависимости от структуры ответа поле ссылки может содержаться в sessionData или eventData)
        const link = sessionData.link || eventData.link

        if (link) {
            return { success: true, link }
        }

        return { success: false }
    } catch (error) {
        console.error('Ошибка при обращении к API MTS Link:', error)
        return { success: false }
    }
}
