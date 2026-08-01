import styles from './infoProducts.module.scss'

import Link from 'next/link'
export default function InfoProducts() {
    return (
        <Link href="/" className={styles.infoProducts__link}>
            <div className={styles.infoProducts__text_wrapper}>
                <div className={styles.infoProducts__text}>
                    Информационные продукты
                </div>
            </div>
        </Link>
    )
}
// .infoProducts {
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
