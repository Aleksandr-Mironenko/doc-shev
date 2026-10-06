import AdminPage from '@/app/components/AdminPage/AdminPage'
import {
    getAllOrders,
    getAllClients,
    getTimeSlots,
    getAllArticles,
    getAllReviews,
    dbGetAllSiteContent,
    dbGetAllServices,
} from '@/app/service/adminServices'
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
    const service = await dbGetAllServices()
    // const services = siteContent.data.filter(
    //     (el) => el.entity_name === 'services',
    // )
    // console.log(services)

    const services = service.data.filter((el) => el.entity === 'service')
    const paidContent = service.data.filter(
        (el) => el.entity === 'paid_content',
    )
    const freeContent = service.data.filter(
        (el) => el.entity === 'free_content',
    )

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
                                    services={services}
                                    paidContent={paidContent}
                                    freeContent={freeContent}
                                />
                            </div>
                            <Footer />
                        </>
                    )}
            </div>
        </main>
    )
}
