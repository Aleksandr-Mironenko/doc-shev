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
                    style={{ minWidth: '30px', minHeight: '30px' }}
                />
            </button>
            <div className={styles.burgerMenu__menu}>
                {adaptiveFontSize && <Publics />}
                {adaptiveFontSizeContacts && <Contacts />}
                <FreeMaterial />
                <InfoProducts />
                {adaptiveFontSizeReviews && <Review />}
                {adaptiveFontSizeInfoDocuments && <Documents />}
            </div>

            {/* блок иконок с контакстами */}
        </div>
    )
}
