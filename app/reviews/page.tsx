// 👉 тебе нужно:

// Завести карточку в Яндекс Бизнес
// Привязать к этому же адресу и телефону
// Добавить сайт

export default function Wrapper() {
    return (
        <div className={styles.wrapper}>
            <Header />
            <HeroSection />
            <ButtonsHero />
            <Info />
            {/* <Down /> */}
            <IHelp />
            <PublicsSection />
            {/* <ServicesSection /> */}
            <Reviews />
            <CatchUp />
            <Appointment />
        </div>
    )
}

import styles from './pageStyles.module.scss'
import Header from '@/app/components/Header/Header'
import Footer from '@/app/components/Footer/Footer'
import Menus from '@/app/components/Menus/Menus'
import Basket from '@/app/components/Basket/Basket'
import Appointment from '../appointment/appointment'
import ButtonsHero from '../buttonsHero/buttonsHero'
import CatchUp from '../catchUp/catchUp'
import HeroSection from '../HeroSection/HeroSection'
import Info from '../Info/Info'
import PublicsSection from '../publicsSection/publicsSection'
import Reviews from '../reviews/reviews'
import styles from './wrapper.module.scss'
import Header from '@/app/components/header/header'
import IHelp from '@/app/components/iHelp/iHelp'
import { getReviews } from '@/services/reviewsServise'
import ReviewPage from '../components/ReviewPage/ReviewPage'
import { getPublicInfo } from '@/services/publicInfoServise'

export const dynamic = 'force-dynamic'

type Review = {
    id: string
    image_url: string
    created_at: string
}
export default async function MenuPagesClient() {
    const generateReviewsSEO = (city = 'Бор') => {
        return [
            `Отзывы о доставке еды ${city}`,
            `Отзывы о кафе ${city}`,
            `Отзывы клиентов кафе`,
            `Рейтинг доставки еды`,
            `Лучшее кафе отзывы`,
        ]
    }
    const reviews: Review[] = await getReviews() // получу все отзывы и передам на отображение

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const publicInfo = await getPublicInfo()
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

            <main className={styles.wrapper}>
                <section>
                    <h2 className={styles.visuallyHidden}>
                        Советы по вашему здоровью от врача нутрициолога
                    </h2>
                    <p className={styles.visuallyHidden}>
                        Шитова Екатерина Вадимовна оказание консультационных о
                        здоровье
                    </p>
                </section>

                <Header />
                <HeroSection />
                <ButtonsHero />
                <Info />
                {/* <Down /> */}
                <IHelp />
                <PublicsSection />
                {/* <ServicesSection /> */}
                <Reviews />
                <CatchUp />
                <Appointment />
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
