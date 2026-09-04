// import styles from './HeroCalend.module.scss'
// import image from '../../../public/face.png'
// import Image from 'next/image'
// import OrderButton from '../orderButton/orderButton'
// import logo from '@/public/str.png'
// import Appointment from '@/app/components/appointment/appointment'
// export default function HeroCalend() {
//     return (
//         <div className={styles.heroSection}>
//             {/* <div className={styles.heroSection__text_wrapper}>
//                 <div className={styles.heroSection__text}>
//                     Добро пожаловать на наш сайт!
//                 </div>
//             </div> */}
//             <div className={styles.heroSection__content}>
//                 {/* <button className={styles.heroSection__signUp}>
//                     <b>Записаться</b>
//                 </button> */}
//                 <div className={styles.heroSection__regal}>
//                     <div className={styles.heroSection__name}>
//                         <p className={styles.heroSection__namedoc}>
//                             Екатерина Шитова
//                         </p>
//                         <p className={styles.heroSection__docprof}>
//                             врач-терапевт
//                         </p>
//                     </div>
//                     <p className={styles.heroSection__backstage}>
//                         Ведущий врач - терапевт в крупнейшей цифровой клинике
//                     </p>
//                     <div className={styles.info__content_items}>
//                         <div className={styles.info__content_item}>
//                             <Image
//                                 className={styles.logo__str}
//                                 src={logo}
//                                 alt="Логотип компании"
//                                 width={20}
//                                 height={20}
//                                 priority
//                                 style={{
//                                     minWidth: '20px',
//                                     minHeight: '20px',
//                                 }}
//                             />
//                             <p>Член Российского Кардиологического Общества</p>
//                         </div>
//                         <div className={styles.info__content_item}>
//                             <Image
//                                 className={styles.logo__str}
//                                 src={logo}
//                                 alt="Логотип компании"
//                                 width={20}
//                                 height={20}
//                                 priority
//                                 style={{
//                                     minWidth: '20px',
//                                     minHeight: '20px',
//                                 }}
//                             />
//                             <p>Публикации в СМИ</p>
//                         </div>
//                     </div>

//                     <div className={styles.info__orderButton}>
//                         <OrderButton />
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.heroSection__imageContainer}>
//                 <div className={styles.heroSection__circleBg_1}></div>
//                 <div className={styles.heroSection__circleBg_2}></div>
//                 <div className={styles.heroSection__dotsBg}></div>
//                 <Image
//                     className={styles.heroSection__logo}
//                     src={image}
//                     alt="photo"
//                     priority
//                     style={{
//                         maxWidth: '599px',
//                         maxHeight: '1050px',
//                         width: '100%',
//                         height: '100%',
//                     }}
//                 />
//             </div>
//         </div>
//     )
// }

import styles from './HeroCalend.module.scss'
import image from '../../../public/face.png'
import Image from 'next/image'

export default function HeroCalend({
    isSelectProduct,
    isHi,
}: {
    isSelectProduct?: boolean
    isHi?: boolean
}) {
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
                {!isHi && isSelectProduct && (
                    <div className={styles.heroSection__regal}>
                        <div className={styles.heroSection__name}>
                            <p className={styles.heroSection__namedoc}>
                                Добрый день!
                            </p>
                            <p className={styles.heroSection__docprof}>
                                выберите дату для нашей встечи
                            </p>
                        </div>
                        <p className={styles.heroSection__backstage}>
                            Просто нажимите на любую доступную дату в календаре
                        </p>
                    </div>
                )}

                {!isHi && !isSelectProduct && (
                    <div className={styles.heroSection__regal}>
                        <div className={styles.heroSection__name}>
                            <p className={styles.heroSection__namedoc}>
                                Добрый день!
                            </p>
                            <p className={styles.heroSection__docprof}>
                                выберите формат нашей консультации
                            </p>
                        </div>
                        <p className={styles.heroSection__backstage}>
                            Смелее выбирайте подходящий вариант для нашей
                            встречи
                        </p>
                    </div>
                )}
                {isHi && (
                    <div className={styles.heroSection__regal}>
                        <div className={styles.heroSection__name}>
                            <p className={styles.heroSection__namedoc}>
                                Добрый день!
                            </p>
                            {/* <p className={styles.heroSection__docprof}>
                                Меня зовут Екатерина Шитова
                            </p> */}
                        </div>
                        <p className={styles.heroSection__backstage}>
                            Меня зовут Екатерина Шитова, я врач-терапевт
                        </p>
                        <p className={styles.heroSection__backstage}>
                            Здесь вы узнаете немного больше обо мне
                        </p>
                    </div>
                )}
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
