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

        //         await sql`CREATE OR REPLACE FUNCTION set_initial_room_id()
        // RETURNS trigger AS $$
        // DECLARE
        //   formatted_date text;
        //   formatted_time text;
        // BEGIN

        //   formatted_date := replace(NEW.date, '-', '');
        //   formatted_time := replace(NEW.time, ':', '');

        //   NEW.room_id := generate_random_string(10) || 'date' || formatted_date || 'time' || formatted_time;

        //   RETURN NEW;
        // END;
        // $$ LANGUAGE plpgsql;`

        //         await sql`
        // DROP TRIGGER IF EXISTS trigger_set_initial_room_id ON orders;
        // `
        //         await sql`CREATE TRIGGER trigger_set_initial_room_id
        // BEFORE INSERT ON orders
        // FOR EACH ROW
        // EXECUTE FUNCTION set_initial_room_id();
        // `
        //         await sql`CREATE TRIGGER trigger_set_initial_room_id`
        //         await sql`CREATE OR REPLACE FUNCTION generate_random_string(length integer)
        // RETURNS text AS $$
        // DECLARE
        //   chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
        //   result text := '';
        //   i integer := 0;
        // BEGIN
        //   IF length < 0 THEN
        //     RAISE EXCEPTION 'Длина не может быть отрицательной';
        //   END IF;

        //   FOR i IN 1..length LOOP
        //     result := result || chars[1+random()*(array_length(chars, 1)-1)];
        //   END LOOP;

        //   RETURN result;
        // END;
        // $$ LANGUAGE plpgsql; `

        //         await sql`CREATE OR REPLACE FUNCTION set_initial_room_id()
        // RETURNS trigger AS $$
        // DECLARE
        //   formatted_date text := '';
        //   formatted_time text := '';
        // BEGIN

        //   IF NEW.date IS NOT NULL THEN
        //     formatted_date := replace(NEW.date, '-', '');
        //   END IF;

        //   IF NEW.time IS NOT NULL THEN
        //     formatted_time := replace(NEW.time, ':', '');
        //   END IF;

        //   NEW.room_id := generate_random_string(10) || date || formatted_date || time || formatted_time;

        //   NEW.link := NULL;

        //   RETURN NEW;
        // END;
        // $$ LANGUAGE plpgsql;`
        //         await sql`
        //     CREATE OR REPLACE FUNCTION generate_random_string(length integer)
        //     RETURNS text AS $$
        //     DECLARE
        //       chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
        //       result text := '';
        //       i integer := 0;
        //     BEGIN
        //       IF length < 0 THEN
        //         RAISE EXCEPTION 'Длина не может быть отрицательной';
        //       END IF;

        //       FOR i IN 1..length LOOP
        //         result := result || chars[1+random()*(array_length(chars, 1)-1)];
        //       END LOOP;

        //       RETURN result;
        //     END;
        //     $$ LANGUAGE plpgsql;
        //   `

        //         // 2. Создаем функцию триггера (с правильным использованием NEW.date и NEW.time)
        //         await sql`
        //     CREATE OR REPLACE FUNCTION set_initial_room_id()
        //     RETURNS trigger AS $$
        //     DECLARE
        //       formatted_date text := '';
        //       formatted_time text := '';
        //     BEGIN
        //       IF NEW.date IS NOT NULL THEN
        //         formatted_date := replace(NEW.date, '-', '');
        //       END IF;

        //       IF NEW.time IS NOT NULL THEN
        //         formatted_time := replace(NEW.time, ':', '');
        //       END IF;

        //       -- Собираем room_id: 10 символов + очищенная дата + очищенное время
        //       NEW.room_id := generate_random_string(10) || 'date' || formatted_date || 'time' || formatted_time;

        //       -- Поле link оставляем пустым до оплаты
        //       NEW.link := NULL;

        //       RETURN NEW;
        //     END;
        //     $$ LANGUAGE plpgsql;
        //   `

        //         // 3. Удаляем старый триггер (если был) и создаем новый
        //         await sql`DROP TRIGGER IF EXISTS trigger_set_initial_room_id ON orders;`

        //         await sql`
        //     CREATE TRIGGER trigger_set_initial_room_id
        //     BEFORE INSERT ON orders
        //     FOR EACH ROW
        //     EXECUTE FUNCTION set_initial_room_id();
        //   `
        // await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS date_payment TIMESTAMPTZ;`
        //         await sql`
        //   CREATE OR REPLACE FUNCTION generate_link_on_payment()
        //   RETURNS trigger AS $$
        //   DECLARE
        //     formatted_payment_date text;

        //     base_url text := 'https://edgeconf.ru/call/?roomId=serv0';
        //   BEGIN

        //     IF NEW.payment = true AND (OLD.payment = false OR OLD.payment IS NULL) THEN

        //       NEW.date_payment := timezone('UTC', now());

        //       formatted_payment_date := to_char(NEW.date_payment, 'YYYYMMDDHH24MISS');

        //       NEW.link := formatted_payment_date || base_url || formatted_payment_date || NEW.room_id;

        //     END IF;

        //     RETURN NEW;
        //   END;
        //   $$ LANGUAGE plpgsql;
        // `

        //         // 5. Удаляем старый триггер (если есть) и вешаем новый на UPDATE
        //         await sql`DROP TRIGGER IF EXISTS trigger_generate_link_on_payment ON orders;`

        //         await sql`
        //   CREATE TRIGGER trigger_generate_link_on_payment
        //   BEFORE UPDATE ON orders
        //   FOR EACH ROW
        //   EXECUTE FUNCTION generate_link_on_payment();
        // `
        // 1. Добавляем колонку (если еще не добавлена)
        //         await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS date_payment TIMESTAMPTZ;`

        //         // 2. Обновляем функцию триггера с правильным порядком сборки ссылки
        //         await sql`
        //   CREATE OR REPLACE FUNCTION generate_link_on_payment()
        //   RETURNS trigger AS $$
        //   DECLARE
        //     formatted_payment_date text;
        //     base_url text := 'https://edgeconf.ru/call/?roomId=serv0';
        //   BEGIN
        //     IF NEW.payment = true AND (OLD.payment = false OR OLD.payment IS NULL) THEN

        //       -- Записываем дату оплаты по UTC
        //       NEW.date_payment := timezone('UTC', now());

        //       -- Форматируем дату в строку (ГГГГММДДЧЧММСС)
        //       formatted_payment_date := to_char(NEW.date_payment, 'YYYYMMDDHH24MISS');

        //       -- ПРАВИЛЬНЫЙ ПОРЯДОК: сначала URL, затем дата и room_id
        //       NEW.link := base_url || formatted_payment_date || NEW.room_id;

        //     END IF;

        //     RETURN NEW;
        //   END;
        //   $$ LANGUAGE plpgsql;
        // `

        //         // 3. Обновляем сам триггер
        //         await sql`DROP TRIGGER IF EXISTS trigger_generate_link_on_payment ON orders;`

        //         await sql`
        //   CREATE TRIGGER trigger_generate_link_on_payment
        //   BEFORE UPDATE ON orders
        //   FOR EACH ROW
        //   EXECUTE FUNCTION generate_link_on_payment();
        // `
        //         await sql`
        // CREATE TABLE articles (
        //     id SERIAL PRIMARY KEY,
        //     title TEXT NOT NULL,
        //     description TEXT NOT NULL,
        //     full_description TEXT,
        //     preview_image_url TEXT,
        //     external_link TEXT NOT NULL DEFAULT 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_2x_r7.png',
        //     comment TEXT,
        //     active BOOLEAN NOT NULL DEFAULT false,
        //     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        // );
        // `
        //         await sql`
        // CREATE TABLE reviews (
        //     id SERIAL PRIMARY KEY,
        //     comment TEXT,
        //     external_link TEXT NOT NULL,
        //     text TEXT NOT NULL,
        //     active BOOLEAN NOT NULL DEFAULT false,
        //     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        // );`

        //         await sql`
        //   CREATE TABLE variable (

        // id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        // nameDoctor TEXT,

        // profline TEXT,

        // shortDescription TEXT,

        // details UUID,

        // merits UUID,

        // fullDescription TEXT,

        // aboutMe UUID,

        // principles UUID,

        // Education UUID,

        // ihelp UUID

        // );`
        //         await sql`CREATE TABLE technical_recording (

        // id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        // id_variable_part UUID REFERENCES variable(id) ON DELETE CASCADE,

        // name TEXT,

        // image TEXT,

        // deskription1 TEXT,

        // deskription2 TEXT,

        // deskription3 TEXT,

        // titlle TEXT,

        // link TEXT,

        // active BOOLEAN NOT NULL DEFAULT FALSE,

        // comment TEXT

        // );  `
        //         await sql`
        // ALTER TABLE time_slots ADD COLUMN comment TEXT;`
        //         await sql`
        // ALTER TABLE orders ADD COLUMN comment TEXT;`
        //         await sql`
        // ALTER TABLE all_clients ADD COLUMN comment TEXT;`
        //         await sql`
        // ALTER TABLE reviews
        // DROP COLUMN external_link;
        // `
        //         await sql`
        // DELETE FROM all_clients
        // WHERE email = 'sanek.miron2@gmail.com';`
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
                <p>Команда успешно выполнена</p>
            </div>
        )
    } else {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>Ошибка подключения</h1>
                <p>
                    Не удалось выполнить обращение к базе данных (где запущен
                    npm run dev).
                </p>
            </div>
        )
    }
}
