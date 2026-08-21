'use client'

import { useEffect, useState } from 'react'

export default function CommentClient({ clientId }: { clientId: string }) {
    const [comment, setComment] = useState<string>('')

    useEffect(() => {
        const getComment = async (clientId: string) => {
            if (clientId) {
                try {
                    const response = await fetch(
                        '/api/admin/get_comment_on_consult',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                clientId: clientId,
                            }),
                        },
                    )

                    const result = await response.json()

                    if (result.success) {
                        setComment(result.comment)
                    } else {
                        alert(
                            result.message || 'Ошибка при поиске комментария.',
                        )
                    }
                } catch (error) {
                    console.error('Ошибка получения комментария', error)
                    alert('Ошибка при получении комментариев из бд')
                }
            } else {
                alert(
                    'Идентификатор комнаты не передан, это важно для комментариев',
                )
            }
        }

        getComment(clientId)
    }, [clientId])

    useEffect(() => {
        // Устанавливаем таймер на 500мс
        const timer = setTimeout(async () => {
            if (comment) {
                if (clientId) {
                    try {
                        const response = await fetch(
                            '/api/admin/update_comment_in_client',
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    clientId: clientId,
                                    comment,
                                }),
                            },
                        )

                        const result = await response.json()

                        if (!result.success) {
                            alert(
                                result.message ||
                                    'Ошибка при поиске комментария.',
                            )
                        }
                    } catch (error) {
                        console.error('Ошибка получения комментария', error)
                        alert('Ошибка при получении комментариев из бд')
                    }
                } else {
                    alert(
                        'Идентификатор комнаты не передан, это важно для комментариев',
                    )
                }
            }
        }, 500)

        // Функция очистки: отменяет предыдущий таймер, если comment изменился до истечения 500мс
        return () => clearTimeout(timer)
    }, [comment, clientId])

    return (
        <div
            style={{
                width: '80%',
                textAlign: 'center',
                backgroundColor: 'white',
                margin: '10px auto',
                padding: '7px',
                borderRadius: '7px',
            }}
        >
            <h2>
                <b>Комментарий клиенту:</b>
            </h2>
            <textarea
                value={comment}
                rows={4}
                onChange={(e) => setComment(e.target.value)}
                style={{
                    width: '80%',
                    backgroundColor: 'white',
                    margin: '10px',
                    padding: '7px',
                    borderRadius: '7px',
                }}
            ></textarea>
        </div>
    )
}
