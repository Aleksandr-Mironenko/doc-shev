import sql from '@/app/services/lib/db' // Путь до твоего файла инициализации из предыдущего шага

export default async function TestDBPage() {
    let isSuccess = false
    let errorMessage = ''

    try {
        // Выполняем SQL-запрос на создание таблицы
        //         await sql`

        // CREATE TABLE IF NOT EXISTS all_clients (
        //     id SERIAL PRIMARY KEY,
        //     fio TEXT,
        //     phone TEXT,
        //     email TEXT
        // );
        // `
        //         await sql`
        // CREATE TABLE IF NOT EXISTS email_codes (
        //     id SERIAL PRIMARY KEY,
        //     email TEXT,
        //     verification_code TEXT,
        //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        // );
        // `
        //         await sql`
        // CREATE OR REPLACE FUNCTION generate_verification_code()
        // RETURNS TRIGGER AS $$
        // BEGIN

        //     IF NEW.verification_code = 'q' THEN
        //         NEW.verification_code := floor(random() * (99999 - 10000 + 1) + 10000)::text;
        //     END IF;
        //     RETURN NEW;
        // END;
        // $$ LANGUAGE plpgsql;
        //  `
        //         await sql`
        // CREATE TRIGGER trigger_generate_code
        // BEFORE INSERT ON email_codes
        // FOR EACH ROW
        // EXECUTE FUNCTION generate_verification_code();
        //  `
        //         await sql`
        // CREATE TABLE IF NOT EXISTS orders (
        //     id SERIAL PRIMARY KEY,
        //     fio TEXT,
        //     phone TEXT,
        //     email TEXT,
        //     date TEXT,
        //     time TEXT,
        //     create_data_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //     consent_pd BOOLEAN,
        //     consent_promo BOOLEAN,
        //     verification_code TEXT,
        //     approve BOOLEAN DEFAULT false,
        //     approve_pr BOOLEAN DEFAULT false,
        //     paiment BOOLEAN DEFAULT false,
        //     link TEXT
        // );
        // `
        //         await sql`CREATE TABLE IF NOT EXISTS time_slots (
        //     id SERIAL PRIMARY KEY,
        //     data TEXT,
        //     time TEXT,
        //     datatime_reserved TIMESTAMP
        // );
        //     `
//         await sql`
// ALTER TABLE orders ADD COLUMN price INTEGER;
//  `
//         await sql` 
// ALTER TABLE orders RENAME COLUMN paiment TO payment;
//     `
        isSuccess = true
    } catch (error) {
        // Если что-то пошло не так (например, неверный пароль в .env.local)
        console.error('Ошибка БД:', error)
        errorMessage =
            error instanceof Error ? error.message : 'Неизвестная ошибка'
    }

    // Если код дошел до этой строчки, значит запрос выполнился без ошибок
    if (isSuccess) {
        return (
            <div style={{ padding: '20px', color: 'green' }}>
                <h1>Успех!</h1>
                <p>
                    Подключение к БД работает. Таблица &quot;orders&quot;
                    успешно создана или уже существует.
                </p>
            </div>
        )
    } else {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>Ошибка подключения</h1>
                <p>
                    Не удалось создать таблицу. Посмотри детали ошибки в
                    терминале (где запущен npm run dev).
                </p>
            </div>
        )
    }
}
