import styles from './infoProducts.module.scss'

export default function InfoProducts() {
    return (
        <div className={styles.infoProducts__text_wrapper}>
            <div className={styles.infoProducts__text}>
                Информационные продукты
            </div>
        </div>
    )
}
// .infoProducts {
//     &__link {
//         height: 100%;
//         display: block;
//     }
//     &__text {
//         color: black;

//         &_wrapper {
//             height: 100%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//         }
//     }
// }
