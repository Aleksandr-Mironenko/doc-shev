import Image from 'next/image'
import styles from './burgerMenu.module.scss'
// Adjust the logo import path if your asset is located elsewhere
import logo from '../../../public/close.svg'
import FreeMaterial from '../freeMaterial/freeMaterial'
import InfoProducts from '../infoProducts/infoProducts'
import Review from '../review/review'
import Contacts from '../contacts/contacts'
import Documents from '../documents/documents'
import { useWindowWidth } from '@/app/hucks/useWindowWidth'
import Publics from '../publics/publics'
import Link from 'next/link'

export default function BurgerMenu({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean
    setIsOpen: (e: boolean) => void
}) {
    const width = useWindowWidth()
    const adaptiveFontSize = width < 430
    const adaptiveFontSizeContacts = width < 740
    const adaptiveFontSizeReviews = width < 900

    const adaptiveFontSizeInfoDocuments = width < 1100

    return (
        <div className={styles.burgerMenu}>
            <button
                className={styles.burgerMenu__link}
                onClick={() => {
                    if (isOpen) {
                        setIsOpen(!isOpen)
                    }
                }}
            >
                <Image
                    className={styles.burgerMenu__logo}
                    src={logo}
                    alt="закрыть"
                    width={30}
                    height={30}
                    priority
                />
            </button>
            <div className={styles.burgerMenu__menu}>
                {/* {adaptiveFontSize && ( */}
                <Link
                    href="/publics"
                    className={`{styles.burgerMenu__nav_link} ${styles.publics}`}
                >
                    <Publics />
                </Link>
                {/* )} */}
                {/* {adaptiveFontSizeContacts && ( */}
                <Link
                    href="/publics"
                    className={`{styles.burgerMenu__nav_link} ${styles.contacts}`}
                >
                    <Contacts />
                </Link>
                {/* )} */}

                <Link
                    href="/publics"
                    className={`{styles.burgerMenu__nav_link} ${styles.freeMaterial}`}
                >
                    <FreeMaterial />
                </Link>

                <Link
                    href="/publics"
                    className={`{styles.burgerMenu__nav_link} ${styles.infoProducts}`}
                >
                    <InfoProducts />
                </Link>

                {/* {adaptiveFontSizeReviews && ( */}
                <Link
                    href="/publics"
                    className={`{styles.burgerMenu__nav_link} ${styles.review}`}
                >
                    <Review />
                </Link>
                {/* )} */}
                {/* {adaptiveFontSizeInfoDocuments && ( */}
                <Link
                    href="/publics"
                    className={`{styles.burgerMenu__nav_link} ${styles.documents}`}
                >
                    <Documents />
                </Link>
                {/* )} */}
            </div>

            {/* блок иконок с контакстами */}
        </div>
    )
}
