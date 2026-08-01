import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://doc-shev.ru'),

    title: {
        default: 'Советник по терапии и нутрициологии',
        template:
            '%s | Советник по терапии и нутрициологии Шитова Екатерина Вадимовна',
    },

    description:
        'Советник по терапии и нутрициологии Шитова Екатерина Вадимовна. Расшифровка анализов, рекомендации по выбору направления обследований, дам второе мнение по поставленному диагнозу. Оценка поставленного диагноза согласно доказательности медицины.',

    alternates: {
        canonical: 'https://doc-shev.ru',
    },

    robots: {
        index: false, //true
        follow: false, //true
    },

    openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url: 'https://doc-shev.ru',
        siteName: 'Doc SHEV',
        title: 'Советник по терапии и нутрициологии Шитова Екатерина Вадимовна',
        description:
            'Советник по терапии и нутрициологии Шитова Екатерина Вадимовна. Расшифровка анализов, рекомендации по выбору направления обследований, дам второе мнение по поставленному диагнозу. Оценка поставленного диагноза согласно доказательности медицины.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Doc SHEV',
        description:
            'Советник по терапии и нутрициологии Шитова Екатерина Вадимовна. Расшифровка анализов, рекомендации по выбору направления обследований, дам второе мнение по поставленному диагнозу. Оценка поставленного диагноза согласно доказательности медицины.',
        images: ['/og-image.jpg'],
    },

    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="ru"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <body
                className={inter.className}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Cafe Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'MedicalCOnsult',
                            name: 'DocShev',
                            description:
                                'Консультации по медицинским вопросам. Помощь в понимании анализов, совет в выборе направления обследований',
                            url: 'https://doc-shev.ru',
                            // address: {
                            //     '@type': 'PostalAddress',
                            //     streetAddress: 'ул. Неклюдово, 1',
                            //     addressLocality: 'Бор',
                            //     addressRegion: 'Нижегородская область',
                            //     addressCountry: 'RU',
                            // },
                            // geo: {
                            //     '@type': 'GeoCoordinates',
                            //     latitude: 56.404115,
                            //     longitude: 44.006722,
                            // },
                            category: 'Medical consult',
                            servesCuisine: 'Терапия и нутрициология',
                            openingHours: ['Mo-Su 09:00-20:00'],
                            priceRange: '₽',
                            telephone: '+7-999-121-81-12',
                            email: 'doc.shev@mail.ru',
                            // sameAs: [
                            //   "https://t.me/ТВОЙ_ТГ",
                            //   "https://vk.com/ТВОЙ_ВК",
                            //   "https://max.ru/ТВОЙ_MAX"
                            // ],
                        }),
                    }}
                />

                {/* Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'Нутрициолог Шитова Екатрина Вадимовна',
                            url: 'https://doc-shev.ru',
                            logo: 'https://doc-shev.ru/logo.png',
                            telephone: '+7-999-121-81-12',
                            contactPoint: {
                                '@type': 'ContactPoint',
                                telephone: '+7-999-121-81-12',
                                contactType: 'customer service',
                            },
                            // sameAs: [
                            //   "https://t.me/ТВОЙ_ТГ",
                            //   "https://vk.com/ТВОЙ_ВК",
                            //   "https://max.ru/ТВОЙ_MAX"
                            // ],
                        }),
                    }}
                />

                {children}
            </body>
        </html>
    )
}
