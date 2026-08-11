import styles from './documents.module.scss'

export default function Documents() {
    return (
        <div className={styles.documents__text_wrapper}>
            <div className={styles.documents__text}>Документы</div>
        </div>
    )
}
// .documents {
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
