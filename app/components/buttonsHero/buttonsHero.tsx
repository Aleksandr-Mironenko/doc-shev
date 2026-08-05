import Image from 'next/image'
import styles from './buttonsHero.module.scss'
// Adjust the logo import path if your asset is located elsewhere
import logo from '../../../public/close.svg'
import calend from '../../../public/ggg/cal.png'
import zvezda from '../../../public/ggg/zvezda.svg'
import cserd from '../../../public/ggg/kardioserd.svg'
import OrderButton from '../orderButton/orderButton'
export default function ButtonsHero() {
    return (
        <div className={styles.buttonsHero__wrapper}>
            <div className={styles.buttonsHero__orderButton}>
                <OrderButton />
            </div>
            <div className={`${styles.buttonsHero} ${styles.second} `}>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        {/* <Image
                            className={styles.burgerMenu__logo}
                            src={logo}
                            alt="закрыть"
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        /> */}
                        <span className={styles.buttonsHero__text}>2+</span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>года опыта </p>
                    </div>
                </div>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        <Image
                            className={styles.burgerMenu__logo}
                            src={zvezda}
                            alt=""
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        />
                        <span className={styles.buttonsHero__text}>500+</span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>довольных клиентов </p>
                    </div>
                </div>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        <Image
                            className={styles.burgerMenu__logo}
                            src={cserd}
                            alt=""
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        />
                        <span className={styles.buttonsHero__text}>98%</span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>положительных отзывов </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
