import styles from './contacts.module.scss'

import Link from 'next/link'
export default function Contacts() {
    return (
        <Link href="/" className={styles.contacts__link}>
            <div className={styles.contacts__text_wrapper}>
                <div className={styles.contacts__text}>
                    Контакты
                </div>
            </div>
        </Link>
    )
}
// .contacts {
//     &__link {
//         height: 100%;
//         display: block;
//     }
//     &__text {
//         color: black;

//         &_wrapper {
//             height: 100%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//         }
//     }
// }
