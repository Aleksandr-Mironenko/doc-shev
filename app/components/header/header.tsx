'use client'
import styles from './header.module.scss'
// Adjust the logo import path if your asset is located elsewhere

import Logo from '../Logo/Logo'
import AboutMe from '../aboutMe/aboutMe'
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
import { useWindowWidth } from '@/app/hucks/useWindowWidth'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const width = useWindowWidth()
    const adaptiveFontSizePublics = width < 430
    const adaptiveFontSizeContacts = width < 740
    const adaptiveFontSizeReviews = width < 900
    const adaptiveFontSizeFreeMaterial = width < 1500
    const adaptiveFontSizeInfoProducts = width < 1500
    const adaptiveFontSizeInfoDocuments = width < 1100
    const aadaptiveFontSizeBurger = width >= 1500

    return (
        <div className={styles.header}>
            <nav className={styles.header__nav}>
                <Logo />
                <div className={styles.header__rigth}>
                    <AboutMe />
                    {!adaptiveFontSizePublics && <Publics />}
                    <Services />
                    {!adaptiveFontSizeContacts && <Contacts />}

                    {!adaptiveFontSizeFreeMaterial && <FreeMaterial />}
                    {!adaptiveFontSizeInfoProducts && <InfoProducts />}
                    {!adaptiveFontSizeReviews && <Review />}
                    {!adaptiveFontSizeInfoDocuments && <Documents />}
                    {!aadaptiveFontSizeBurger && (
                        <Burger isOpen={isOpen} setIsOpen={setIsOpen} />
                    )}
                </div>

                {!aadaptiveFontSizeBurger && isOpen && (
                    <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
                )}
            </nav>
        </div>
    )
}
