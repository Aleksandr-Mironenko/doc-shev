// 'use client'
import Image from 'next/image'
import styles from './catchUp.module.scss'
// Adjust the logo import path if your asset is located elsewhere
import logo from '../../../public/close.svg'
import image from '../../../public/nout_stol.png'
import calend from '../../../public/ggg/cal.png'
import OrderButton from '../orderButton/orderButton'
// import { useState } from 'react'

export default function CatchUp() {
    // const [a, setA] = useState<string>('')
    // const [resa, setResA] = useState<string>('')
    // const [arrjoin, setArrjoin] = useState<string>('')
    // const [resulta, setResulta] = useState<string>('')
    // // function removeNonCyrillic(text: string) {
    // //     // Удаляет все символы, кроме кириллицы и пробелов
    // //     return setResA(text.replace(/[^\u0400-\u04FF\s]/g, ''))
    // // }
    // function removeNonCyrillic(text: string) {
    //     const result = text.replace(
    //         /\d+|[^\u0400-\u04FF\s\d]/g,
    //         (match, offset, str) => {
    //             // Если не цифры — удаляем
    //             if (match.charCodeAt(0) < 48 || match.charCodeAt(0) > 57) {
    //                 return ''
    //             }

    //             const prev2 = str
    //                 .slice(Math.max(0, offset - 2), offset)
    //                 .toUpperCase()
    //             const prev3 = str
    //                 .slice(Math.max(0, offset - 3), offset)
    //                 .toUpperCase()

    //             // Оставляем только БТ51 и БТ53
    //             if (
    //                 prev2 === 'БТ' &&
    //                 (match === '51' ||
    //                     match === '53' ||
    //                     match === '52' ||
    //                     match === '56' ||
    //                     match === '53' ||
    //                     match === '54' ||
    //                     match === '58')
    //             ) {
    //                 return match
    //             }

    //             // Оставляем любые цифры после ГЗО
    //             if (prev3 === 'ГЗО') {
    //                 return match
    //             }

    //             return ''
    //         },
    //     )

    //     setResA(result)
    // }
    // function removeNonCyrillicAndSplit(text: string, delimiters: string) {
    //     const str = delimiters.split(',')
    //     // Создаем регулярное выражение из массива разделителей
    //     const delimiterPattern = str
    //         .map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    //         .join('|')

    //     // Разделяем по разделителям и фильтруем пустые строки
    //     const words = text
    //         .split(new RegExp(delimiterPattern))
    //         .filter((word: string) => word.trim().length > 0)

    //     // Разделитель, который будем ставить перед каждым словом
    //     const prefix = str[0]

    //     // Каждое слово с новой строки и с разделителем перед ним
    //     setResulta(words.map((word) => `${prefix} - ${word.trim()}`).join('\n'))
    // }
    // console.log(resulta)
    return (
        //     <div className={styles.catchUp__wrapper}>
        //         <div className={styles.catchUp}>
        //             <div className={styles.catchUp__description}>
        //                 <p>Готовы начать заботиться о своем здоровье?</p>
        //                 <p>Запишитесь на онлайн-консультацию или задайте вопрос</p>
        //             </div>

        //             {/* <div className={styles.catchUp__box}> */}
        //             <div className={styles.buttons}>
        //                 <button
        //                     className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.blue}`}
        //                     // onClick={() => {}}
        //                 >
        //                     <span>Записаться на консультацияю</span>
        //                     <Image
        //                         className={styles.buttonsHero__calendarLogo}
        //                         src={logo}
        //                         alt="закрыть"
        //                         width={30}
        //                         height={30}
        //                         priority
        //                         style={{ minHeight: '100%' }}
        //                     />
        //                 </button>
        //                 <button
        //                     className={`${styles.buttonsHero__button} ${styles.buttonsHero__info}`} // onClick={() => {}}
        //                 >
        //                     <span>Написать сообщение</span>
        //                     <Image
        //                         className={styles.buttonsHero__calendarLogo}
        //                         src={logo}
        //                         alt="закрыть"
        //                         width={30}
        //                         height={30}
        //                         priority
        //                         style={{ minHeight: '100%' }}
        //                     />
        //                 </button>
        //             </div>
        //             {/* </div> */}
        //         </div>

        //         <div className={`${styles.buttonsHero} ${styles.second} `}></div>
        //     </div>
        // )
        <div className={styles.wrapper}>
            <div className={styles.catchUp}>
                <div className={styles.catchUp__description}>
                    <p className={styles.catchUp__text}>
                        Готовы начать заботиться о своем здоровье?
                    </p>
                    <p className={styles.catchUp__text}>
                        Запишитесь на онлайн-консультацию или задайте вопрос
                    </p>
                </div>

                {/* <div className={styles.catchUp__box}> */}
                <div className={styles.catchUp__orderButton}>
                    <OrderButton text="Написать сообщение" />
                </div>

                {/* </div> */}
            </div>

            <div className={styles.imagebox}>
                <Image
                    className={styles.imagebox__image}
                    src={image}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </div>
        </div>
    )
}
{
    /* <div>
                <input
                    type="text"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                />
                <button
                    onClick={() => {
                        removeNonCyrillic(a)
                    }}
                >
                    сделать
                </button>
            </div>

            <div>
                <p>{resa}</p>
            </div>
            <div>
                <input
                    type="text"
                    value={arrjoin}
                    onChange={(e) => setArrjoin(e.target.value)}
                />
                <button
                    onClick={() => {
                        removeNonCyrillicAndSplit(resa, arrjoin)
                    }}
                >
                    сделать красиво
                </button>
            </div>
            <div>
                <p>{resulta}</p>
            </div> */
}
