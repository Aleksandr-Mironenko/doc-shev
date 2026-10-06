'use client'
import Image from 'next/image'
import styles from './MaterialCard.module.scss'
import { useState } from 'react'
import Link from 'next/link'

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
    link?: string | null
    is_check: boolean
    is_active?: boolean | null
    price: number
    image?: string | null
    created_at: Date | string
    entity: string
}
interface ServiceCardProps {
    product: Services
    clickChangeStep: (product: Services) => void
    productCard: Services | null
}

export default function MaterialCard({
    product,
    clickChangeStep,
    productCard,
}: ServiceCardProps) {
    // 1. Динамически собираем все непустые описания из БД
    const descriptions = [
        { name: product.description_1_name, text: product.description_1 },
        { name: product.description_2_name, text: product.description_2 },
        { name: product.description_3_name, text: product.description_3 },
        { name: product.description_4_name, text: product.description_4 },
        { name: product.description_5_name, text: product.description_5 },
    ].filter((item) => item.name || item.text) // Отсекаем все NULL и пустые строки

    // 2. Форматируем цену (numeric из БД может приходить как строка)
    const priceValue = Number(product.price)
    const isFree = priceValue === 0
    const formattedPrice =
        product.entity === 'service'
            ? ''
            : isFree
              ? 'Бесплатно'
              : new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    maximumFractionDigits: 0,
                }).format(priceValue)

    return (
        <div className={styles.card}>
            <div>
                {/* Обложка материала */}
                {product.image && (
                    <div className={styles.imageWrapper}>
                        <Image
                            src="https://cdn.relaxdev.ru/users/sanek.miron2@gmail.com/doc-shev/1788120497079-kozha.webp"
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                        />{' '}
                    </div>
                )}
                <div className={styles.footer}>
                    <div className={styles.price}>{formattedPrice}</div>
                    {product.entity === 'service' ? (
                        <>
                            {' '}
                            <Link
                                href={`/timetable/${product.link}`}
                                className={styles.actionButton}
                            >
                                <p>выбрать</p>
                            </Link>
                            <Link
                                href={`/service/${product.title}`}
                                className={styles.actionButton}
                            >
                                <p>Подробнее</p>
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                clickChangeStep(product)
                            }}
                            className={styles.actionButton}
                            // onClick={() => onOpenModal(product)}
                        >
                            {isFree ? 'Получить' : 'Купить'}
                        </button>
                    )}
                </div>{' '}
            </div>
            <div className={styles.content}>
                {/* Заголовок и бейдж типа продукта */}
                <div className={styles.header}>
                    <h3 className={styles.title}>{product.title}</h3>
                    <span className={styles.entityBadge}>
                        {product.entity === 'service' ? 'Услуга' : 'Материал'}
                    </span>
                </div>

                {/* Список характеристик/описаний */}
                {descriptions.length > 0 && (
                    <ul className={styles.descriptionList}>
                        {descriptions.map((desc, index) => (
                            <li key={index} className={styles.descriptionItem}>
                                {/* Рендерим галочку через SVG */}
                                <svg
                                    className={styles.checkIcon}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <polyline
                                        points="20 6 9 17 4 12"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>
                                    {desc.name && (
                                        <span className={styles.descName}>
                                            {desc.name}:{' '}
                                        </span>
                                    )}
                                    {desc.text && (
                                        <span className={styles.descText}>
                                            {desc.text}
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Подвал карточки с ценой и кнопкой */}
            </div>
        </div>
    )
}
