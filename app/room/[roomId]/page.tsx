import { notFound } from 'next/navigation'
import { dbGetLinkByRoomId } from '@/app/services/servicesDB'
import RoomClient from '@/app/components/RoomClient/RoomClient'
import styles from './styles.module.scss'
import Header from '@/app/components/header/header'
import Footer from '@/app/components/footer/Footer'
import { cookies } from 'next/headers'

interface PageProps {
    params: Promise<{ roomId: string }>
}

export default async function RoomPage({ params }: PageProps) {
    const { roomId } = await params

    const res = await dbGetLinkByRoomId(roomId)

    if (!res.success || !res.data) {
        notFound() // Отобразит страницу 404
    }

    const cookieStore = cookies()
    const hasAuthCookie = (await cookieStore).has('auth')
    const { fio, status, startTime } = res.data

    return (
        <main className={styles.main}>
            <div className={styles.wrapper}>
                <Header />

                {/* Даем центральному блоку flex: 1, чтобы он выталкивал футер вниз */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <RoomClient
                        hasAuthCookie={hasAuthCookie}
                        roomId={roomId}
                        fio={fio}
                        initialStatus={status}
                        startTime={startTime}
                    />
                </div>

                <Footer />
            </div>
        </main>
    )
}
