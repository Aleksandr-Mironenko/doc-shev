import Image from 'next/image'
import styles from './buttonsHero.module.scss'
// Adjust the logo import path if your asset is located elsewhere
import logo from '../../../public/close.svg'

export default function ButtonsHero() {
    return (
        <div className={styles.buttonsHero__wrapper}>
            <div className={`${styles.buttonsHero} ${styles.first} `}>
                <button
                    className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.blue}`}
                    // onClick={() => {}}
                >
                    <span>Записаться на консультацияю</span>
                    <Image
                        className={styles.buttonsHero__calendarLogo}
                        src={logo}
                        alt="закрыть"
                        width={30}
                        height={30}
                        priority
                        style={{ minWidth: '30px', minHeight: '30px' }}
                    />
                </button>
                <button
                    className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.buttonsHero__info_second}`} // onClick={() => {}}
                >
                    <p>Подробнее обо мне</p>
                </button>
            </div>

            <div className={`${styles.buttonsHero} ${styles.second} `}>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        <Image
                            className={styles.burgerMenu__logo}
                            src={logo}
                            alt="закрыть"
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        />
                        <span className={styles.buttonsHero__text}>
                            Надпись
                        </span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>описание </p>
                    </div>
                </div>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        <Image
                            className={styles.burgerMenu__logo}
                            src={logo}
                            alt="закрыть"
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        />
                        <span className={styles.buttonsHero__text}>
                            Надпись
                        </span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>описание </p>
                    </div>
                </div>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        <Image
                            className={styles.burgerMenu__logo}
                            src={logo}
                            alt="закрыть"
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        />
                        <span className={styles.buttonsHero__text}>
                            Надпись
                        </span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>описание </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
