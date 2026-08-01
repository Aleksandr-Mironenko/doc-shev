import styles from './services.module.scss'

import Link from 'next/link'
export default function Services() {
    return (
        <Link href="/" className={styles.services__link}>
            <div className={styles.services__text_wrapper}>
                <div className={styles.services__text}>Услуги</div>
            </div>
        </Link>
    )
}
