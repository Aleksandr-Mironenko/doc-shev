// import Image from 'next/image'
// import styles from './catchUp.module.scss'
// // Adjust the logo import path if your asset is located elsewhere
// import logo from '../../../public/close.svg'
// import image from '../../../public/q.png'

// export default function Footer() {
//     return (
//         <div className={styles.footer__wrapper}>
//             <p>© Екатерина Шитова. Все права защищены.</p>

//             <div>
//                 <p>Политика конфиденциальности</p>
//                 <p>Обработка персональных данных</p>
//             </div>
//         </div>
//     )
// }

'use client'
import styles from './Footer.module.scss'
// Adjust the logo import path if your asset is located elsewhere

import Logo from '../Logo/Logo'
import AboutMe from '../aboutMe/aboutMe'
import Publics from '../publics/publics'
import Services from '../services/services'
import FreeMaterial from '../freeMaterial/freeMaterial'
import InfoProducts from '../infoProducts/infoProducts'
import Review from '../review/review'
import Contacts from '../contacts/contacts'
import Documents from '../documents/documents'
import Burger from '../burger/burger'
import BurgerMenu from '../burgerMenu/burgerMenu'
import { useState } from 'react'
import { useWindowWidth } from '@/app/hucks/useWindowWidth'

export default function Footer() {
    return (
        <div className={styles.footer}>
            <nav className={styles.footer__nav}>
                <div className={styles.footer__wrapper}>
                    <p className={styles.footer__left}>
                        © Екатерина Шитова. Все права защищены.
                    </p>
                    <div className={styles.footer__rigth}>
                        <p>Политика конфиденциальности</p>
                        <p>Обработка персональных данных</p>
                    </div>
                </div>
            </nav>
        </div>
    )
}
