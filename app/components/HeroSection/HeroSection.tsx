import styles from './HeroSection.module.scss'
import image from '../../../public/face.png'
import Image from 'next/image'
import OrderButton from '../orderButton/orderButton'
import logo from '@/public/str.png'

export interface SiteContentItem {
    id: number
    entity_name: string
    title: string | null
    description_1: string | null
    description_2: string | null
    description_3: string | null
    price: number | null
    link: string | null
    image: string | null
    is_active: boolean
    created_at?: Date | string
}

export default function HeroSection({
    content,
}: {
    content: SiteContentItem[]
}) {
    const getSingleItem = (entityName: string): Partial<SiteContentItem> => {
        return (
            content.find((item) => item.entity_name === entityName) || {
                entity_name: entityName,
            }
        )
    }

    const details = content
        .filter((el) => el.entity_name === 'details')
        .map((el) => (
            <li key={el.id} className={styles.info__content_item}>
                {el.image && (
                    <Image
                        className={styles.logo__str}
                        src={el.image}
                        alt="Логотип компании"
                        width={20}
                        height={20}
                        priority
                        style={{
                            minWidth: '20px',
                            minHeight: '20px',
                        }}
                    />
                )}
                <p>{el.title}</p>
            </li>
        ))

    return (
        <div className={styles.heroSection}>
            {/* <div className={styles.heroSection__text_wrapper}>
                <div className={styles.heroSection__text}>
                    Добро пожаловать на наш сайт!
                </div>
            </div> */}
            <div className={styles.heroSection__content}>
                {/* <button className={styles.heroSection__signUp}>
                    <b>Записаться</b>
                </button> */}
                <div className={styles.heroSection__regal}>
                    <div className={styles.heroSection__name}>
                        <p className={styles.heroSection__namedoc}>
                            {/* Екатерина Шитова */}
                            {getSingleItem('nameDoctor').title}
                        </p>
                        <p className={styles.heroSection__docprof}>
                            {/* врач-терапевт */}
                            {getSingleItem('profline').title}
                        </p>
                    </div>
                    <p className={styles.heroSection__backstage}>
                        {/* Ведущий врач - терапевт в крупнейшей цифровой клинике */}
                        {getSingleItem('shortDescription').title}
                    </p>
                    <ul className={styles.info__content_items}>{details}</ul>

                    <div className={styles.info__orderButton}>
                        <OrderButton text={'Обо мне'} />
                    </div>
                </div>
            </div>
            <div className={styles.heroSection__imageContainer}>
                <div className={styles.heroSection__circleBg_1}></div>
                <div className={styles.heroSection__circleBg_2}></div>
                <div className={styles.heroSection__dotsBg}></div>
                <Image
                    className={styles.heroSection__logo}
                    src={image}
                    alt="photo"
                    priority
                    style={{
                        maxWidth: '599px',
                        maxHeight: '1050px',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </div>
        </div>
    )
}
