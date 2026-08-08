'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './NotFoundClient.module.scss'

export default function NotFound() {
    const router = useRouter()
    const [sec, setSec] = useState(3)

    useEffect(() => {
        const interval = setInterval(() => {
            setSec((prev) => prev - 1)
        }, 1000)

        const timer = setTimeout(() => {
            router.replace('/')
        }, 2000)

        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [router])

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>404</h1>

                <p className={styles.text}>Страница не найдена</p>

                <p className={styles.timer}>
                    Перенаправление через <span>{sec}</span> сек
                </p>

                <div className={styles.actions}>
                    <Link href="/" className={styles.link}>
                        Перейти на главную
                    </Link>
                </div>
            </div>
        </div>
    )
}
