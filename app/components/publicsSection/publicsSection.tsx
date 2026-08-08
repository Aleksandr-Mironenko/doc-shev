'use client'

import { useState, useEffect, useRef } from 'react'
import Image, { StaticImageData } from 'next/image'
import styles from './publicsSection.module.scss'

import chuma from '../../../public/ggg/chuma.jpg'
import energ from '../../../public/ggg/energ.jpg'
import kozha from '../../../public/ggg/kozha.jpg'
import migren from '../../../public/ggg/migren.jpg'
import prod from '../../../public/ggg/prod.jpg'
import kur from '../../../public/ggg/kur.jpg'

export interface Pub {
    id: number
    image: string | StaticImageData
    description: string
    tittlefullDescripton: string
    fullDescripton: string
    logo: string | StaticImageData
    data: string
}

export default function PublicsSection() {
    const [scrollState, setScrollState] = useState({
        left: false,
        right: false,
    })

    const scrollRef = useRef<HTMLUListElement | null>(null)

    const STEP = 222

    // const getCard = () => {
    //     const stored = localStorage.getItem("cart")
    //     const cart: CartItem[] = stored ? JSON.parse(stored) : []
    //     setLs(cart)
    // }

    // useEffect(() => {
    //     getCard()
    // }, [])

    // useEffect(() => {
    //     const sync = () => {
    //         const stored = localStorage.getItem("cart")
    //         setLs(stored ? JSON.parse(stored) : [])
    //     }

    //     // внутри вкладки
    //     window.addEventListener("cartUpdated", sync)

    //     // между вкладками
    //     const storageHandler = (e: StorageEvent) => {
    //         if (e.key === "cart") {
    //             sync()
    //         }
    //     }

    //     window.addEventListener("storage", storageHandler)

    //     return () => {
    //         window.removeEventListener("cartUpdated", sync)
    //         window.removeEventListener("storage", storageHandler)
    //     }
    // }, [])

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

    const pub: Pub[] = [
        {
            id: 0,
            image: chuma,
            description: 'Чума в России',
            tittlefullDescripton: 'Чума в России',
            fullDescripton: 'Чума в России',
            logo: chuma,
            data: '01.01.2020',
        },
        {
            id: 1,
            image: energ,
            description: 'Влияние энергетиков',
            tittlefullDescripton: 'Влияние энергетиков',
            fullDescripton: 'Влияние энергетиков',
            logo: energ,
            data: '02.01.2020',
        },
        {
            id: 2,
            image: kozha,
            description: 'Кожный барьер',
            tittlefullDescripton: 'Кожный барьер',
            fullDescripton: 'Кожный барьер',
            logo: kozha,
            data: '03.01.2020',
        },
        {
            id: 3,
            image: migren,
            description: 'Мигрень',
            tittlefullDescripton: 'Мигрень',
            fullDescripton: 'Мигрень',
            logo: migren,
            data: '03.01.2020',
        },
        {
            id: 4,
            image: prod,
            description: 'Опасность в огороде',
            tittlefullDescripton: 'Опасность в огороде',
            fullDescripton: 'Опасность в огороде',
            logo: prod,
            data: '03.01.2020',
        },
        {
            id: 5,
            image: kur,
            description: 'Отказ от курения',
            tittlefullDescripton: 'Отказ от курения',
            fullDescripton: 'Отказ от курения',
            logo: kur,
            data: '03.01.2020',
        },
    ]
    const containerRef = useRef(null)
    // Состояние, в котором будем хранить, сколько элементов показывать
    const [visibleCount, setVisibleCount] = useState(pub.length)

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const containerWidth = entry.contentRect.width

                const availableWidth = containerWidth * 0.8

                const maxItems = Math.floor(availableWidth / 150)

                setVisibleCount(Math.max(1, Math.min(maxItems, pub.length)))
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
    }, [pub.length])

    useEffect(() => {
        const el = scrollRef.current

        if (!el) return

        const observer = new ResizeObserver(() => {
            checkScroll()
        })

        observer.observe(el)

        return () => observer.disconnect()
    }, [])

    const publics = pub.map((el: Pub) => (
        <li
            key={el.id}
            style={{ width: `${95 / visibleCount}%`, minWidth: '150px' }}
            className={styles.public}
        >
            <div className={styles.image}>
                <Image
                    className={styles.image__logo}
                    src={el.logo}
                    alt="Логотип компании"
                    priority
                    fill
                    // width={50}
                    // height={50}
                    // style={{
                    //     objectFit: 'cover',
                    //     minWidth: '40px',
                    //     minHeight: '40x',
                    // }}
                />
            </div>

            <div className={styles.image__description}>
                <p>{el.description}</p>
            </div>

            <div className={styles.image__data}>
                <p>{el.data}</p>
            </div>
        </li>
    ))

    useEffect(() => {
        const timeout = setTimeout(() => {
            initScroll()
        }, 50)

        return () => clearTimeout(timeout)
    }, [])

    // const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault()

    //     const el = document.querySelector('#send')

    //     if (el) {
    //         el.scrollIntoView({
    //             behavior: 'smooth',
    //         })
    //     }
    // }

    return (
        <div className={styles.publics}>
            <div className={styles.publics__head}>
                <h2 className={styles.publics__h2}>Публикации в СМИ</h2>

                <p className={styles.publics__button}>Подробнее</p>
            </div>

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
                        className={`${styles.publics__list} ${styles.noscrollbar} ${styles.list}`}
                    >
                        {publics}
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

// <Image
//     className={styles.logo__str}
//     src={logo}
//     alt="Логотип компании"
//     width={40}
//     height={40}
//     priority
//     style={{ minWidth: '40px', minHeight: '40x' }}
// />
// Ведущий врач терапевт в крупнейшей цифровой клинике
