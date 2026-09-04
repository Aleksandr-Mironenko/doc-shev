import styles from './AboutMeContent.module.scss'

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

export default function AboutMeContent({
    content,
}: {
    content: SiteContentItem[]
}) {
    // const getSingleItem = (entityName: string): Partial<SiteContentItem> => {
    //     return (
    //         content.find((item) => item.entity_name === entityName) || {
    //             entity_name: entityName,
    //         }
    //     )
    // }

    const details1 = content //обо мне
        .filter((el) => el.entity_name === 'aboutMeFull')
        .map((el) => (
            <li key={el.id}>
                {el.description_1 && (
                    <p className={styles.aboutMeContent__item}>
                        {el.description_1}
                    </p>
                )}
                {el.description_2 && (
                    <p className={styles.aboutMeContent__item}>
                        {el.description_2}
                    </p>
                )}
                {el.description_3 && (
                    <p className={styles.aboutMeContent__item}>
                        {el.description_3}
                    </p>
                )}
            </li>
        ))

    const detailst2 = content //обо мне
        .filter((el) => el.entity_name === 'aboutMeExperience')

    const detailst2Name = detailst2[0].title

    const detailst2Content = detailst2.map((el) => (
        <li key={el.id} className={styles.aboutMeContent__item}>
            {el.description_1 && <p>{el.description_1}</p>}
            {el.description_2 && <p>{el.description_2}</p>}
            {el.description_3 && <p>{el.description_3}</p>}
        </li>
    ))

    const detailst3 = content //обо мне
        .filter((el) => el.entity_name === 'educationFull')

    const details3Name = detailst3[0]?.title
    const detailst3Content = detailst3.map((el) => (
        <li key={el.id} className={styles.aboutMeContent__item}>
            <h3>
                <b>{el.title}</b>
            </h3>
            {el.description_1 && <p>{el.description_1}</p>}
            {el.description_2 && <p>{el.description_2}</p>}
            {el.description_3 && <p>{el.description_3}</p>}
        </li>
    ))

    // const ihelp = content.filter((el) => el.entity_name === 'ihelp')
    // const details = ihelp.map((el) => (
    //     <li
    //         key={el.id}
    //         style={{ width: `${100 / ihelp.length}%` }}
    //         className={styles.public}
    //     >
    //         {el.image && (
    //             <div className={styles.image}>
    //                 <Image
    //                     className={styles.image__logo}
    //                     src={el.image}
    //                     alt="Логотип компании"
    //                     priority
    //                     width={50}
    //                     height={50}
    //                     style={{ width: '40px', height: '40x' }}
    //                 />
    //             </div>
    //         )}
    //         <div className={styles.image__description}>
    //             <p>{el.title} </p>
    //         </div>
    //         <div className={styles.image__fullDescripton}>
    //             <p>{el.description_1}</p>
    //         </div>
    //         {/* <button className={styles.image__details}>Подробнее →</button> */}
    //     </li>
    // ))
    return (
        <div className={styles.aboutMeContent__text_wrapper}>
            <ul>{details1}</ul>
            <h3>
                <b>{detailst2Name}</b>
            </h3>
            <ul>{detailst2Content}</ul>
            <ul>{detailst3Content}</ul>
        </div>
    )
}
