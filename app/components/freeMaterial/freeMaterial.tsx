import styles from './freeMaterial.module.scss'

import Link from 'next/link'
export default function FreeMaterial() {
    return (
        <Link href="/" className={styles.freeMaterial__link}>
            <div className={styles.freeMaterial__text_wrapper}>
                <div className={styles.freeMaterial__text}>
                    Бесплатные материалы
                </div>
            </div>
        </Link>
    )
}
// .freeMaterial {
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
