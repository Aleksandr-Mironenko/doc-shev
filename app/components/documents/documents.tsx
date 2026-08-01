import styles from './documents.module.scss'

import Link from 'next/link'
export default function Documents() {
    return (
        <Link href="/" className={styles.documents__link}>
            <div className={styles.documents__text_wrapper}>
                <div className={styles.documents__text}>Документы</div>
            </div>
        </Link>
    )
}
// .documents {
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
