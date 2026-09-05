import Image from 'next/image'
import styles from './buttonsHero.module.scss'
// Adjust the logo import path if your asset is located elsewhere
// import logo from '../../../public/close.svg'
import zvezda from '../../../public/ggg/zvezda.svg'
import cserd from '../../../public/ggg/kardioserd.svg'
import OrderButton from '../orderButton/orderButton'

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

export default function ButtonsHero({
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
    // ..пример
    // const details = content
    //     .filter((el) => el.entity_name === 'details')
    //     .map((el) => (
    //         <li key={el.id} className={styles.info__content_item}>
    //             {el.image && (
    //                 <Image
    //                     className={styles.logo__str}
    //                     src={el.image}
    //                     alt="Логотип компании"
    //                     width={20}
    //                     height={20}
    //                     priority
    //                     style={{
    //                         minWidth: '20px',
    //                         minHeight: '20px',
    //                     }}
    //                 />
    //             )}
    //             <p>{el.title}</p>
    //         </li>
    //     ))
    // {
    //     getSingleItem('nameDoctor').title
    // }

    return (
        <div className={styles.buttonsHero__wrapper}>
            <div className={styles.buttonsHero__orderButton}>
                <OrderButton text={'Обо мне'} />
            </div>
            <div className={`${styles.buttonsHero} ${styles.second} `}>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        {/* <Image
                            className={styles.burgerMenu__logo}
                            src={logo}
                            alt="закрыть"
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        /> */}
                        <span className={styles.buttonsHero__text}>
                            {getSingleItem('merits').description_1}
                        </span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>года опыта </p>
                    </div>
                </div>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        <Image
                            className={styles.burgerMenu__logo}
                            src={zvezda}
                            alt=""
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        />
                        <span className={styles.buttonsHero__text}>
                            {getSingleItem('merits').description_2}
                        </span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>довольных клиентов </p>
                    </div>
                </div>
                <div className={styles.buttonsHero__part}>
                    <div className={styles.buttonsHero__info}>
                        <Image
                            className={styles.burgerMenu__logo}
                            src={cserd}
                            alt=""
                            width={30}
                            height={30}
                            priority
                            style={{ width: '30px', height: '30px' }}
                        />
                        <span className={styles.buttonsHero__text}>
                            {' '}
                            {getSingleItem('merits').description_3}
                        </span>
                    </div>
                    <div className={styles.buttonsHero__description}>
                        <p>положительных отзывов </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
