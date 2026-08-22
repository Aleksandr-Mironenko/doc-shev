'use client'

import { useEffect, useState } from 'react'

export default function MessageClient({
    email,
    fio,
}: {
    email: string
    fio: string
}) {
    const [message, setMessage] = useState('')

    const [messageOK, setMessageOK] = useState<boolean>(false)

    useEffect(() => {
        setMessage(`Здравствуйте, ${fio}!
В ходе консультации выделила важное для вас:`)
    }, [fio])

    const gipoteza =
        '\n\nТакие проявления как правило наблюдаются у пациентов с установленным'

    const lek =
        '\n\nЕсть практика в подобных случаях приема _______  __ дней  __раз в день '
    const groc =
        '\n\nЦелесообразно рассмотреть возможность проведения ______ . После проведения процедуры будет понятнее, есть ли вероятность что '

    const addText = (text: string) => {
        setMessage((prev) => prev + text)
    }

    const sendText = async ({
        email,
        message,
    }: {
        email: string
        message: string
    }) => {
        if (email && message) {
            try {
                const response = await fetch('/api/admin/send_message_client', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        message: message,
                    }),
                })

                const result = await response.json()

                if (result.success) {
                    setMessageOK(true)
                } else {
                    alert(result.message || 'Ошибка при передаче сообщения.')
                }
            } catch (error) {
                console.error('Ошибка при передаче сообщения', error)
                alert('Ошибка при передаче сообщения клиенту')
            }
        } else {
            alert('Не передана электронная почта или сообщение')
        }
    }

    return messageOK ? (
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
            <p>Сообщение отправлено </p>
            <p>
                Клиент его получил <b>и это нельзя изменить</b>{' '}
            </p>
        </div>
    ) : (
        <div
            style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                margin: '10px auto',
                padding: '7px',
                borderRadius: '7px',
            }}
        >
            <h2
                style={{
                    textAlign: 'center',
                }}
            >
                <b>Сообщение клиенту:</b>
            </h2>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    style={{
                        padding: '20px 0',
                        fontWeight: 700,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    <button
                        onClick={() => {
                            addText(gipoteza)
                        }}
                    >
                        Гипотеза
                    </button>
                    <button
                        onClick={() => {
                            addText(lek)
                        }}
                    >
                        Лекарство
                    </button>
                    <button
                        onClick={() => {
                            addText(groc)
                        }}
                    >
                        Процедура
                    </button>
                </div>
                <textarea
                    value={message}
                    rows={10}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                        flex: 1,
                        border: '2px solid rgba(0,0,0,0.7)',
                        maxWidth: '80%',
                        backgroundColor: 'white',
                        margin: '10px',
                        padding: '7px',
                        borderRadius: '7px',
                    }}
                ></textarea>
            </div>

            <button
                style={{
                    borderRadius: '7px',
                    alignSelf: 'flex-end',
                    padding: '5px 10px',
                    backgroundColor: '#2f72cb',
                    color: 'white',
                }}
                onClick={() => {
                    sendText({ email, message })
                }}
            >
                ОТПРАВИТЬ СООБЩЕНИЕ
            </button>
        </div>
    )
}
