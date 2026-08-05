import Image, { StaticImageData } from 'next/image'
import styles from './publicsSection.module.scss'
import chuma from '../../../public/ggg/chuma.jpg'
import energ from '../../../public/ggg/energ.jpg'
import kozha from '../../../public/ggg/kozha.jpg'
import migren from '../../../public/ggg/migren.jpg'
import prod from '../../../public/ggg/prod.jpg'
import kur from '../../../public/ggg/kur.jpg'

export interface Pub {
    id: number
    image: string | StaticImageData
    description: string
    tittlefullDescripton: string
    fullDescripton: string
    logo: string | StaticImageData
    data: string
}
export default function PublicsSection() {
    const pub = [
        {
            id: 0,
            image: chuma,
            description: 'Чума в России',
            tittlefullDescripton: 'Чума в России',
            fullDescripton: 'Чума в России',
            logo: chuma,
            data: '01.01.2020',
        },
        {
            id: 1,
            image: energ,
            description: 'Влияние энергетиков',
            tittlefullDescripton: 'Влияние энергетиков',
            fullDescripton: 'Влияние энергетиков',
            logo: energ,
            data: '02.01.2020',
        },
        {
            id: 2,
            image: kozha,
            description: 'Кожный барьер',
            tittlefullDescripton: 'Кожный барьер',
            fullDescripton: 'Кожный барьер',
            logo: kozha,
            data: '03.01.2020',
        },
        // {
        //     id: 3,
        //     image: migren,
        //     description: 'Мигрень',
        //     tittlefullDescripton: 'Мигрень',
        //     fullDescripton: 'Мигрень',
        //     logo: migren,
        //     data: '03.01.2020',
        // },
        // {
        //     id: 4,
        //     image: prod,
        //     description: 'Опасность в огороде',
        //     tittlefullDescripton: 'Опасность в огороде',
        //     fullDescripton: 'Опасность в огороде',
        //     logo: prod,
        //     data: '03.01.2020',
        // },
        // {
        //     id: 5,
        //     image: kur,
        //     description: 'Отказ от курения',
        //     tittlefullDescripton: 'Отказ от курения',
        //     fullDescripton: 'Отказ от курения',
        //     logo: kur,
        //     data: '03.01.2020',
        // },
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
