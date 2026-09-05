import AdminPage from '@/app/components/AdminPage/AdminPage'
import {
    getAllOrders,
    getAllClients,
    getTimeSlots,
    getAllArticles,
    getAllReviews,
    dbGetAllSiteContent,
    dbGetAllServices,
} from '@/app/services/adminServices'
import styles from './styles.module.scss'
import Header from '@/app/components/header/header'
import Footer from '@/app/components/footer/Footer'
export const dynamic = 'force-dynamic'

export default async function Admin() {
    const orders = await getAllOrders() // получу все заказы и передам на отображение
    const clients = await getAllClients() // получу все СЕРВИСЫ и передам на отображение
    const timeSlots = await getTimeSlots() // получу все отзывы и передам на отображение
    const articles = await getAllArticles() // получу все посты и передам на отображение
    const reviews = await getAllReviews() //все публичные поля которые потом можно легко поменять
    const siteContent = await dbGetAllSiteContent() //все значения с сайта
    const services = await dbGetAllServices()
    // const services = siteContent.data.filter(
    //     (el) => el.entity_name === 'services',
    // )
    // console.log(services)
    return (
        <main className={styles.main}>
            <div className={styles.wrapper}>
                {orders.data &&
                    clients.data &&
                    timeSlots.data &&
                    articles.data &&
                    reviews.data && (
                        <>
                            <Header />
                            <div style={{ minHeight: '76vh' }}>
                                <AdminPage
                                    siteContent={siteContent.data}
                                    orders={orders.data}
                                    clients={clients.data}
                                    timeSlots={timeSlots.data}
                                    articles={articles.data}
                                    reviews={reviews.data}
                                    services={services.data}
                                />
                            </div>
                            <Footer />
                        </>
                    )}
            </div>
        </main>
    )
}
