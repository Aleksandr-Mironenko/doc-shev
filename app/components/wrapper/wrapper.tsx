// import Appointment from '../appointment/appointment'

import ButtonsHero from '../buttonsHero/buttonsHero'
import CatchUp from '../catchUp/catchUp'
import Footer from '../footer/Footer'
import HeroSection from '../HeroSection/HeroSection'
import Info from '../Info/Info'
import PublicsSection from '../publicsSection/publicsSection'
import Reviews from '../reviews/reviews'
import styles from './wrapper.module.scss'
import Header from '@/app/components/header/header'
import IHelp from '@/app/components/iHelp/iHelp'
import { AddTimeForm } from '@/app/components/createDataTime/createDataTime'
import {
    dbGetAllSiteContent,
    getAllArticles,
    getAllReviews,
} from '@/app/services/adminServices'

export default async function Wrapper() {
    const articles = await getAllArticles() // получу все посты и передам на отображение
    const reviews = await getAllReviews() //все публичные поля которые потом можно легко поменять
    const siteContent = await dbGetAllSiteContent() //все значения с сайта
    const content = siteContent.data
    const reviewsData = reviews.data.map((el) => ({
        active: el.active,
        created_at: el.created_at,
        external_link: el.external_link,
        id: el.id,
        text: el.text,
    }))
 

    const articlesData = articles.data.map((el) => ({
        id: el.id,
        title: el.title,
        description: el.description,
        full_description: el.full_description,
        preview_image_url: el.preview_image_url,
        external_link: el.external_link,
        active: el.active,
        created_at: el.created_at,
    }))

    // const services = await dbGetAllServices()

    return (
        <div className={styles.wrapper}>
            <Header />
            <HeroSection content={content} />
            <ButtonsHero content={content} />
            <Info content={content} />
            {/* <Down /> */}
            <IHelp content={content} />
            <PublicsSection articlesData={articlesData} />
            {/* <ServicesSection /> */}
            <Reviews reviewsData={reviewsData} />
            <CatchUp />
            {/* <AddTimeForm /> */}
            <Footer />
            {/* <Appointment /> */}
        </div>
    )
}
