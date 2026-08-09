import styles from './buttonsHeroCopy.module.scss'
// Adjust the logo import path if your asset is located elsewhere

import Appointment from '../appointment/appointment'
export default function ButtonsHeroCopy() {
    return (
        <div className={styles.buttonsHero__wrapper}>
            <div className={`${styles.buttonsHero} ${styles.second} `}>
                <Appointment />
            </div>
        </div>
    )
}
