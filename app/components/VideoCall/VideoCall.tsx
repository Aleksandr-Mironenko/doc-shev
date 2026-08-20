'use client'

import React, { useState } from 'react'
import styles from './VideoCall.module.scss'

interface VideoCallProps {
    roomUuid: string
    link?: string
}

export default function VideoCall({ roomUuid, link }: VideoCallProps) {
    const [isLoading, setIsLoading] = useState(true)

    // Используем полученную ссылку или fallback по умолчанию
    const edgeConfUrl =
        link || `https://edgeconf.ru/call/?roomId=serv0${roomUuid}`

    return (
        <div className={styles.videoContainer}>
            {isLoading && (
                <div className={styles.loader}>
                    <p>Подключение к серверу видеосвязи...</p>
                </div>
            )}

            <iframe
                src={edgeConfUrl}
                className={styles.iframe}
                allow="camera; microphone; display-capture; fullscreen"
                allowFullScreen={true} // Явно указываем {true}
                onLoad={() => setIsLoading(false)}
                title="Видеоконсультация"
            />
        </div>
    )
}
