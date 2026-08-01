'use client'
import Image from 'next/image'
import styles from './burger.module.scss'
// Adjust the logo import path if your asset is located elsewhere
import logo from '../../../public/burger-icon.svg'

export default function Burger({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean
    setIsOpen: (e: boolean) => void
}) {
    return (
        <button
            onClick={() => {
                if (isOpen === false) {
                    setIsOpen(!isOpen)
                }
            }}
            className={styles.burger__link}
        >
            <Image
                className={styles.burger__logo}
                src={logo}
                alt="Логотип компании"
                width={30}
                height={30}
                priority
                style={{ minWidth: '30px', minHeight: '30px' }}
            />
        </button>
    )
}
