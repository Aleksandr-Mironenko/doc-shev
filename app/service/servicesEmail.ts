// --- ВНЕШНИЕ СЕРВИСЫ (ИМИТАЦИЯ) ---

export async function serviceSendEmail(email: string, message: string) {
    console.log(`Отправка email на ${email}: ${message}`)
    return true
}
