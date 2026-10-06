'use client'
import styles from './ComponentServices.module.scss'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import image from '@/public/ggg/kavv2.png'
import { createPortal } from 'react-dom'

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
}

export default function ComponentServices({
    services,
}: {
    services: Services[]
}) {
    const [servicess, setServicess] = useState<Services[]>(
        [],
        //     {
        //     id: 0,
        //     title: '',
        //     description_1: null,
        //     description_1_name: null,
        //     description_2: null,
        //     description_2_name: null,
        //     description_3: null,
        //     description_3_name: null,
        //     description_4: null,
        //     description_4_name: null,
        //     description_5: null,
        //     description_5_name: null,
        //     link: 'consult-video-follow-up',

        //     is_check: false,
        //     is_active: null,
        //     price: 2500,
        //     image: null,
        //     created_at: '',
        // }
    )

    useEffect(() => {
        setServicess(services)
    }, [services])
    const content = servicess.map((el) => (
        <li key={el.id}>
            <p>{el.title}</p>
        </li>
    ))
    return (
        <div className={styles.rewiewsW}>
            <h2 className={styles.rewiews__h2}>Все услуги</h2>
            <ul>{content}</ul>
        </div>
    )
}
