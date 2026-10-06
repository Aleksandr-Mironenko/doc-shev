'use client'
import styles from './header.module.scss'

import Logo from '../Logo/Logo'
import AboutMe from '@/app/components/AboutMe/AboutMe'
import Publics from '../publics/publics'
import Services from '../services/services'
import FreeMaterial from '../freeMaterial/freeMaterial'
import InfoProducts from '../infoProducts/infoProducts'
// import Reviews from '../reviews/reviews'
import Review from '../review/review'
import Contacts from '../contacts/contacts'
import Documents from '../documents/documents'
import Burger from '../burger/burger'
import BurgerMenu from '../burgerMenu/burgerMenu'
import { useState } from 'react'
// import { useWindowWidth } from '@/app/hucks/useWindowWidth'
// const width = useWindowWidth()
//     const adaptiveFontSizePublics = width < 430
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleScroll = () => {
        const targetId = 'publics'

        if (window.location.pathname === '/') {
            document.getElementById(targetId)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
            return
        }

        router.push(`/#${targetId}`)
    }

    return (
        <div className={styles.header}>
            <nav className={styles.header__nav}>
                <Link
                    href="/"
                    className={`{styles.header__nav_link} ${styles.logo}`}
                >
                    <Logo />
                </Link>

                <div className={styles.header__rigth}>
                    <Link
                        href="/about-me"
                        className={`{styles.header__nav_link} ${styles.aboutMe}`}
                    >
                        <AboutMe />
                    </Link>

                    {/* <Link
                        href="/publics"
                        className={`{styles.header__nav_link} ${styles.publics}`}
                    >
                        <Publics />
                    </Link> */}

                    <button
                        className={`{styles.header__nav_link} ${styles.publics}`}
                        onClick={handleScroll}
                    >
                        {' '}
                        <Publics />
                    </button>

                    <Link
                        href="/services"
                        className={`{styles.header__nav_link} ${styles.services}`}
                    >
                        <Services />
                    </Link>

                    <Link
                        href="/contacts"
                        className={`{styles.header__nav_link} ${styles.contacts}`}
                    >
                        <Contacts />
                    </Link>

                    <Link
                        href="/free-content"
                        className={`{styles.header__nav_link} ${styles.freeMaterial}`}
                    >
                        <FreeMaterial />
                    </Link>

                    <Link
                        href="/paid-content"
                        className={`{styles.header__nav_link} ${styles.infoProducts}`}
                    >
                        <InfoProducts />
                    </Link>

                    <Link
                        href="/reviews"
                        className={`{styles.header__nav_link} ${styles.reviews}`}
                    >
                        <Review />
                    </Link>

                    <Link
                        href="/documents"
                        className={`{styles.header__nav_link} ${styles.documents}`}
                    >
                        <Documents />
                    </Link>

                    <div className={styles.burger}>
                        <Burger isOpen={isOpen} setIsOpen={setIsOpen} />
                    </div>
                </div>

                {isOpen && <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />}
            </nav>
        </div>
    )
}
