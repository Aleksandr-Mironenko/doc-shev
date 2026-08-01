import styles from './review.module.scss'

import Link from 'next/link'
export default function Review() {
    return (
        <Link href="/" className={styles.review__link}>
            <div className={styles.review__text_wrapper}>
                <div className={styles.review__text}>Документы</div>
            </div>
        </Link>
    )
}
