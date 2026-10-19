//занести фото в /images/ekaterina-shitova.jpg',

import './styles/Home.scss'
import Wrapper from '@/app/components/wrapper/wrapper'
import type { Metadata } from 'next'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://doctor-shev.ru'

// 1. Метатеги для Next.js App Router (показывают экспертность врача, но избегают запрещенных слов «лечение» и «диагностика»)
export const metadata: Metadata = {
    title: 'Екатерина Шитова — врач-терапевт | Онлайн-консультации',
    description:
        'Информационно-консультационные услуги Екатерины Шитовой, врача-терапевта. Консультации по вопросам питания, обсуждение лабораторных анализов и индивидуального плана питания.',
    keywords: [
        'Екатерина Шитова',
        'врач терапевт онлайн',
        'консультация терапевта',
        'разбор анализов онлайн',
        'второе мнение терапевта',
        'терапевт нутрициолог',
    ],
    metadataBase: new URL(BASE_URL),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Врач-терапевт Екатерина Шитова | Онлайн-консультации',
        description:
            'Информационные консультации по вопросам здоровья и разбор анализов от врача-терапевта Екатерины Шитовой.',
        url: BASE_URL,
        siteName: 'Doctor Shev — Екатерина Шитова',
        locale: 'ru_RU',
        type: 'website',
        images: [
            {
                url: '/images/ekaterina-shitova.jpg',
                width: 1200,
                height: 630,
                alt: 'Екатерина Шитова',
            },
        ],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
}

export default function Home() {
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
                                position: 1,
                                name: 'Главная',
                                item: `${BASE_URL}/`,
                            },
                        ],
                    }),
                }}
            />

            <div>
                <main className="main">
                    <Wrapper />
                </main>
            </div>
        </>
    )
}
