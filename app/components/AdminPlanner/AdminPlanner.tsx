'use client'

import { useMemo } from 'react'
import styles from './AdminPlanner.module.scss'

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

interface AdminPlannerProps {
    orders: Order[]
}

interface PlannerDay {
    date: string
    orders: Order[]
}

/**
 * Форматирование даты
 */
const formatDate = (date: string): string => {
    const [year, month, day] = date.split('-').map(Number)
    const result = new Date(year, month - 1, day)

    return result.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    })
}

/**
 * Получение timestamp из строковых даты и времени
 * Безопасный парсинг для любых браузеров (включая Safari)
 */
const getOrderTimestamp = (date: string, time: string): number => {
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)
    return new Date(year, month - 1, day, hours, minutes).getTime()
}

/**
 * Формирование ссылки на комнату.
 */
const getMeetingLink = (roomId: string | null): string | null => {
    if (!roomId) {
        return null
    }

    return `https://doc-shev.relaxdev.ru/room/${roomId}`
}

export default function AdminPlanner({ orders }: AdminPlannerProps) {
    const plannerDays = useMemo((): PlannerDay[] => {
        const now = Date.now()
        // 3 часа в миллисекундах: 3 * 60 * 60 * 1000 = 10800000
        const threeHoursAgo = now - 10800000

        /**
         * Оставляем будущие встречи И те, что были не более 3 часов назад.
         */
        const upcomingOrders = orders.filter((order) => {
            const orderTime = getOrderTimestamp(order.date, order.time)
            return orderTime >= threeHoursAgo
        })

        /**
         * Сортировка:
         * 1. дата
         * 2. время
         */
        upcomingOrders.sort((a, b) => {
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date)
            }
            return a.time.localeCompare(b.time)
        })

        /**
         * Группируем записи по датам.
         */
        const grouped = new Map<string, Order[]>()

        upcomingOrders.forEach((order) => {
            const current = grouped.get(order.date)
            if (current) {
                current.push(order)
            } else {
                grouped.set(order.date, [order])
            }
        })

        /**
         * Преобразуем Map в массив дней.
         */
        return Array.from(grouped.entries()).map(([date, dayOrders]) => ({
            date,
            orders: dayOrders,
        }))
    }, [orders])

    // Фиксируем текущее время для определения просроченных карточек во время рендера
    const currentTime = Date.now() 

    return (
        <section className={styles.wrapper}>
            <h2 className={styles.title}>Предстоящие созвоны</h2>

            {plannerDays.length === 0 ? (
                <div className={styles.empty}>Созвонов нет</div>
            ) : (
                <div className={styles.days}>
                    {plannerDays.map((day) => (
                        <div key={day.date} className={styles.day}>
                            {/* Заголовок дня */}
                            <div className={styles.dayHeader}>
                                <h3 className={styles.dayTitle}>
                                    {formatDate(day.date)}
                                </h3>
                                <span className={styles.dayCount}>
                                    {day.orders.length}
                                </span>
                            </div>

                            {/* Записи */}
                            <div className={styles.orders}>
                                {day.orders.map((order) => {
                                    const meetingLink = getMeetingLink(order.room_id)
                                    const orderTimestamp = getOrderTimestamp(order.date, order.time)
                                    const isOverdue = orderTimestamp < currentTime

                                    return (
                                        <article
                                            key={order.id}
                                            // Добавляем класс overdue, если время уже прошло
                                            className={`${styles.order} ${isOverdue ? styles.overdue : ''}`}
                                        >
                                            {/* Время */}
                                            <div className={styles.time}>
                                                {order.time}
                                            </div>

                                            {/* Информация */}
                                            <div className={styles.info}>
                                                <div className={styles.fio}>
                                                    {order.fio}
                                                </div>

                                                <div className={styles.contacts}>
                                                    <span>{order.phone}</span>
                                                    <span>{order.email}</span>
                                                </div>

                                                {order.comment && (
                                                    <div className={styles.comment}>
                                                        {order.comment}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Правая часть */}
                                            <div className={styles.actions}>
                                                {/* Ссылка */}
                                                {meetingLink ? (
                                                    <a
                                                        href={meetingLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.meetingLink}
                                                    >
                                                        Перейти к созвону
                                                    </a>
                                                ) : (
                                                    <span className={styles.noLink}>
                                                        Ссылка не создана
                                                    </span>
                                                )}

                                                {/* Статусы */}
                                                <div className={styles.statuses}>
                                                    {order.approve && (
                                                        <span className={styles.status}>
                                                            Запись подтверждена
                                                        </span>
                                                    )}

                                                    {order.payment && (
                                                        <span className={styles.status}>
                                                            Оплачено
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}