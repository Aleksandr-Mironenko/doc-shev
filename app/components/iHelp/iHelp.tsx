import Image from 'next/image'
import styles from './iHelp.module.scss'
export interface Pub {
    id: number
    image: string
    description: string
    tittlefullDescripton: string
    fullDescripton: string
    logo: string
    data: string
}
export default function iHelp() {
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
                    style={{ width: '40px', height: '40x' }}
                />
            </div>
            <div className={styles.image__description}>
                <p>{el.description} </p>
            </div>
            <div className={styles.image__fullDescripton}>
                <p>{el.fullDescripton}</p>
            </div>
            <button className={styles.image__details}>Подробнее</button>
        </li>
    ))
    return (
        <div className={styles.publics}>
            <h2 className={styles.publics__h2}>Чем я могу вам помочь</h2>

            <ul className={styles.publics__list}>{publics}</ul>
        </div>
    )
}
