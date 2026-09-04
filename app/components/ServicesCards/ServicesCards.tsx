'use client'

import { useState, useEffect, useRef } from 'react'
// import Image, { StaticImageData } from 'next/image'
import styles from './ServicesCards.module.scss'

// import chuma from '../../../public/ggg/chuma.jpg'
// import energ from '../../../public/ggg/energ.jpg'
// import kozha from '../../../public/ggg/kozha.jpg'
// import migren from '../../../public/ggg/migren.jpg'
// import prod from '../../../public/ggg/prod.jpg'
// import kur from '../../../public/ggg/kur.jpg'
import ServiceCard from '../ServiceCard/ServiceCard'

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
export type ServicesCardsProps = {
    services: Services[]
    setIsSelectProduct: React.Dispatch<React.SetStateAction<boolean>>
    setProduct: React.Dispatch<React.SetStateAction<Services>>
}

export default function ServicesCards({
    services,
    setIsSelectProduct,
    setProduct,
}: ServicesCardsProps) {
    const [scrollState, setScrollState] = useState({
        left: false,
        right: false,
    })

    const scrollRef = useRef<HTMLUListElement | null>(null)

    const STEP = 260

    const checkScroll = () => {
        const el = scrollRef.current

        if (!el) return

        const left = el.scrollLeft > 0

        const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2

        setScrollState({
            left,
            right,
        })
    }

    const initScroll = () => {
        const el = scrollRef.current

        if (!el) return

        const right = el.scrollWidth > el.clientWidth

        setScrollState({
            left: false,
            right,
        })
    }

    const scrollLeft = () => {
        const el = scrollRef.current

        if (!el) return

        el.scrollBy({
            left: -STEP,
            behavior: 'smooth',
        })

        setTimeout(() => checkScroll(), 150)
    }

    const scrollRight = () => {
        const el = scrollRef.current

        if (!el) return

        el.scrollBy({
            left: STEP,
            behavior: 'smooth',
        })

        setTimeout(() => checkScroll(), 150)
    }

    // const correctText = (el: string, len: number) => {
    //     return el.slice(0, len - 3) + '...'
    // }

    const containerRef = useRef(null)
    // Состояние, в котором будем хранить, сколько элементов показывать
    const [visibleCount, setVisibleCount] = useState(services.length)

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const containerWidth = entry.contentRect.width

                const availableWidth = containerWidth * 0.8

                const maxItems = Math.floor(availableWidth / 150)

                setVisibleCount(
                    Math.max(1, Math.min(maxItems, services.length)),
                )
            }

            // После изменения размеров пересчитываем стрелки
            checkScroll()
        })

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        if (scrollRef.current) {
            observer.observe(scrollRef.current)
        }

        return () => observer.disconnect()
    }, [services.length])

    useEffect(() => {
        const el = scrollRef.current

        if (!el) return

        const observer = new ResizeObserver(() => {
            checkScroll()
        })

        observer.observe(el)

        return () => observer.disconnect()
    }, [])

    const sservices = services.map((el: Services) => (
        <li key={el.id}>
            <ServiceCard
                setProduct={setProduct}
                setIsSelectProduct={setIsSelectProduct}
                service={el}
            />
        </li>
    ))

    useEffect(() => {
        const timeout = setTimeout(() => {
            initScroll()
        }, 50)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className={styles.services}>
            <div className={styles.carousel}>
                {/* LEFT */}
                {scrollState.left && (
                    <div
                        onClick={scrollLeft}
                        className={`${styles.arrow} ${styles['arrow--left']}`}
                    >
                        {'<'}
                    </div>
                )}

                <div ref={containerRef} className={styles.viewport}>
                    <ul
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className={`${styles.services__list} ${styles.noscrollbar} ${styles.list}`}
                    >
                        {sservices}
                    </ul>
                </div>

                {/* RIGHT */}
                {scrollState.right && (
                    <div
                        onClick={scrollRight}
                        className={`${styles.arrow} ${styles['arrow--right']}`}
                    >
                        {'>'}
                    </div>
                )}
            </div>
        </div>
    )
}
