import Image from 'next/image'
import styles from './iHelp.module.scss'
import krest from '../../../public/ggg/heartt.svg'
import prob from '../../../public/ggg/prob.svg'
import chat from '../../../public/ggg/chat4.svg'
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
            description: 'консультация',
            tittlefullDescripton: 'внутренний заголовок',
            fullDescripton:
                'Онлайн прием и консультация по вашим вопросам здоровья.',
            logo: krest,
            data: '01.01.2020',
        },
        {
            id: 1,
            image: 'https://img.magnific.com/free-vector/flat-background-fall-season-celebration_23-2150670783.jpg',
            description: 'разбор анализов',
            tittlefullDescripton: 'внутренний заголовок',
            fullDescripton:
                'Интерпритация резуультатов анализов и рекомендации.',
            logo: prob,
            data: '02.01.2020',
        },
        {
            id: 2,
            image: 'https://img.magnific.com/free-vector/flat-background-fall-season-celebration_23-2150670783.jpg',
            description: 'просто спросить',
            tittlefullDescripton: 'внутренний заголовок',
            fullDescripton: 'Короткие и не очень вопросы о здоровье и лечении.',
            logo: chat,
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
            <button className={styles.image__details}>Подробнее →</button>
        </li>
    ))
    return (
        <div className={styles.publics}>
            <h2 className={styles.publics__h2}>Чем я могу вам помочь</h2>

            <ul className={styles.publics__list}>{publics}</ul>
        </div>
    )
}
