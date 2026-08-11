import styles from './orderButton.module.scss'
import Image from 'next/image'
import calend from '../../../public/ggg/cal.png'
import Link from 'next/link'

interface OrderButtonProps {
    linka?: string
    text?: string
}

export default function OrderButton({
    linka = '#',
    text = 'Подробнее обо мне',
}: OrderButtonProps) {
    return (
        <div className={`${styles.buttonsHero} ${styles.first} `}>
            <Link
                href="/timetable"
                className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.blue}`}
            >
                <span>Записаться на консультацияю</span>
                <Image
                    className={styles.buttonsHero__calendarLogo}
                    src={calend}
                    alt="календарь"
                    width={30}
                    height={30}
                    priority
                    style={{ minWidth: '40px', minHeight: '30px' }}
                />
            </Link>
            <button
                className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.buttonsHero__info_second}`} // onClick={() => {}}
            >
                <p>{text}</p>
            </button>
        </div>
    )
}
