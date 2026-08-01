import PublicsSection from '../publicsSection/publicsSection'
import ServicesSection from '../servicesSection/servicesSection'
import styles from './down.module.scss'
export default function Down() {
    return (
        <div className={styles.down}>
            <PublicsSection />
            <ServicesSection />
        </div>
    )
}
