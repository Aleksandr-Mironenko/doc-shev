'use client'
import styles from './reviews.module.scss'
import { useState } from 'react'
import Image from 'next/image'
import image from '@/public/kavv.png'
export interface Pub {
    id: number
    name: string
    age: number

    data: string
}
export default function Reviews() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const pub = [
        {
            id: 0,
            name: 'Первый отзыв',
            age: 25,
            rewiewtext: 'описание',
            data: '01.01.2020',
        },
        {
            id: 1,
            name: 'Второй отзыв',
            age: 30,
            rewiewtext: 'описание',

            data: '02.01.2020',
        },
        {
            id: 2,
            name: 'Третий отзыв',
            age: 35,
            rewiewtext: 'описание',

            data: '03.01.2020',
        },
    ]

    const rewiew = pub
        .filter((el) => el.id === currentIndex)
        .map((el) => (
            <li key={el.id} className={styles.rewiew}>
                {/* левая часть блока отзывов */}
                <div className={styles.rewiew__left}>
                    {/* ..картинка кавычек */}
                    <div className={styles.rewiew__deccorimage}>
                        <Image
                            className={styles.rewiew__deccorimage_image}
                            src={image}
                            alt=""
                            priority
                            width={30}
                            height={20}
                            style={{ width: '30px', height: '20px' }}
                        />
                    </div>

                    {/* блок текста */}
                    <div className={styles.rewiew__text}>
                        <p className={styles.rewiew__text_p}>{el.rewiewtext}</p>
                    </div>
                </div>

                {/* правая часть блока отзывов */}
                <div className={styles.rewiew__right}>
                    <div className={styles.rewiew__user}>
                        <p className={styles.rewiew__user_name}>{el.name}</p>
                        <p className={styles.rewiew__user_age}>{el.age} лет</p>
                    </div>
                    <div className={styles.rewiew__buttons}>
                        <button
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    prev > 0 ? prev - 1 : prev,
                                )
                            }
                            className={styles.rewiew__buttons_left}
                        >
                            ←
                        </button>
                        <button
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    prev < pub.length - 1 ? prev + 1 : prev,
                                )
                            }
                            className={styles.rewiew__buttons_right}
                        >
                            →
                        </button>
                    </div>
                </div>
            </li>
        ))

    return (
        <div className={styles.rewiews}>
            <h2 className={styles.rewiews__h2}>Отзывы пациентов</h2>

            <ul className={styles.rewiews__list}> {rewiew}</ul>
        </div>
    )
}
