import Link from 'next/link'
import Image from 'next/image'
import styles from './servicesSection.module.scss'
import marker from '@/public/marker.png'

export interface Services {
    name: string
    id: number
    url: string
    logo: string
}

// https://img.magnific.com/free-vector/flat-background-fall-season-celebration_23-2150670783.jpg',
//             description: 'описание',
//             tittlefullDescripton: 'внутренний заголовок',
//             fullDescripton: 'полное внутреннее описание',
//             logo: 'https://i.pinimg.com/originals/63/be/87/63be873bbaf3c35b4b2f49628d4d8d5b.jpg',
export default function ServicesSection() {
    const services = [
        {
            name: 'консультация',
            id: 0,
            url: '/',
            logo: 'https://i.pinimg.com/originals/63/be/87/63be873bbaf3c35b4b2f49628d4d8d5b.jpg',
        },
        {
            name: 'разбор анализов',
            id: 1,
            url: '/',
            logo: 'https://i.pinimg.com/originals/63/be/87/63be873bbaf3c35b4b2f49628d4d8d5b.jpg',
        },
        {
            name: 'просто спросить',
            id: 2,
            url: '/',
            logo: 'https://i.pinimg.com/originals/63/be/87/63be873bbaf3c35b4b2f49628d4d8d5b.jpg',
        },
    ]
    const servicesList = services.map((el: Services) => (
        <li key={el.id}>
            <Link href="/" className={styles.link}>
                <div>
                    <Image
                        src={marker}
                        alt="Логотип компании"
                        priority
                        width={50}
                        height={50}
                    />
                </div>
                <p>{el.name}</p>
            </Link>
        </li>
    ))
    return (
        <div className={styles.services}>
            <h2>Услуги</h2>
            <ul  className={styles.services__list}>{servicesList}</ul>
        </div>
    )
}
