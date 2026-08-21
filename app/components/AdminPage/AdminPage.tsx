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

const AdminPage = ({
    orders,
    clients,
    timeSlots,
    articles,
    reviews,
}: {
    orders: Order[]
    clients: Client[]
    timeSlots: TimeSlot[]
    articles: Article[]
    reviews: Review[]
}) => {
    const [open, setOpen] = useState<
        | 'orders'
        | 'clients'
        | 'timeSlots'
        | 'articles'
        | 'reviews'
        | 'planner'
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
                    onClick={() => setOpen('reviews')}
                    className={styles.createButton}
                >
                    Все отзывы
                </button>

                <button
                    onClick={() => setOpen('timeSlots')}
                    className={styles.createButton}
                >
                    Все временные слоты
                </button>

                <button
                    onClick={() => setOpen('articles')}
                    className={styles.createButton}
                >
                    Все публикации
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
        </>
    )
}

export default AdminPage

// 'use client'
// import Image from 'next/image'
// import pagefood from '../../../public/food-dish-svgrepo-com.svg'
// import Link from 'next/link'

// import { useRouter } from 'next/navigation'
// import ReviewPage from '@/app/components/ReviewPage/ReviewPage'
// // import { useState, useEffect } from 'react'
// import styles from './page.module.scss'
// import { useEffect, useState } from 'react'
// import AdminEditMenu from '@/app/components/AdminEditMenu/AdminEditMenu'
// import AdminEditServices from '@/app/components/AdminEditServices/AdminEditServices'
// import AdminEditReviews from '@/app/components/AdminEditReviews/AdminEditReviews'
// import AdminEditPosts from '../AdminEditPosts/AdminEditPosts'
// import AdminEditPublicInfo from '../AdminEditPublicInfo/AdminEditPublicInfo'
// import LogoutButton from '../LogoutButton/LogoutButton'
// import { AddTimeForm } from '@/app/components/createDataTime/createDataTime'

// interface Menu {
//     url_name: string
//     id: string
//     name: string
//     description: string | null
//     image_url: string | null
//     created_at: string | null
//     is_available: boolean
// }

// interface Service {
//     id: number
//     name: string
//     description: string
//     full_description: string
//     is_available: boolean
//     created_at: string | null
//     url_name: string
//     images: string[]
// }
// interface Review {
//     id: string
//     image_url: string
//     created_at: string
// }
// export interface Post {
//     id: string
//     name: string
//     header: string
//     full_description: string
//     sort_order: number
//     is_available: boolean
//     created_at: string
//     url_name: string
// }
// interface PublicInfo {
//     id: string
//     city: string
//     address_url: string
//     phone: string
//     schedule: string
//     title: string
//     content: string
//     image_url: string
//     url_link: string
//     updated_at: string
//     delivery_payment_title: string
//     delivery_payment_content: string
// }

// const AdminPage = (
//     {
//     menu,
//     services,
//     reviews,
//     posts,
//     publicInfo,
// }: {
//     menu: Menu[]
//     services: Service[]
//     reviews: Review[]
//     posts: Post[]
//     publicInfo: PublicInfo
// }
// ) => {
//     const [open, setOpen] = useState<
//         'menu' | 'services' | 'reviews' | 'posts' | 'publicInfo' | null
//     >('publicInfo')
//     return (
//         <>
//             <div className={styles.wrapper}>
//                 <AddTimeForm />
//                 <button
//                     onClick={() => setOpen('menu')}
//                     className={styles.createButton}
//                 >
//                     Редактировать меню
//                 </button>
//                 <button
//                     onClick={() => setOpen('services')}
//                     className={styles.createButton}
//                 >
//                     Редактировать услуги
//                 </button>

//                 <button
//                     onClick={() => setOpen('reviews')}
//                     className={styles.createButton}
//                 >
//                     Редактировать отзывы
//                 </button>

//                 <button
//                     onClick={() => setOpen('posts')}
//                     className={styles.createButton}
//                 >
//                     Редактировать статьи
//                 </button>

//                 <button
//                     onClick={() => setOpen('publicInfo')}
//                     className={styles.createButton}
//                 >
//                     Редактировать публичную информацию
//                 </button>

//                 <div className={styles.logout}>
//                     <LogoutButton />
//                 </div>
//             </div>

//             {/* {open === 'menu' && <AdminEditMenu menu={menu} />}
//             {open === 'services' && <AdminEditServices services={services} />}
//             {open === 'reviews' && <AdminEditReviews reviews={reviews} />}
//             {open === 'posts' && <AdminEditPosts posts={posts} />}
//             {open === 'publicInfo' && (
//                 <AdminEditPublicInfo publicInfo={publicInfo} />
//             )} */}
//         </>
//     )
// }

// export default AdminPage
