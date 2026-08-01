import styles from './publics.module.scss'

import Link from 'next/link'
export default function Publics() {
    return (
        <Link href="/" className={styles.publics__link}>
            <div className={styles.publics__text_wrapper}>
                <div className={styles.publics__text}>Публикации</div>
            </div>
        </Link>
    )
}
