// import Image from 'next/image'
import styles from './styles/Home.module.scss'
import Wrapper from '@/app/components/wrapper/wrapper'
export default function Home() {
    return (
        <div>
            <main className={styles.main}>
                <Wrapper />
            </main>
        </div>
    )
}
