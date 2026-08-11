import styles from './contacts.module.scss'

export default function Contacts() {
    return (
        <div className={styles.contacts__text_wrapper}>
            <div className={styles.contacts__text}>Контакты</div>
        </div>
    )
}
// .contacts {
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
