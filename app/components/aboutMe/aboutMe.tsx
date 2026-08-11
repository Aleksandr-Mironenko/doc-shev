import styles from './aboutMe.module.scss'

export default function AboutMe() {
    return (
        <div className={styles.aboutMe__text_wrapper}>
            <div className={styles.aboutMe__text}>Обо мне</div>
        </div>
    )
}
