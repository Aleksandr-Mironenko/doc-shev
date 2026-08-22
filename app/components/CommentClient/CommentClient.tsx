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
                margin: '15px',
                backgroundColor: 'white',
                display: 'flex',

                borderRadius: '7px',
            }}
        >
            <div
                style={{
                    width: '40%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    backgroundColor: 'rgba(255,255,255,0,8',
                    margin: '10px auto',
                    padding: '7px',
                    borderRadius: '7px',
                }}
            >
                <h2>
                    <b>Не забудь сказать</b>{' '}
                </h2>
                <p>
                    В ходе консультации я заполняю комментарий, чтобы отправить
                    его вам.
                </p>
                <p>Вы можете слышать звук печатанья клавиатуры</p>
                <p>Для вас останется краткое напоминание</p>
            </div>
            <div
                style={{
                    width: '60%',
                    backgroundColor: 'white',
                    margin: '10px auto',
                    padding: '7px',
                    borderRadius: '7px',
                }}
            >
                <h2>
                    <b style={{ marginRight: '10px' }}>Комментарий для себя:</b>
                </h2>
                <textarea
                    value={comment}
                    rows={4}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                        border: '2px solid rgba(0,0,0,0.7)',
                        width: '95%',
                        backgroundColor: 'white',
                        margin: '10px',
                        padding: '7px',
                        borderRadius: '7px',
                    }}
                ></textarea>
            </div>
        </div>
    )
}
