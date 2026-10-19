//  нужно:

// Завести карточку в Яндекс Бизнес
// Привязать к этому же адресу и телефону
// Добавить сайт

import Login from '@/app/components/LoginForm/LoginForm'
import styles from './styles.module.scss'
import Header from '@/app/components/header/header'
import Footer from '@/app/components/footer/Footer'

export const dynamic = 'force-dynamic'

export type Dish = {
    id: string
    menu_id: string
    name: string
    ingredients: string
    short_description?: string
    full_description?: string
    weight?: string
    price: number
    image_url?: string
    order_index?: number
    is_available?: boolean
    slugs: string[]
}

export default async function MenuPagesClient() {
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    return (
        <>
            <main className={styles.main}>
                <div className={styles.wrapper}>
                    <Header />

                    <h1 aria-hidden="false" className={styles.visuallyHidden}>
                        Кафе и услуги питания в Бору — кейтеринг, банкеты,
                        корпоративное питание
                    </h1>

                    {/* <AdminPage /> */}

                    <Login />
                   
                    <Footer />
                </div>
            </main>
        </>
    )
}
// ✅ Что нужно сделать (обязательно)
// 🔹 1. Добавить сайт в поисковики
// Google Search Console
// Яндекс Вебмастер

// 👉 Там:

// добавить сайт
// отправить sitemap
// запросить индексацию
// 🔹 2. Сделать sitemap.xml

// Пример:

// https://bor-food.ru/sitemap.xml
// 🔹 3. Проверить robots.txt

// Убедись, что нет:

// Disallow: /
// 🔹 4. Добавить title и meta

// На главной странице должно быть:

// <title>Bor Food — доставка еды</title>
// 🔹 5. Добавить упоминания

// Минимум:

// соцсети
// 2–3 ссылки с других сайтов
// ⚡ Важный момент про запрос "bor-food"

// Поисковик может:

// воспринимать это как общий текст
// не связывать с доменом

// 👉 Лучше оптимизировать под:

// bor food
// бор фуд
// bor-food доставка

// максимальная ширина 1950
//ширина основного блока примерно 55- 60%
//слева 15-17%
//справа остаток
// при изменении ширины меняется размер основного блока вбок
// у основного блока есть минимальный и максимальный размер
// при его достижении меняется ширина левого меню
// про достижении определенного размера это меню меняется на меню под шапкой
// справа корзина 2 состояния доставка и самовывоз
// туда с локального хранилища - вопрос как рассчитывать
// переход к оформлению - заполнение формы

//  async function translate(text, from = "en", to = "ru") {
//   const res = await fetch("https://api.mymemory.translated.net/get?q="
//       + encodeURIComponent(text) + `&langpair=${from}|${to}`);

//   const data = await res.json();
//   return data.responseData.translatedText;
// }

// translate("Hello world").then(console.log);
