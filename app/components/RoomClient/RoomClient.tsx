'use client'

import React, { useState, useEffect } from 'react'
import VideoCall from '@/app/components/VideoCall/VideoCall'
import OrderButton from '../orderButton/orderButton'
import CommentClient from '../CommentClient/CommentClient'
import MessageClient from '../MessageClient/MessageClient'

interface RoomClientProps {
    hasAuthCookie: boolean
    roomId: string
    fio: string
    initialStatus: 'too_early' | 'active' | 'expired'
    startTime: string
}

export default function RoomClient({
    hasAuthCookie,
    roomId,
    fio,
    initialStatus,
    startTime,
}: RoomClientProps) {
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
    const [videoLink, setVideoLink] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [clientId, setClientId] = useState<string>('')

    if (initialStatus === 'too_early') {
        return (
            <div
                className="container"
                style={{
                    textAlign: 'center',
                    marginTop: '20vh',
                    minHeight: '400px',
                }}
            >
                <h1>Здравствуйте, {fio}! 👋</h1>
                <p>Ваша консультация еще не началась.</p>
                <p>
                    Ждем вас:
                    <strong>
                        {new Date(startTime).toLocaleString('ru-RU')}
                    </strong>
                </p>
                <p style={{ color: 'gray', fontSize: '0.9em' }}>
                    Ссылка станет активной за 5 минут до начала.
                </p>
            </div>
        )
    }

    if (initialStatus === 'expired') {
        return (
            <div
                className="container"
                style={{
                    textAlign: 'center',
                    marginTop: '20vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '400px',
                }}
            >
                <h1>Время вышло ⏳</h1>
                <p>
                    Ссылка больше недействительна. Если у вас остались вопросы,
                    свяжитесь со мной.
                </p>
                <div style={{ textAlign: 'center', marginTop: '20vh' }}>
                    <OrderButton text={'Написать сообщение'} />
                </div>
            </div>
        )
    }

    // Обработчик отправки формы подтверждения
    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/verification-client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fio,
                    roomId,
                    email: email.trim(), // Убираем случайные пробелы
                    password: password.trim(), // Убираем случайные пробелы
                }),
            })

            const result = await res.json()

            if (result.success && result.link) {
                setVideoLink(result.link)
                setIsConfirmed(true)
            } else {
                // Выводим текст ошибки с бэкенда (например: "Неверный email или код")
                alert(result.error || 'Не удалось получить ссылку для входа')
            }
        } catch (error) {
            console.error('Ошибка входа:', error)
            alert('Произошла ошибка при подключении к серверу')
        } finally {
            setLoading(false)
        }
    }

    const handleAdmin = async () => {
        setLoading(true)

        try {
            const res = await fetch('/api/admin/verification-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomId,
                }),
            })

            const result = await res.json()

            if (
                result.success &&
                result.link &&
                result.clientId &&
                result.phone &&
                result.email
            ) {
                setVideoLink(result.link)
                setIsConfirmed(true)
                setClientId(result.clientId)
                setPhone(result.phone)
                setEmail(result.email)
            } else {
                // Выводим текст ошибки с бэкенда (например: "Неверный email или код")
                alert(result.error || 'Не удалось получить ссылку для входа')
            }
        } catch (error) {
            console.error('Ошибка входа:', error)
            alert('Произошла ошибка при подключении к серверу')
        } finally {
            setLoading(false)
        }
    }

    // Если данные подтверждены и ссылка получена — показываем iframe
    if (isConfirmed && videoLink) {
        return (
            <div
                className="container"
                style={{ width: '100vw', margin: '20px auto' }}
            >
                {hasAuthCookie ? (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Клиент: {fio}</h2>
                        <p>Его номер телефона {phone}</p>
                    </div>
                ) : (
                    <>
                        <h2 style={{ textAlign: 'center' }}>
                            Консультант:<b> Шитова Екатерина Вадимовна</b>{' '}
                        </h2>
                        <h2 style={{ textAlign: 'center' }}>
                            Здравствуйте, <b>{fio}</b>!
                        </h2>
                    </>
                )}
                {hasAuthCookie && <CommentClient clientId={clientId} />}
                <VideoCall roomUuid={roomId} link={videoLink} />
                {hasAuthCookie ? (
                    <MessageClient email={email} fio={fio} />
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            backgroundColor: 'white',
                            margin: '10px auto',
                            padding: '7px',
                            borderRadius: '7px',
                            width: '80%',
                        }}
                    >
                        <p>
                            Уведомляем вас о том, что текущая
                            аудио/видео/чатовая конференция проходит{' '}
                            <strong>без фиксации и записи данных</strong>.
                        </p>
                        <p>
                            Любые материалы передаются или уточняются
                            исключительно по вашему личному желанию (в том числе
                            для точного ответа по вашему основному вопросу)
                        </p>
                        <p>Они не являются обязательными к предоставлению.</p>
                        <p>Они не записываются и не архивируются на сервере.</p>
                        <p>
                            После консультации вам придет сообщение с краткой
                            дополнительной информацией.
                        </p>
                    </div>
                )}
            </div>
        )
    }
    return hasAuthCookie ? (
        <button
            style={{
                textAlign: 'center',
                backgroundColor: 'white',
                margin: '10px auto',
                padding: '7px',
                borderRadius: '7px',
            }}
            onClick={() => {
                handleAdmin()
            }}
        >
            войти
        </button>
    ) : (
        <div
            className="container"
            style={{
                maxWidth: '400px',
                margin: '15vh auto',
                textAlign: 'center',
            }}
        >
            <h1>Вход на консультацию</h1>
            <p>
                Здравствуйте, <strong>{fio}</strong>!
            </p>
            <p>
                Введите данные из сообщения на электронной почте, полученные при
                бронировании, чтобы войти в комнату.
            </p>

            <form
                onSubmit={handleConfirm}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    marginTop: '20px',
                }}
            >
                {/* Поле для E-mail */}
                <input
                    type="email"
                    placeholder="Ваш E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                        padding: '12px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                    }}
                />

                {/* Поле для кода подтверждения (пароля) */}
                <input
                    type="text"
                    placeholder="Код доступа"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                        padding: '12px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                    }}
                />

                <button
                    type="submit"
                    disabled={loading || !email || !password} // Блокируем, если поля пустые
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        cursor:
                            loading || !email || !password
                                ? 'not-allowed'
                                : 'pointer',
                        borderRadius: '8px',
                        marginTop: '10px',
                        backgroundColor:
                            loading || !email || !password ? '#ccc' : '#0070f3',
                        color: '#fff',
                        border: 'none',
                    }}
                >
                    {loading ? 'Проверка...' : 'Войти в видеозвонок'}
                </button>
            </form>
        </div>
    )
}
