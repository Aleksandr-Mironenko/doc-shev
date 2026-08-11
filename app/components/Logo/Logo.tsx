import Image from 'next/image'
import styles from './Logo.module.scss'
// Adjust the logo import path if your asset is located elsewhere
import logo from '../../../public/logo.svg'

export default function Logo() {
    return (
        <div className={styles.logo__link}>
            <Image
                className={styles.logo__logo}
                src={logo}
                alt="Логотип компании"
                width={63}
                height={80}
                priority
                style={{ minWidth: '63px', minHeight: '80px' }}
            />
        </div>
    )
}
// .logo {
//     &__link {
//         width: 80px;
//         height: 80px;
//         display: inline-block;
//     }
//     &__logo {
//         margin: auto;
//     }
// }
