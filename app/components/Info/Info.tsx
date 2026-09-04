import styles from './Info.module.scss'
import Image from 'next/image'
import logo from '@/public/str.png'
import books from '@/public/ggg/books.svg'
import peaple from '@/public/ggg/peaple.svg'
import hand from '@/public/ggg/hand.svg'
import head from '@/public/ggg/head.svg'
import diplom from '@/public/ggg/diplom.svg'
import newspaper from '@/public/ggg/newspaper.svg'
import ok from '@/public/ok.png'
import head2 from '@/public/ggg/head2.svg'
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
export default function Info({ content }: { content: SiteContentItem[] }) {
    const getSingleItem = (entityName: string): Partial<SiteContentItem> => {
        return (
            content.find((item) => item.entity_name === entityName) || {
                entity_name: entityName,
            }
        )
    }

    const details1 = content
        .filter((el) => el.entity_name === 'aboutMe')
        .map((el) => <li key={el.id}>{el.title}</li>)

    const details2 = content
        .filter((el) => el.entity_name === 'principies')
        .map((el) => (
            <li key={el.id} className={styles.info__content_item}>
                <Image
                    className={styles.logo__str}
                    src={ok}
                    alt=""
                    width={25}
                    height={25}
                    priority
                    style={{ width: '25px', height: '25px' }}
                />
                <p>{el.title}</p>
            </li>
        ))

    const details3 = content
        .filter((el) => el.entity_name === 'education')
        .map((el) => (
            <li key={el.id} className={styles.info__content_item}>
                <Image
                    className={styles.logo__str}
                    src={el.image}
                    alt=""
                    width={40}
                    height={40}
                    priority
                    style={{ width: '30px', height: '30px' }}
                />
                <p>{el.title}</p>
            </li>
        ))

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
        <div className={styles.info}>
            <div className={styles.info__content}>
                <div
                    className={`${styles.info__content_text} ${styles.info__content_boxes}`}
                >
                    <h2 className={styles.info__content_head}>Обо мне</h2>
                    {/* <div>
                        <p>
                            Ведущий врач терапевт в крупнейшей цифровой клинике.
                        </p>
                        <p>Опыт дистанционной работы 2 года.</p>
                        <p>Подробнее →</p>
                    </div> */}
                    <div>
                        <ul
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }}
                        >
                            {details1}
                        </ul>
                    </div>

                    {/* <div className={styles.info__content_three}>
                        <div className={styles.info__content_box}>
                            <Image
                                className={styles.logo__str}
                                src={books}
                                alt=""
                                width={20}
                                height={20}
                                priority
                                style={{ width: '30px', height: '30px' }}
                            />
                            <p className={styles.info__content_boxtext}>
                                Доказательные методы лечения
                            </p>
                        </div>
                        
                        <div className={styles.info__content_box}>
                            <Image
                                className={styles.logo__str}
                                src={hand}
                                alt=""
                                width={20}
                                height={20}
                                priority
                                style={{ width: '30px', height: '30px' }}
                            />
                            <p className={styles.info__content_boxtext}>
                                Поддержка на всех этапах
                            </p>
                        </div>
                    </div> */}
                </div>
                <div className={styles.info__content_boxes}>
                    <div className={styles.info__content_items}>
                        <h2 className={styles.info__content_head}>
                            Мои принципы
                        </h2>
                        <ul
                            style={{
                                margin: 0,
                                padding: 0,
                                listStyleType: 'none',
                            }}
                        >
                            {details2}
                        </ul>

                        {/* <div className={styles.info__content_item}>
                        <Image
                            className={styles.logo__str}
                            src={logo}
                            alt="Логотип компании"
                            width={40}
                            height={40}
                            priority
                            style={{ minWidth: '40px', minHeight: '40x' }}
                        />
                        <p>
                            Ведущий врач терапевт в крупнейшей цифровой клинике
                        </p>
                    </div> */}
                        {/* <div className={styles.info__content_item}>
                            <Image
                                className={styles.logo__str}
                                src={ok}
                                alt=""
                                width={25}
                                height={25}
                                priority
                                style={{ width: '25px', height: '25px' }}
                            />
                            <p>Доказательная медицина</p>
                        </div>
                        <div className={styles.info__content_item}>
                            <Image
                                className={styles.logo__str}
                                src={ok}
                                alt=""
                                width={25}
                                height={25}
                                priority
                                style={{ width: '25px', height: '25px' }}
                            />
                            <p>Честность и открытость</p>
                        </div>
                        <div className={styles.info__content_item}>
                            <Image
                                className={styles.logo__str}
                                src={ok}
                                alt=""
                                width={25}
                                height={25}
                                priority
                                style={{ width: '25px', height: '25px' }}
                            />
                            <p>Индивидуальный подход</p>
                        </div>
                        <div className={styles.info__content_item}>
                            <Image
                                className={styles.logo__str}
                                src={ok}
                                alt="Логотип компании"
                                width={25}
                                height={25}
                                priority
                                style={{ width: '25px', height: '25px' }}
                            />
                            <p>Забота о вашем здоровье и комфорте</p>
                        </div> */}
                    </div>
                    <div className={styles.info__content_items}>
                        <h2 className={styles.info__content_head}>
                            Образование и квалификация
                        </h2>
                        {/* <div className={styles.info__content_item}>
                        <Image
                            className={styles.logo__str}
                            src={logo}
                            alt="Логотип компании"
                            width={40}
                            height={40}
                            priority
                            style={{ minWidth: '40px', minHeight: '40x' }}
                        />
                        <p>
                            Ведущий врач терапевт в крупнейшей цифровой клинике
                        </p>
                    </div> */}
                        <ul
                            style={{
                                margin: 0,
                                padding: 0,
                                listStyleType: 'none',
                            }}
                        >
                            {details3}
                        </ul>
                        {/* <div className={styles.info__content_item}>
                            <Image
                                className={styles.logo__str}
                                src={head}
                                alt=""
                                width={40}
                                height={40}
                                priority
                                style={{ width: '30px', height: '30px' }}
                            />
                            <p>
                                Приволжский исследовательский медицинский
                                университет
                            </p>
                        </div>
                        <div className={styles.info__content_item}>
                            <Image
                                className={styles.logo__str}
                                src={diplom}
                                alt=""
                                width={40}
                                height={40}
                                priority
                                style={{ width: '30px', height: '30px' }}
                            />
                            <p>Курс "Расширенные реанимационные мероприятия"</p>
                        </div>
                        <div className={styles.info__content_item}>
                            <Image
                                className={styles.logo__str}
                                src={diplom}
                                alt=""
                                width={40}
                                height={40}
                                priority
                                style={{ width: '30px', height: '30px' }}
                            />
                            <p>Курс "Клиническая нутрициология"</p>
                        </div> */}
                        {/* <div className={styles.info__content_item}>
                            <Image
                                className={styles.logo__str}
                                src={newspaper}
                                alt=""
                                width={40}
                                height={40}
                                priority
                                style={{ width: '30px', height: '30px' }}
                            />
                            <p>Публикации в СМИ</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
