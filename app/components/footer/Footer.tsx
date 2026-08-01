import Image from 'next/image'
import styles from './catchUp.module.scss'
// Adjust the logo import path if your asset is located elsewhere
import logo from '../../../public/close.svg'
import image from '../../../public/q.png'

export default function Footer() {
    return (
        <div className={styles.footer__wrapper}>
            <p>© Екатерина Шитова. Все права защищены.</p>

            <div>
                <p>Политика конфиденциальности</p>
                <p>Обработка персональных данных</p>
            </div>
        </div>
    )
}
