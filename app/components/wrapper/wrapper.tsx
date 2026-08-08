import Appointment from '../appointment/appointment'
import ButtonsHero from '../buttonsHero/buttonsHero'
import CatchUp from '../catchUp/catchUp'
import HeroSection from '../HeroSection/HeroSection'
import Info from '../Info/Info'
import PublicsSection from '../publicsSection/publicsSection'
import Reviews from '../reviews/reviews'
import styles from './wrapper.module.scss'
import Header from '@/app/components/header/header'
import IHelp from '@/app/components/iHelp/iHelp'
export default function Wrapper() {
    return (
        <div className={styles.wrapper}>
            <Header />
            <HeroSection />
            <ButtonsHero />
            <Info />
            {/* <Down /> */}
            <IHelp />
            <PublicsSection />
            {/* <ServicesSection /> */}
            <Reviews />
            <CatchUp />
            <Appointment />
        </div>
    )
}
