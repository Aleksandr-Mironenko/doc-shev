import styles from './ComponentDocuments.module.scss'

import Link from 'next/link'

export default function ComponentDocuments() {
    return (
        <div className={styles.rewiewsW}>
            <h2 className={styles.rewiews__h2}>Документы</h2>

            <Link
                href="/policy"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                Политика конфиденциальности
            </Link>

            <Link
                href="/confirmation-of-consent"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                <p>Согласие на обработку</p>
                <p>персональных данных</p>
            </Link>

            <Link
                href="/public-offer"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                Публичная оферта
            </Link>

            <Link
                href="/advertising-consent"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                Согласие на получение рассылки
            </Link>

            <Link
                href="/review-consent"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                Согласие на использование отзыва
            </Link>

            <Link
                href="/refund"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                Правила возврата
            </Link>

            <Link
                href="/disclaimer"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                Отказ от ответственности
            </Link>
            {/* <Link
                href="/documents"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                какой то компонент или текст
            </Link>
            <Link
                href="/documents"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                какой то компонент или текст
            </Link>
            <Link
                href="/documents"
                className={`{styles.header__nav_link} ${styles.documents}`}
            >
                какой то компонент или текст
            </Link> */}
        </div>
    )
}
