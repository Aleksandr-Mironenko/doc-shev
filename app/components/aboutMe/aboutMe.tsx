import styles from './aboutMe.module.scss'

import Link from 'next/link'
export default function AboutMe() {
    return (
        <Link href="/" className={styles.aboutMe__link}>
            <div className={styles.aboutMe__text_wrapper}>
                <div className={styles.aboutMe__text}>Обо мне</div>
            </div>
        </Link>
    )
}
// .aboutMe {
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
