import Image from 'next/image'
import styles from './publicsSection.module.scss'
export interface Pub {
    id: number
    image: string
    description: string
    tittlefullDescripton: string
    fullDescripton: string
    logo: string
    data: string
}
export default function PublicsSection() {
    const pub = [
        {
            id: 0,
            image: 'https://img.magnific.com/free-vector/flat-background-fall-season-celebration_23-2150670783.jpg',
            description: 'описание',
            tittlefullDescripton: 'внутренний заголовок',
            fullDescripton: 'полное внутреннее описание',
            logo: 'https://i.pinimg.com/originals/63/be/87/63be873bbaf3c35b4b2f49628d4d8d5b.jpg',
            data: '01.01.2020',
        },
        {
            id: 1,
            image: 'https://img.magnific.com/free-vector/flat-background-fall-season-celebration_23-2150670783.jpg',
            description: 'описание',
            tittlefullDescripton: 'внутренний заголовок',
            fullDescripton: 'полное внутреннее описание',
            logo: 'https://i.pinimg.com/originals/63/be/87/63be873bbaf3c35b4b2f49628d4d8d5b.jpg',
            data: '02.01.2020',
        },
        {
            id: 2,
            image: 'https://img.magnific.com/free-vector/flat-background-fall-season-celebration_23-2150670783.jpg',
            description: 'описание',
            tittlefullDescripton: 'внутренний заголовок',
            fullDescripton: 'полное внутреннее описание',
            logo: 'https://i.pinimg.com/originals/63/be/87/63be873bbaf3c35b4b2f49628d4d8d5b.jpg',
            data: '03.01.2020',
        },
    ]
    const publics = pub.map((el: Pub) => (
        <li
            key={el.id}
            style={{ width: `${100 / pub.length}%` }}
            className={styles.public}
        >
            <div className={styles.image}>
                <Image
                    className={styles.image__logo}
                    src={el.logo}
                    alt="Логотип компании"
                    priority
                    width={50}
                    height={50}
                    style={{ minWidth: '40px', minHeight: '40x' }}
                />
            </div>
            <div className={styles.image__description}>
                <p>{el.description} </p>
            </div>
            <div className={styles.image__data}>
                <p>{el.data}</p>
            </div>
        </li>
    ))
    return (
        <div className={styles.publics}>
            <div className={styles.publics__head}>
                <h2 className={styles.publics__h2}>Публикации в СМИ</h2>
                <p className={styles.publics__button}>Подробнее</p>
            </div>

            <ul className={styles.publics__list}>{publics}</ul>
        </div>
    )
}

//  <div className={styles.info__content_item}>
//     <Image
//         className={styles.logo__str}
//         src={logo}
//         alt="Логотип компании"
//         width={40}
//         height={40}
//         priority
//         style={{ minWidth: '40px', minHeight: '40x' }}
//     />
//     <p>Ведущий врач терапевт в крупнейшей цифровой клинике</p>
// </div>
