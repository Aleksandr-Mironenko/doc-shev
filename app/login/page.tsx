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
            {/* Local Business */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FoodEstablishment',
                        name: 'Кафе и услуги питания в Бору',
                        url: BASE_URL,
                        areaServed: 'Бор, Нижегородская область',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: 'ул. Неклюдово, 1',
                            addressLocality: 'Бор',
                            addressRegion: 'Нижегородская область',
                            addressCountry: 'RU',
                        },
                        geo: {
                            '@type': 'GeoCoordinates',
                            latitude: 56.404115,
                            longitude: 44.006722,
                        },
                        servesCuisine: 'Русская кухня',
                        openingHours: 'Mo-Su 09:00-20:00',
                        priceRange: '₽₽',
                        description:
                            'Кафе, кейтеринг и организация питания в городе Бор: банкеты, поминки, корпоративное питание',
                        telephone: '+7-961-638-50-60',
                        email: 'n.tranceva@mail.ru',
                    }),
                }}
            />
            {/* Legal Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'ИП Транцева Наталья Алексеевна',
                    }),
                }}
            />
            {/* WebSite + SearchAction */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        url: BASE_URL,
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: `${BASE_URL}/search?q={search_term_string}`,
                            'query-input': 'required name=search_term_string',
                        },
                    }),
                }}
            />

            {/* Breadcrumbs */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Главная',
                                item: `${BASE_URL}/`,
                            },
                        ],
                    }),
                }}
            />
            <main className={styles.main}>
                <div className={styles.wrapper}>
                    <Header />

                    <h1 aria-hidden="false" className={styles.visuallyHidden}>
                        Кафе и услуги питания в Бору — кейтеринг, банкеты,
                        корпоративное питание
                    </h1>

                    {/* <AdminPage /> */}

                    <Login />
                    <section>
                        <h2 className={styles.visuallyHidden}>
                            Организация питания: кафе, выездное обслуживание и
                            питание для организаций
                        </h2>
                        <p className={styles.visuallyHidden}>
                            ИП Транцева Наталья Алексеевна оказывает услуги
                            общественного питания в городе Бор и Нижегородской
                            области. Основные направления - работа кафе,
                            организация мероприятий и выездное обслуживание. В
                            кафе можно ежедневно пообедать, провести встречу или
                            заказать питание для небольшой компании.
                            Предлагаются блюда домашней кухни, доступные по цене
                            и подходящие для регулярного посещения.
                            Осуществляется организация мероприятий: корпоративы,
                            банкеты, поминальные обеды и семейные торжества.
                            Подбирается меню, учитываются формат мероприятия и
                            количество гостей. Доступен выездной кейтеринг -
                            приготовление и доставка блюд на площадку заказчика
                            с обслуживанием. Для организаций предлагается
                            питание сотрудников по договору: регулярные поставки
                            готовых обедов или организация питания на территории
                            заказчика.
                        </p>
                    </section>
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
