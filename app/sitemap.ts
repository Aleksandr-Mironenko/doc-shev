import type { MetadataRoute } from 'next'
import {
    dbGetFreeContentLinks,
    dbGetPaidContentLinks,
    dbGetServicesLinks,
} from './serv/adminServices'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://doctor-shev.ru'

    // 1. Получаем динамические slugs услуг
    const { data: serviceSlugs } = await dbGetServicesLinks()
    const { data: paidContentSlugs } = await dbGetPaidContentLinks()
    const { data: freeContentSlugs } = await dbGetFreeContentLinks()

    const serviceEntries: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
        url: `${baseUrl}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily', // Для услуг обычно хватает weekly
        priority: 0.9,
    }))
    const paidEntries: MetadataRoute.Sitemap = paidContentSlugs.map((slug) => ({
        url: `${baseUrl}/paid-content/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily', // Для услуг обычно хватает weekly
        priority: 0.9,
    }))
    const freeEntries: MetadataRoute.Sitemap = freeContentSlugs.map((slug) => ({
        url: `${baseUrl}/free-content/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily', // Для услуг обычно хватает weekly
        priority: 0.9,
    }))

    const timetableServices: MetadataRoute.Sitemap = serviceSlugs.map(
        (slug) => ({
            url: `${baseUrl}/timetable/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily', // Для услуг обычно хватает weekly
            priority: 0.9,
        }),
    )
    const staticEntries: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about-me`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/advertising-consent`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/timetable`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.96,
        },
        {
            url: `${baseUrl}/confirmation-of-consent`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/contacts`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/documents`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/free-content`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/paid-content`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/policy`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/public-offer`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },

        {
            url: `${baseUrl}/refund`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/review-consent`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/reviews`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
    ]
    return [
        ...staticEntries,
        ...serviceEntries,
        ...paidEntries,
        ...freeEntries,
        ...timetableServices,
    ]
}
