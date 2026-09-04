import React from 'react'
import Image from 'next/image'
import styles from './ServiceCard.module.scss'
import i from '@/public/i.svg'
// Типизация, основанная на ваших данных

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
export type ServiceCardProps = {
    service: Services
    setIsSelectProduct: React.Dispatch<React.SetStateAction<boolean>>
    setProduct: React.Dispatch<React.SetStateAction<Services>>
}

export default function ServiceCard({
    service,
    setProduct,
    setIsSelectProduct,
}: ServiceCardProps) {
    const getFormatTag = (text: string): string => {
        const lowerText = text.toLowerCase()

        switch (true) {
            case lowerText.includes('видео'):
                return 'видео'
            case lowerText.includes('аудио'):
                return 'аудио'
            case lowerText.includes('врач'):
                return 'для врачей'
            default:
                return ' ' // Фолбэк, если ничего не найдено
        }
    }

    return (
        <div className={styles.card}>
            {/* Шапка: Иконка и Тег формата */}
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    {/* Иконка микрофона */}
                    {service.image ? (
                        <Image
                            src={service.image}
                            width={24}
                            height={24}
                            alt=""
                        />
                    ) : (
                        <span aria-hidden="true">🎙️</span>
                    )}
                </div>
                <span className={styles.badge}>
                    {getFormatTag(service.title)}
                </span>
            </div>

            {/* Основная информация */}
            <div className={styles.info}>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.duration}>{service.description_2}</p>
            </div>

            {/* Цена */}
            <div className={styles.price}>
                {service.price.toLocaleString('ru-RU')} ₽
            </div>

            {/* Кнопки действий */}
            <div className={styles.actions}>
                <button
                    className={styles.btnSelect}
                    onClick={() => {
                        setProduct(service)
                        setIsSelectProduct(true)
                    }}
                >
                    Выбрать
                </button>

                <button
                    className={styles.btnDetails}
                    onClick={() => console.log('Подробнее о:', service.id)}
                >
                    Подробнее
                    {/* Иконка Info (i) */}
                    <Image src={i} width={10} height={10} alt={service.title} />
                </button>
            </div>
        </div>
    )
}
