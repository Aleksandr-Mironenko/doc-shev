'use client'
// import Image from 'next/image'
// import pagefood from '../../../public/food-dish-svgrepo-com.svg'
// import Link from 'next/link'

// import { useRouter } from 'next/navigation'

// import { useState, useEffect } from 'react'
import styles from './page.module.scss'
import {
    // useEffect,
    useState,
} from 'react'
import OrdersTable from '@/app/components/OrdersTable/OrdersTable'
import LogoutButton from '../LogoutButton/LogoutButton'
import ClientsTable from '../ClientsTable/ClientsTable'
import TimeSlotsTable from '../TimeSlotsTable/TimeSlotsTable'
import ArticlesTable from '../ArticlesTable/ArticlesTable'
import ReviewsTable from '../ReviewsTable/ReviewsTable'
import AdminPlanner from '@/app/components/AdminPlanner/AdminPlanner'
import SiteContent from '../SiteContent/SiteContent'
import ServicesTable from '../ServicesTable/ServicesTable'

export interface Article {
    id: number
    title: string
    description: string
    full_description: string | null
    preview_image_url: string | null
    external_link: string
    comment: string | null
    active: boolean
    created_at: Date | string
}

export interface Review {
    id: number
    external_link: string
    text: string
    active: boolean
    created_at: Date | string
    comment: string | null
}

export interface TimeSlot {
    id: number
    data: string | null
    time: string | null
    datatime_reserved: Date | string
    comment: string | null
}

export interface Client {
    id: number
    fio: string
    phone: string
    email: string
    comment: string | null
}

export interface Order {
    id: number
    fio: string
    phone: string
    email: string
    date: string
    time: string
    create_data_time: Date | string
    consent_pd: boolean
    consent_promo: boolean
    verification_code: string
    approve: boolean
    approve_pr: boolean
    payment: boolean | null
    link: string | null
    price: number
    room_id: string | null
    date_payment: Date | string | null
    comment: string | null
}
// Тип данных для одной услуги (основан на структуре таблицы БД)
export interface SiteContentItem {
    id: number
    entity_name: string
    title: string | null
    description_1: string | null
    description_2: string | null
    description_3: string | null
    price: number | null
    link: string | null
    image: string | null
    is_active: boolean
    created_at?: Date | string
}
export interface Services {
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
    link:
        | 'consult-video-follow-up'
        | 'consult-video'
        | 'consult-doctor'
        | 'сonsult-audio-follow-up'
        | 'consult-audio'
    is_check: boolean
    is_active?: boolean | null
    price: number
    image?: string | null
    created_at: Date | string
}
// Тип для пропсов компонента ServicesTable

const AdminPage = ({
    orders,
    clients,
    timeSlots,
    articles,
    reviews,
    siteContent,
    services,
}: {
    orders: Order[]
    clients: Client[]
    timeSlots: TimeSlot[]
    articles: Article[]
    reviews: Review[]
    siteContent: SiteContentItem[]
    services: Services[]
}) => {
    const [open, setOpen] = useState<
        | 'orders'
        | 'clients'
        | 'timeSlots'
        | 'articles'
        | 'reviews'
        | 'planner'
        | 'siteContent'
        | 'services'
        | null
    >('planner')
    return (
        <>
            <div className={styles.wrapper}>
                <button
                    onClick={() => setOpen('planner')}
                    className={styles.createButton}
                >
                    План записей
                </button>

                <button
                    onClick={() => setOpen('orders')}
                    className={styles.createButton}
                >
                    Все записи
                </button>

                <button
                    onClick={() => setOpen('clients')}
                    className={styles.createButton}
                >
                    Все клиенты
                </button>

                <button
                    onClick={() => setOpen('timeSlots')}
                    className={styles.createButton}
                >
                    Все временные слоты
                </button>

                <button
                    onClick={() => setOpen('services')}
                    className={styles.createButton}
                >
                    Услуги
                </button>

                <button
                    onClick={() => setOpen('reviews')}
                    className={styles.createButton}
                >
                    Все отзывы
                </button>

                <button
                    onClick={() => setOpen('articles')}
                    className={styles.createButton}
                >
                    Все публикации
                </button>

                <button
                    onClick={() => setOpen('siteContent')}
                    className={styles.createButton}
                >
                    Текст сайта
                </button>

                <div className={styles.logout}>
                    <LogoutButton />
                </div>
            </div>
            {/* 'orders' | 'clients' | 'timeSlots' | 'articles' | 'reviews' |'planner' */}
            {open === 'planner' && <AdminPlanner orders={orders} />}
            {open === 'orders' && <OrdersTable orders={orders} />}
            {open === 'clients' && <ClientsTable clients={clients} />}
            {open === 'timeSlots' && <TimeSlotsTable timeSlots={timeSlots} />}
            {open === 'articles' && <ArticlesTable articles={articles} />}
            {open === 'reviews' && <ReviewsTable reviews={reviews} />}
            {open === 'services' && <ServicesTable services={services} />}
            {open === 'siteContent' && (
                <SiteContent siteContent={siteContent} />
            )}
        </>
    )
}

export default AdminPage
