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
} from '../serv/adminServices'
import { dbGetAvailableDates } from '../serv/servicesDB'
import AboutMeContent from '../components/AboutMeContent/AboutMeContent'
import PolicyiPolitic from '../components/PoliciPolitic/PolicyiPolitic'
import PublicPolicyAbvertising from '../components/PublicPolicyAbvertising/PublicPolicyAbvertising'
import PublicPolicyRewiew from '../components/PublicPolicyReview/PublicPolicyReview'
import Refund from '../components/Refund/Refund'

export const dynamic = 'force-dynamic'

export default async function MakeAnAppointment() {
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const services = await dbGetAllServices()
    const { dates } = await dbGetAvailableDates()
    const siteContent = await dbGetAllSiteContent() //все значения с сайта
    const content = siteContent.data
    const articles = await getAllArticles()

    const articlesData = articles.data.map((el) => ({
        id: el.id,
        title: el.title,
        description: el.description,
        full_description: el.full_description,
        preview_image_url: el.preview_image_url,
        external_link: el.external_link,
        active: el.active,
        created_at: el.created_at,
    }))
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
                                name: `Правила возврата денежных средств`,
                                item: `${BASE_URL}/refund`,
                            },
                        ],
                    }),
                }}
            />

            <main className={styles.main}>
                <div className={styles.wrapper}>
                    <section>
                        <h2 className={styles.visuallyHidden}>
                            Советы по вашему здоровью от врача нутрициолога
                        </h2>
                        <p className={styles.visuallyHidden}>
                            Шитова Екатерина Вадимовна оказание консультационных
                            о здоровье
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

                    <div className={styles.content}>
                        <Refund />
                    </div>

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
