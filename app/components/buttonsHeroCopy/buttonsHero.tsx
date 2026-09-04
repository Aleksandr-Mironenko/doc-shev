'use client'
import React, { useState } from 'react'
import styles from './buttonsHeroCopy.module.scss'
// Adjust the logo import path if your asset is located elsewhere
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
import Appointment from '../appointment/appointment'
import ServicesCards from '../ServicesCards/ServicesCards'
import HeroCalend from '../HeroCalend/HeroCalend'
export default function ButtonsHeroCopy({
    services,
    dates,
}: {
    services: Services[]
    dates: string[]
}) {
    const [isMountedCalendar, setIsMountedCalendar] = useState<boolean>(false)
    const [isSelectProduct, setIsSelectProduct] = useState<boolean>(false)
    const [product, setProduct] = useState<Services>({
        id: 0,
        title: '',
        description_1: null,
        description_1_name: null,
        description_2: null,
        description_2_name: null,
        description_3: null,
        description_3_name: null,
        description_4: null,
        description_4_name: null,
        description_5: null,
        description_5_name: null,
        link: 'consult-video-follow-up',

        is_check: false,
        is_active: null,
        price: 2500,
        image: null,
        created_at: '',
    })

    return (
        <>
            <HeroCalend isSelectProduct={isSelectProduct}/>
            <div className={styles.buttonsHero__wrapper}>
                <div className={`${styles.buttonsHero} ${styles.second} `}>
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            // maxWidth: '700px',
                            // height: 380,
                        }}
                    >
                        {!isMountedCalendar && (
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    padding: 10,
                                    backgroundColor: '#fff6',
                                    borderRadius: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box',
                                    zIndex: 2,
                                    opacity: isMountedCalendar ? 0 : 1,
                                    transform: isMountedCalendar
                                        ? 'scale(0.96)'
                                        : 'scale(1)',

                                    transition:
                                        'opacity 0.4s ease, transform 0.4s ease',

                                    pointerEvents: isMountedCalendar
                                        ? 'none'
                                        : 'auto',
                                    maxHeight: '436.67px',
                                }}
                            >
                                <p style={{ margin: 0, color: '#8c8c8c' }}>
                                    загружаю данные
                                </p>
                            </div>
                        )}
                        <div
                            style={{
                                margin: 0,
                                color: '#8c8c8c',
                                width: '100%',
                                height: '100%',
                                opacity: isMountedCalendar ? 1 : 0,
                                transform: isMountedCalendar
                                    ? 'scale(1)'
                                    : 'scale(0.96)',

                                transition:
                                    'opacity 0.4s ease, transform 0.4s ease',
                            }}
                        >
                            <div
                                className={
                                    !isSelectProduct ? styles.none : undefined
                                }
                            >
                                <Appointment
                                    dates={dates}
                                    setIsMountedCalendar={setIsMountedCalendar}
                                    product={product}
                                    setIsSelectProduct={setIsSelectProduct}
                                />
                            </div>

                            {!isSelectProduct && (
                                <ServicesCards
                                    setIsSelectProduct={setIsSelectProduct}
                                    setProduct={setProduct}
                                    services={services}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
