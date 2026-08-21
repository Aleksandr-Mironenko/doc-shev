// 'use client'
import Image from 'next/image'
import styles from './catchUp.module.scss'
// Adjust the logo import path if your asset is located elsewhere
import logo from '../../../public/close.svg'
import image from '../../../public/nout_stol.png'
import calend from '../../../public/ggg/cal.png'
import OrderButton from '../orderButton/orderButton'
// import { useState } from 'react'

export default function CatchUp() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.catchUp}>
                <div className={styles.catchUp__description}>
                    <p className={styles.catchUp__text}>
                        Готовы начать заботиться о своем здоровье?
                    </p>
                    <p className={styles.catchUp__text}>
                        Запишитесь на онлайн-консультацию или задайте вопрос
                    </p>
                </div>

                {/* <div className={styles.catchUp__box}> */}
                <div className={styles.catchUp__orderButton}>
                    <OrderButton text="Написать сообщение" />
                </div>

                {/* </div> */}
            </div>

            <div className={styles.imagebox}>
                <Image
                    className={styles.imagebox__image}
                    src={image}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </div>
        </div>
    )
}
