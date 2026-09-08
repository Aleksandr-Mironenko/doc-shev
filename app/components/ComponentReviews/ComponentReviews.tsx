'use client'
import styles from './ComponentReviews.module.scss'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import image from '@/public/ggg/kavv2.png'
import { createPortal } from 'react-dom'

export interface Review {
    id: number
    external_link: string
    text: string
    active: boolean
    created_at: Date | string
}

export interface Pub {
    id: number
    name: string
    age: number
    data: string
}

export default function ComponentReviews({
    reviewsData,
}: {
    reviewsData: Review[]
}) {
    const [reviewsDataState, setReviewsDataState] = useState<Review[]>([])

    const [formData, setFormData] = useState({
        text: '',
        email: '',
        code: '',
    })
    const [isError, setIsError] = useState(false)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [modalCheck, setModalCheck] = useState(false)
    const [consent_rewiews, setConsent_rewiews] = useState<boolean>(false)
    const [consent_data_rewiews, setConsent_data_rewiews] = useState<
        false | string
    >(false)

    useEffect(() => {
        setReviewsDataState(reviewsData)
    }, [reviewsData])

    const handleCloseModal = () => {
        setModalCheck(false)
        setIsError(false)
        setFormData({ text: '', email: '', code: '' })
    }

    const handleCloseModalClick = () => {
        setModalCheck(false)
        setIsError(false)
        setFormData((prev) => ({ ...prev, email: '', code: '' }))
    }

    const handleFormSubmit = async () => {
        if (
            !formData.text.trim() ||
            !formData.email.trim() ||
            !consent_rewiews
        ) {
            alert('Пожалуйста, заполните все поля')
            return
        }

        setIsActionLoading(true)
        try {
            const response = await fetch('/api/send-code-rewievs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: formData.text,
                    email: formData.email,
                    consent_rewiews: consent_rewiews,
                    dateConsent_rewiews: consent_data_rewiews,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Ошибка при отправке кода')
            }

            setModalCheck(true) // Переходим к вводу кода
        } catch {
            // (error: unknown)
            // const errorMessage =
            //     error instanceof Error
            //         ? error.message
            //         : 'Произошла ошибка при отправке кода'
            // console.error('Ошибка отправки кода', error)
            setIsError(true)
            setModalCheck(true) // ВАЖНО: Открываем модалку для показа ошибки!
            // console.error(error)
            // alert(errorMessage)
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleCodeSubmit = async () => {
        if (!formData.code.trim()) {
            alert('Введите код подтверждения')
            return
        }

        setIsActionLoading(true)
        try {
            const response = await fetch('/api/verify-code-rewievs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: formData.text,
                    email: formData.email,
                    code: formData.code,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Неверный код')
            }

            alert('Ваше сообщение успешно отправлено!')
            handleCloseModal() // Закрываем окно и чистим форму
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Неверный код подтверждения'
            console.error('Неверный код или ошибка сервера', error)
            alert(errorMessage)
        } finally {
            setIsActionLoading(false)
        }
    }

    const content = reviewsDataState.map((el: Review) => {
        if (!el.active) return null

        return (
            <li key={el.id} className={styles.rewiew}>
                <div className={styles.rewiew__deccorimage}>
                    <Image
                        className={styles.rewiew__deccorimage_image}
                        src={image}
                        alt=""
                        priority
                        width={30}
                        height={20}
                        style={{
                            width: '20px',
                            height: '10px',
                            position: 'relative',
                            top: '-5px',
                        }}
                    />
                </div>
                <div className={styles.rewiew__text}>
                    <p className={styles.rewiew__text_p}>{el.text}</p>
                </div>
                <div className={styles.rewiew__deccorimage}>
                    <Image
                        className={styles.rewiew__deccorimage_image}
                        src={image}
                        alt=""
                        priority
                        width={30}
                        height={20}
                        style={{
                            width: '20px',
                            height: '10px',
                            position: 'relative',
                            top: '-5px',
                        }}
                    />
                </div>
            </li>
        )
    })

    return (
        <div className={styles.rewiewsW}>
            <h2 className={styles.rewiews__h2}>Отзывы клиентов</h2>
            <ul>{content}</ul>
            <div style={{ width: '90%' }}>
                <h3 className={styles.rewiews__h3}>
                    Напишите и вы отзыв обо мне
                </h3>

                <textarea
                    rows={5}
                    style={{
                        padding: '10px',
                        width: '100%',
                        borderRadius: '10px',

                        border: '2px solid rgba(41, 62, 97, 0.9)',
                    }}
                    placeholder="Не надо стесняться"
                    value={formData.text}
                    onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                    }
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: 'flex-start',
                    marginLeft: '5%',
                }}
            >
                <input
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            email: e.target.value,
                        })
                    }
                    style={{
                        color: '#333030',

                        fontSize: 16,
                        marginTop: '10px',
                        padding: '10px',
                        width: '100%',
                        borderRadius: '10px',
                        border: '2px solid rgba(41, 62, 97, 0.9)',
                    }}
                />
                <div>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            cursor: 'pointer',
                            fontSize: 13,
                            lineHeight: 1.4,
                            color: '#555',
                            marginTop: '10px',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={consent_rewiews}
                            onChange={(e) => {
                                const isChecked = e.target.checked
                                setConsent_rewiews(isChecked)
                                if (isChecked) {
                                    setConsent_data_rewiews(
                                        new Date().toISOString(),
                                    )
                                } else {
                                    setConsent_data_rewiews(false)
                                }
                            }}
                            style={{
                                width: 18,
                                height: 18,
                                marginTop: 1,
                                flexShrink: 0,
                                color: '#333030',
                                cursor: 'pointer',
                            }}
                        />
                        <span>
                            {`Согласен(на) на `}
                            <a
                                style={{
                                    textDecoration: 'underline',
                                    color: 'black',
                                    fontWeight: 700,
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                href="/review-consent"
                            >
                                использование отзыва
                            </a>
                        </span>
                    </label>
                </div>
            </div>
            <button
                onClick={handleFormSubmit}
                disabled={
                    !formData.email.trim() ||
                    !formData.text.trim() ||
                    !consent_rewiews ||
                    isActionLoading
                }
                style={{
                    marginLeft: '5%',
                    alignSelf: 'flex-start',
                    padding: '14px',
                    borderRadius: 12,
                    backgroundColor:
                        !formData.email.trim() ||
                        !formData.text.trim() ||
                        !consent_rewiews ||
                        isActionLoading
                            ? '#999'
                            : '#59B86A',
                    color:
                        !formData.text.trim() ||
                        !consent_rewiews ||
                        isActionLoading
                            ? 'black'
                            : '#fff',
                    cursor:
                        !formData.text.trim() ||
                        !consent_rewiews ||
                        isActionLoading
                            ? 'wait'
                            : 'pointer',
                    border: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    marginTop: 10,
                }}
            >
                {isActionLoading ? 'Отправка...' : 'Отправить'}
            </button>

            {modalCheck &&
                createPortal(
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 9999,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {isError ? (
                            // --- ОКНО ОШИБКИ ---
                            <div
                                style={{
                                    padding: '30px',
                                    borderRadius: '20px',
                                    backgroundColor: 'white',
                                    width: '90%',
                                    maxWidth: '400px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '15px',
                                }}
                            >
                                <h3
                                    style={{
                                        color: '#d9534f', // Красный цвет для ошибки
                                        margin: 0,
                                        fontSize: 20,
                                        textAlign: 'center',
                                        fontWeight: 600,
                                    }}
                                >
                                    Я честна перед собой и всеми
                                </h3>
                                <p
                                    style={{
                                        color: '#333',

                                        fontSize: 15,
                                        margin: 0,
                                    }}
                                >
                                    <p style={{ fontSize: '18px' }}>
                                        <b>
                                            По указанной почте не было проведено
                                            консультаций.
                                        </b>
                                    </p>
                                    <p>
                                        Возможно вы записывались ранее указав
                                        другую почту.
                                    </p>
                                    <p>
                                        В этом случае укажите почту которую уже
                                        указывали пожалуйста
                                    </p>
                                </p>
                                <button
                                    onClick={handleCloseModalClick}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 12,
                                        backgroundColor: '#d9534f',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        marginTop: 10,
                                    }}
                                >
                                    Закрыть
                                </button>
                            </div>
                        ) : (
                            // --- ОКНО УСПЕШНОГО ВВОДА КОДА ---
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.5)', // Возвращаем фон прямо сюда!
                                    zIndex: 9999,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '30px',
                                        borderRadius: '20px',
                                        marginTop: '20px',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <h3
                                        style={{
                                            color: '#333030',
                                            margin: 0,
                                            fontSize: 20,
                                            textAlign: 'center',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Подтверждение почты
                                    </h3>
                                    <p
                                        style={{
                                            color: '#333030',
                                            margin: '10px 0',
                                            textAlign: 'center',
                                            opacity: 0.6,
                                            fontSize: 14,
                                        }}
                                    >
                                        Мы отправили код подтверждения на
                                        <b>{formData.email}</b>
                                    </p>

                                    <input
                                        placeholder="Введите код из письма"
                                        value={formData.code}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                code: e.target.value,
                                            })
                                        }
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            color: '#333030',
                                            padding: '12px 16px',
                                            borderRadius: 12,
                                            border: '1px solid #ddd',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            letterSpacing: 2,
                                        }}
                                    />

                                    <button
                                        onClick={handleCodeSubmit}
                                        disabled={
                                            !formData.code.trim() ||
                                            isActionLoading
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: 12,
                                            backgroundColor:
                                                !formData.code.trim() ||
                                                isActionLoading
                                                    ? '#999'
                                                    : '#59B86A',
                                            color:
                                                !formData.code.trim() ||
                                                isActionLoading
                                                    ? 'black'
                                                    : '#fff',
                                            cursor:
                                                !formData.code.trim() ||
                                                isActionLoading
                                                    ? 'wait'
                                                    : 'pointer',
                                            border: 'none',
                                            fontSize: 16,
                                            fontWeight: 600,
                                            marginTop: 10,
                                        }}
                                    >
                                        {isActionLoading
                                            ? 'Проверка...'
                                            : 'Подтвердить код'}
                                    </button>
                                    <button
                                        onClick={handleCloseModalClick}
                                        style={{
                                            width: '100%',
                                            marginTop: 10,
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#333',
                                            cursor: 'pointer',
                                            fontSize: 14,
                                        }}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>,
                    document.body,
                )}
        </div>
    )
}
