// 👉 тебе нужно:

// Завести карточку в Яндекс Бизнес
// Привязать к этому же адресу и телефону
// Добавить сайт

import styles from './pageStyles.module.scss'
import { headers } from 'next/headers'
import CatchUp from '@/app/components/catchUp/catchUp'
// import HeroSection from '@/app/components/HeroSection/HeroSection'
import Info from '@/app/components/Info/Info'
import PublicsSection from '@/app/components/publicsSection/publicsSection'
import Header from '@/app/components/header/header'
import IHelp from '@/app/components/iHelp/iHelp'
import ButtonsHeroCopy from '../../components/buttonsHeroCopy/buttonsHero'
import HeroCalend from '../../components/HeroCalend/HeroCalend'
import Footer from '../../components/footer/Footer'
import {
    dbGetAllServices,
    dbGetAllSiteContent,
    dbGetOneContent,
    getAllArticles,
} from '../../serv/adminServices'
import { dbGetAvailableDates } from '../../serv/servicesDB'
import AboutMeContent from '../../components/AboutMeContent/AboutMeContent'
import PolicyiPolitic from '../../components/PoliciPolitic/PolicyiPolitic'
import MaterialCard from '../../components/MaterialCard/MaterialCard'
import Paycards from '../../components/Paycards/Paycards'
import { dbGetOneService } from '@/app/serv/adminServices'
import { revertSlug } from '@/app/serv/lib/dinamicTranslate/dinamicRevertTranslate'
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

export interface ServiceItem {
    entity: string
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
    link?: string | null // Исправлено: string | null вместо ''
    is_check: boolean
    is_active: boolean | null
    price: number
    image?: string | null
    created_at: Date | string
}
interface PageProps {
    params: Promise<{ service: string }>
}
export const dynamic = 'force-dynamic'

export default async function MakeAnAppointment({ params }: PageProps) {
    const { service } = await params

    const headersList = await headers()

    // 2. Считываем точный путь из нашего заголовка
    const pathname = headersList.get('x-current-path') || ''

    // 3. Получаем динамический базовый URL (если нужен)
    // const BASE_URL = headersList.get('x-site-url') || 'http://localhost:3000'

    // 4. Разбиваем путь на сегменты
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0] || 'home' // Защита на случай главной страницы

    // const slug = createSlug(product.entity) href={`/paid-content/${slug}`}

    const slug = revertSlug(service)
    console.log('slug', slug)
    const serviceData = (await dbGetOneContent(slug)).data

    if (
        !serviceData ||
        (serviceData.entity !== 'paid_content' &&
            serviceData.entity !== 'free_content')
    ) {
        throw new Error('No valid paid or free service data found')
    }

    console.log('serviceData', serviceData)
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const content = {
        id: serviceData.id,
        title: serviceData.title,
        description_1: serviceData.description_1,
        description_1_name: serviceData.description_1_name,
        description_2: serviceData.description_2,
        description_2_name: serviceData.description_2_name,
        description_3: serviceData.description_3,
        description_3_name: serviceData.description_3_name,
        description_4: serviceData.description_4,
        description_4_name: serviceData.description_4_name,
        description_5: serviceData.description_5,
        description_5_name: serviceData.description_5_name,
        // link: serviceData.link,
        is_check: serviceData.is_check,
        is_active: serviceData.is_active,
        price: serviceData.price,
        image: serviceData.image,
        created_at: serviceData.created_at,
        entity: serviceData.entity,
    }

    // const mockServices = [
    //     {
    //         id: 1,
    //         title: 'Персональная онлайн-консультация',
    //         description_1: 'Разбор ваших анализов и пищевых привычек',
    //         description_1_name: 'Что входит',
    //         description_2: '60 минут',
    //         description_2_name: 'Длительность',
    //         description_3: 'Индивидуальный план питания в PDF после созвона',
    //         description_3_name: 'Результат',
    //         description_4: null,
    //         description_4_name: null,
    //         description_5: null,
    //         description_5_name: null,
    //         link: null,
    //         is_check: false,
    //         is_active: true,
    //         price: 3500.0, // В БД numeric(10,2)
    //         image: 'https://placehold.co/600x400/59B86A/FFFFFF?text=Онлайн-консультация', // Заглушка
    //         entity: 'paidContent',
    //         created_at: new Date().toISOString(),
    //     },
    //     {
    //         id: 2,
    //         title: 'Методичка «Сбалансированный рацион»',
    //         description_1: 'PDF-документ',
    //         description_1_name: 'Формат',
    //         description_2: '25 страниц с готовыми рецептами',
    //         description_2_name: 'Объем',
    //         description_3: null, // Оставлено пустым, чтобы показать гибкость верстки
    //         description_3_name: null,
    //         description_4: null,
    //         description_4_name: null,
    //         description_5: null,
    //         description_5_name: null,
    //         link: 'https://storage.example.com/guide.pdf',
    //         is_check: false,
    //         is_active: true,
    //         price: 2500.0,
    //         image: 'https://placehold.co/600x400/F5F5F5/333333?text=PDF-Методичка', // Заглушка
    //         entity: 'paidContent',
    //         created_at: new Date().toISOString(),
    //     },
    // ]

    console.log(revertSlug(`service: ${service}`))
    return (
        <>
            {/* 1. Микроразметка Schema.org: Physician (Показывает поисковикам медицинский статус, но описание подчеркивает консультационный характер) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Physician',
                        name: 'Екатерина Шитова',
                        givenName: 'Екатерина',
                        familyName: 'Шитова',
                        jobTitle: 'Врач-терапевт, нутрициолог',
                        description:
                            'Официальный сайт врача-терапевта Екатерины Шитовой. Информационно-консультационные услуги по терапевтическим вопросам, изучение анализов, консультация по индивидуальному плану питания и принципах доказательной медицины.',
                        url: BASE_URL,
                        image: `${BASE_URL}/images/ekaterina-shitova.jpg`,
                        priceRange: '₽₽',
                        alumniOf: {
                            '@type': 'EducationalOrganization',
                            name: 'Приволжский исследовательский медицинский университет',
                        },
                        memberOf: {
                            '@type': 'Organization',
                            name: 'Российское Кардиологическое Общество',
                        },
                        knowsAbout: [
                            'Терапия',
                            'Клиническая нутрициология',
                            'Изучение анализов',
                            'Доказательная медицина',
                            'Врач общей практики',
                        ],
                    }),
                }}
            />

            {/* 2. Микроразметка Schema.org: WebSite */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'Doctor Shev — Врач-терапевт Екатерина Шитова',
                        url: BASE_URL,
                    }),
                }}
            />

            {/* 3. Микроразметка Schema.org: Хлебные крошки (Breadcrumbs) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: `Платные материалы`,
                                item: `${BASE_URL}/paid-content`,
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
                            <Paycards
                                isService
                                firstSegment={firstSegment}
                                content={[content]}
                                
                            />
                        </div>
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
