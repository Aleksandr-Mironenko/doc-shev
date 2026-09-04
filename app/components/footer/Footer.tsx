// // import Image from 'next/image'
// // import styles from './catchUp.module.scss'
// // // Adjust the logo import path if your asset is located elsewhere
// // import logo from '../../../public/close.svg'
// // import image from '../../../public/q.png'

// // export default function Footer() {
// //     return (
// //         <div className={styles.footer__wrapper}>
// //             <p>© Екатерина Шитова. Все права защищены.</p>

// //             <div>
// //                 <p>Политика конфиденциальности</p>
// //                 <p>Обработка персональных данных</p>
// //             </div>
// //         </div>
// //     )
// // }

// 'use client'
// import styles from './Footer.module.scss'
// // Adjust the logo import path if your asset is located elsewhere

// import Logo from '../Logo/Logo'
// import AboutMe from '../aboutMe/aboutMe'
// import Publics from '../publics/publics'
// import Services from '../services/services'
// import FreeMaterial from '../freeMaterial/freeMaterial'
// import InfoProducts from '../infoProducts/infoProducts'
// import Review from '../review/review'
// import Contacts from '../contacts/contacts'
// import Documents from '../documents/documents'
// import Burger from '../burger/burger'
// import BurgerMenu from '../burgerMenu/burgerMenu'
// import { useState } from 'react'
// import { useWindowWidth } from '@/app/hucks/useWindowWidth'

// export default function Footer() {
//     return (
//         <div className={styles.footer}>
//             <nav className={styles.footer__nav}>
//                 <div className={styles.footer__wrapper}>
//                     <p className={styles.footer__left}>
//                         © Екатерина Шитова. Все права защищены.
//                     </p>
//                     <div className={styles.footer__rigth}>
//                         <p>Политика конфиденциальности</p>
//                         <p>Обработка персональных данных</p>
//                         {/*  // 2. Микро-дисклеймер для подвала сайта (Footer) //
//                     Вместо того чтобы публиковать весь массив текста на
//                         каждой странице, разместите в футере всего одну мягкую
//                         строчку и ссылку: // «Услуги носят информационный
//                         характер и не являются медицинской деятельностью. [Отказ
//                         от ответственности]» */}
//                     </div>
//                 </div>
//             </nav>
//         </div>
//     )
// }
'use client'
import Link from 'next/link'
import styles from './Footer.module.scss'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.footer__wrapper}>
                {/* Верхняя часть: Реквизиты и Документы */}
                <div className={styles.footer__top}>
                    <div className={styles.footer__left}>
                        <p className={styles.footer__copyright}>
                            © {currentYear} Екатерина Шитова. Все права
                            защищены.
                        </p>
                    </div>

                    <nav className={styles.footer__right}>
                        <a target="_blank" href="/offer">
                            Публичная оферта
                        </a>
                        {/* Объединили два ваших пункта в один правильный: */}
                        <a target="_blank" href="/privacy">
                            Политика конфиденциальности
                        </a>
                        <a target="_blank" href="/refund">
                            Правила возврата
                        </a>
                    </nav>
                </div>

                {/* Нижняя часть: Дисклеймер */}
                <div className={styles.footer__bottom}>
                    <p>
                        {` Услуги носят информационный характер и не являются
                        медицинской деятельностью. `}
                        <a target="_blank" href="/disclaimer">
                            Подробнее
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
