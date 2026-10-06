// 👉 тебе нужно:

// Завести карточку в Яндекс Бизнес
// Привязать к этому же адресу и телефону
// Добавить сайт

import styles from './pageStyles.module.scss'

import CatchUp from '@/app/components/catchUp/catchUp'
// import HeroSection from '@/app/components/HeroSection/HeroSection'
import Info from '@/app/components/Info/Info'
import PublicsSection from '@/app/components/publicsSection/publicsSection'
import Header from '@/app/components/header/header'
import IHelp from '@/app/components/iHelp/iHelp'
import ButtonsHeroCopy from '../components/buttonsHeroCopy/buttonsHero'
import HeroCalend from '../components/HeroCalend/HeroCalend'
import Footer from '../components/footer/Footer'
import {
    dbGetAllServices,
    dbGetAllSiteContent,
    getAllArticles,
} from '../service/adminServices'
import { dbGetAvailableDates } from '../service/servicesDB'
import AboutMeContent from '../components/AboutMeContent/AboutMeContent'
import PolicyiPolitic from '../components/PoliciPolitic/PolicyiPolitic'
import MaterialCard from '../components/MaterialCard/MaterialCard'
import Paycards from '../components/Paycards/Paycards'
export interface PaidContent {
    id: number
    title: string
    description_1?: string | null
    description_1_name?: string | null
    description_2?: string | null
    description_2_name?: string | null
    description_3?: string | null
    description_3_name?: string | null
    description_4?: string | null
    description_4_name?: string | null
    description_5?: string | null
    description_5_name?: string | null
    link?: string | null
    is_check: boolean
    is_active?: boolean | null
    price: number
    image?: string | null
    created_at: Date | string
    entity: string
}
export interface FreeContent {
    id: number
    title: string
    description_1?: string | null
    description_1_name?: string | null
    description_2?: string | null
    description_2_name?: string | null
    description_3?: string | null
    description_3_name?: string | null
    description_4?: string | null
    description_4_name?: string | null
    description_5?: string | null
    description_5_name?: string | null
    link?: string | null
    is_check: boolean
    is_active?: boolean | null
    price: number
    image?: string | null
    created_at: Date | string
    entity: string
}
export const dynamic = 'force-dynamic'

export default async function MakeAnAppointment() {
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const service = await dbGetAllServices()
    // const services = siteContent.data.filter(
    //     (el) => el.entity_name === 'services',
    // )
    // console.log(services)

    const paidContent = service.data.filter(
        (el) => el.entity === 'paid_content',
    )
    // const freeContent = service.data.filter((el) => el.entity === 'freeContent')

    const content = paidContent.map((el) => ({
        id: el.id,
        title: el.title,
        description_1: el.description_1,
        description_1_name: el.description_1_name,
        description_2: el.description_2,
        description_2_name: el.description_2_name,
        description_3: el.description_3,
        description_3_name: el.description_3_name,
        description_4: el.description_4,
        description_4_name: el.description_4_name,
        description_5: el.description_5,
        description_5_name: el.description_5_name,
        // link: el.link,
        is_check: el.is_check,
        is_active: el.is_active,
        price: el.price,
        image: el.image,
        created_at: el.created_at,
        entity: el.entity,
    }))

    const mockServices = [
        {
            id: 1,
            title: 'Персональная онлайн-консультация',
            description_1: 'Разбор ваших анализов и пищевых привычек',
            description_1_name: 'Что входит',
            description_2: '60 минут',
            description_2_name: 'Длительность',
            description_3: 'Индивидуальный план питания в PDF после созвона',
            description_3_name: 'Результат',
            description_4: null,
            description_4_name: null,
            description_5: null,
            description_5_name: null,
            link: null,
            is_check: false,
            is_active: true,
            price: 3500.0, // В БД numeric(10,2)
            image: 'https://placehold.co/600x400/59B86A/FFFFFF?text=Онлайн-консультация', // Заглушка
            entity: 'paidContent',
            created_at: new Date().toISOString(),
        },
        {
            id: 2,
            title: 'Методичка «Сбалансированный рацион»',
            description_1: 'PDF-документ',
            description_1_name: 'Формат',
            description_2: '25 страниц с готовыми рецептами',
            description_2_name: 'Объем',
            description_3: null, // Оставлено пустым, чтобы показать гибкость верстки
            description_3_name: null,
            description_4: null,
            description_4_name: null,
            description_5: null,
            description_5_name: null,
            link: 'https://storage.example.com/guide.pdf',
            is_check: false,
            is_active: true,
            price: 2500.0,
            image: 'https://placehold.co/600x400/F5F5F5/333333?text=PDF-Методичка', // Заглушка
            entity: 'paidContent',
            created_at: new Date().toISOString(),
        },
    ]

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
            <div>
                <main className={styles.main}>
                    <div className={styles.wrapper}>
                        <section>
                            <h2 className={styles.visuallyHidden}>
                                Советы по вашему здоровью от врача нутрициолога
                            </h2>
                            <p className={styles.visuallyHidden}>
                                Шитова Екатерина Вадимовна оказание
                                консультационных о здоровье
                            </p>
                        </section>
                        <Header />
                        {/* <HeroCalend /> */}
                        {/* <HeroCalend isHi={true} /> */}
                        {/* <ButtonsHeroCopy
                            services={services.data}
                            dates={dates}
                        /> */}
                        {/* <AboutMeContent content={content} /> */}
                        {/* <Info /> */}
                        {/* <Down /> */}
                        {/* <IHelp content={content} /> */}
                        {/* <PublicsSection articlesData={articlesData} /> */}
                        {/* <ServicesSection /> */}
                        {/* <CatchUp /> */}
                        <div className={styles.contactsWrapper}>
                            {' '}
                            <Paycards content={content} />
                        </div>{' '}
                        <Footer />
                    </div>
                </main>
            </div>
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
