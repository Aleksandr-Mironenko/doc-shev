'use client'

import styles from './SendMessageButton.module.scss'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

export default function SendMessageButton() {
    const [dateConsent_pd, setDateConsent_pd] = useState<false | string>(false)

    const [dateConsent_promo, setDateConsent_promo] = useState<false | string>(
        false,
    )

    const [isMounted, setIsMounted] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalStep, setModalStep] = useState(1) // 1 - ввод данных, 2 - ввод кода
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [consent_promo, setConsent_promo] = useState<boolean>(false)
    const [consent_pd, setConsent_pd] = useState<boolean>(false)
    // Состояние формы
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '', // Добавлено поле для самого сообщения
        code: '',
        phone: '',
    })

    // Закрытие модального окна и сброс данных
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setModalStep(1)
        setFormData({ name: '', email: '', message: '', code: '', phone: '' })
    }
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        // ОШИБКА: modalStep изначально равен 0, поэтому класс 'modal-open' вешается сразу при загрузке страницы
        document.body.classList.toggle('modal-open', isModalOpen) //

        return () => {
            document.body.classList.remove('modal-open') //[cite: 1]
        }
    }, [isModalOpen])

    // Шаг 1: Отправка данных и запрос кода на email клиента
    const handleFormSubmit = async () => {
        if (
            !formData.name ||
            !formData.email ||
            !formData.message ||
            !formData.phone
        ) {
            alert('Пожалуйста, заполните все поля')
            return
        }

        setIsActionLoading(true)
        try {
            const response = await fetch('/api/send-code-message', {
                // Укажите правильный путь к вашему первому роуту
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fio: formData.name, // передаем name как fio
                    phone: formData.phone,
                    email: formData.email,

                    dateConsent_pd: dateConsent_pd,
                    dateConsent_promo: dateConsent_promo,
                    check: false,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Ошибка при отправке кода')
            }

            setModalStep(2) // Переходим к вводу кода
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Произошла ошибка при отправке кода'
            console.error('Ошибка отправки кода', error)
            alert(errorMessage)
        } finally {
            setIsActionLoading(false)
        }
    }

    // Шаг 2: Проверка кода и отправка сообщения админу
    const handleCodeSubmit = async () => {
        if (!formData.code) {
            alert('Введите код подтверждения')
            return
        }

        setIsActionLoading(true)
        try {
            const response = await fetch('/api/verify-code-message', {
                // Укажите правильный путь ко второму роуту
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fio: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    code: formData.code,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Неверный код')
            }

            alert('Ваше сообщение успешно отправлено!')
            handleCloseModal() // Закрываем окно после успеха
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

    return (
        <>
            <div className={`${styles.buttonsHero} ${styles.first} `}>
                <button
                    onClick={() => setIsModalOpen(true)} // Открываем модальное окно
                    className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.buttonsHero__info_second}`}
                >
                    <p>Написать сообщение здесь</p>
                </button>
            </div>

            {/* Модальное окно */}

            {isModalOpen &&
                isMounted &&
                createPortal(
                    <div
                        style={{
                            color: '#333030',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 100011,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                color: '#333030',
                                background: 'white',
                                padding: '30px',
                                borderRadius: '16px',
                                width: '100%',
                                maxWidth: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }}
                        >
                            {/* ШАГ 1: Ввод ФИО, Почты и Сообщения */}
                            {modalStep === 1 && (
                                <>
                                    <h3
                                        style={{
                                            color: '#333030',
                                            margin: 0,
                                            fontSize: 20,
                                            textAlign: 'center',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Написать сообщение
                                    </h3>

                                    <input
                                        placeholder="ФИО"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        style={{
                                            color: '#333030',
                                            padding: '12px 16px',
                                            borderRadius: 12,
                                            border: '1px solid #ddd',
                                            fontSize: 16,
                                        }}
                                    />
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
                                            padding: '12px 16px',
                                            borderRadius: 12,
                                            border: '1px solid #ddd',
                                            fontSize: 16,
                                        }}
                                    />

                                    <input
                                        placeholder="Телефон"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        style={{
                                            color: '#333030',
                                            padding: '12px 16px',
                                            borderRadius: 12,
                                            border: '1px solid #ddd',
                                            fontSize: 16,
                                        }}
                                    />
                                    <textarea
                                        placeholder="Текст сообщения..."
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                message: e.target.value,
                                            })
                                        }
                                        style={{
                                            color: '#333030',
                                            padding: '12px 16px',
                                            borderRadius: 12,
                                            border: '1px solid #ddd',
                                            fontSize: 16,
                                            resize: 'none',
                                        }}
                                    />

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 12,
                                            marginTop: 4,
                                        }}
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 10,
                                                cursor: 'pointer',
                                                fontSize: 13,
                                                lineHeight: 1.4,
                                                color: '#555',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={consent_promo}
                                                // onChange={(e) => {
                                                //     handleConsentClick(
                                                //         setDateConsent_promo,
                                                //         consent_promo,
                                                //     )
                                                //     setConsent_promo(
                                                //         e.target
                                                //             .checked,
                                                //     )
                                                // }}

                                                // onChange={(e) => {
                                                //     const isChecked =
                                                //         e.target
                                                //             .checked
                                                //     setConsent_promo(
                                                //         isChecked,
                                                //     )

                                                //     if (isChecked) {
                                                //         const date =
                                                //             new Date()
                                                //         date.setUTCHours(
                                                //             date.getUTCHours() +
                                                //                 3,
                                                //         )
                                                //         setDateConsent_promo(
                                                //             date
                                                //                 .toISOString()
                                                //                 .replace(
                                                //                     'Z',
                                                //                     '+03:00',
                                                //                 ),
                                                //         )
                                                //     } else {
                                                //         setDateConsent_promo(
                                                //             false,
                                                //         )
                                                //     }
                                                // }}
                                                onChange={(e) => {
                                                    const isChecked =
                                                        e.target.checked

                                                    setConsent_promo(isChecked)

                                                    if (isChecked) {
                                                        // toISOString() автоматически выдает строку в UTC
                                                        // Пример: "2026-09-03T20:21:56.123Z"
                                                        setDateConsent_promo(
                                                            new Date().toISOString(),
                                                        )
                                                    } else {
                                                        setDateConsent_promo(
                                                            false,
                                                        ) // (или null, если позволяет типизация)
                                                    }
                                                }}
                                                style={{
                                                    color: '#333030',
                                                    width: 18,
                                                    height: 18,
                                                    marginTop: 1,
                                                    flexShrink: 0,
                                                    cursor: 'pointer',
                                                }}
                                            />

                                            <span>
                                                {`Согласен(на) на `}
                                                <a
                                                    style={{
                                                        textDecoration:
                                                            'underline',
                                                        color: 'black',
                                                        fontWeight: 700,
                                                    }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href="/advertising-consent"
                                                >
                                                    <b>
                                                        получение информационных
                                                        рассылок
                                                    </b>
                                                </a>
                                            </span>
                                        </label>

                                        <label
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 10,
                                                cursor: 'pointer',
                                                fontSize: 13,
                                                lineHeight: 1.4,
                                                color: '#555',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={consent_pd}
                                                // onChange={(e) => {
                                                //     handleConsentClick(
                                                //         setDateConsent_pd,
                                                //         consent_pd,
                                                //     )
                                                //     setConsent_pd(
                                                //         e.target
                                                //             .checked,
                                                //     )
                                                // }}

                                                // onChange={(e) => {
                                                //     const isChecked =
                                                //         e.target
                                                //             .checked
                                                //     setConsent_pd(
                                                //         isChecked,
                                                //     )

                                                //     if (isChecked) {
                                                //         const date =
                                                //             new Date()
                                                //         date.setUTCHours(
                                                //             date.getUTCHours() +
                                                //                 3,
                                                //         )
                                                //         setDateConsent_pd(
                                                //             date
                                                //                 .toISOString()
                                                //                 .replace(
                                                //                     'Z',
                                                //                     '+03:00',
                                                //                 ),
                                                //         )
                                                //     } else {
                                                //         setDateConsent_pd(
                                                //             false,
                                                //         )
                                                //     }
                                                // }}
                                                onChange={(e) => {
                                                    const isChecked =
                                                        e.target.checked

                                                    setConsent_pd(isChecked)

                                                    if (isChecked) {
                                                        setDateConsent_pd(
                                                            new Date().toISOString(),
                                                        )
                                                    } else {
                                                        setDateConsent_pd(false)
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
                                                        textDecoration:
                                                            'underline',
                                                        color: 'black',
                                                        fontWeight: 700,
                                                    }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href="/policy"
                                                >
                                                    <b>
                                                        обработку персональных
                                                        данных
                                                    </b>
                                                </a>
                                            </span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleFormSubmit}
                                        disabled={
                                            !formData.name.trim() ||
                                            !formData.email.trim() ||
                                            !formData.phone.trim() ||
                                            !formData.message.trim() ||
                                            !consent_pd ||
                                            isActionLoading
                                        }
                                        style={{
                                            padding: '14px',
                                            borderRadius: 12,
                                            backgroundColor:
                                                !formData.name.trim() ||
                                                !formData.email.trim() ||
                                                !formData.phone.trim() ||
                                                !formData.message.trim() ||
                                                !consent_pd ||
                                                isActionLoading
                                                    ? '#999'
                                                    : '#59B86A',
                                            color:
                                                !formData.name.trim() ||
                                                !formData.email.trim() ||
                                                !formData.phone.trim() ||
                                                !formData.message.trim() ||
                                                !consent_pd ||
                                                isActionLoading
                                                    ? 'black'
                                                    : '#fff',
                                            cursor:
                                                !formData.name.trim() ||
                                                !formData.email.trim() ||
                                                !formData.phone.trim() ||
                                                !formData.message.trim() ||
                                                !consent_pd ||
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
                                            ? 'Отправка...'
                                            : 'Отправить'}
                                    </button>
                                    <button
                                        onClick={() => handleCloseModal()}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#333',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Отмена
                                    </button>
                                </>
                            )}

                            {/* ШАГ 2: Подтверждение кода */}
                            {modalStep === 2 && (
                                <>
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
                                            margin: 0,
                                            textAlign: 'center',
                                            opacity: 0.6,
                                            fontSize: 14,
                                        }}
                                    >
                                        Мы отправили код подтверждения на{' '}
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
                                            color: '#333030',
                                            padding: '12px 16px',
                                            borderRadius: 12,
                                            border: '1px solid #ddd',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            letterSpacing: 2,
                                        }}
                                    />

                                    {/* <button
                                        onClick={handleCodeSubmit}
                                        disabled={isActionLoading}
                                        style={{
                                            padding: '14px',
                                            borderRadius: 12,
                                            backgroundColor: '#59B86A',
                                            color: '#fff',
                                            border: 'none',
                                            fontSize: 16,
                                            fontWeight: 600,
                                            cursor: isActionLoading
                                                ? 'wait'
                                                : 'pointer',
                                            marginTop: 10,
                                        }}
                                    >
                                        {isActionLoading
                                            ? 'Проверка...'
                                            : 'Отправить сообщение'}
                                    </button> */}
                                    {/* <button
                                        onClick={() => setModalStep(1)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#333',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Вернуться назад
                                    </button> */}

                                    <button
                                        onClick={handleCodeSubmit}
                                        disabled={!formData.code.trim()}
                                        style={{
                                            padding: '14px',
                                            borderRadius: 12,
                                            backgroundColor:
                                                !formData.code.trim()
                                                    ? '#999'
                                                    : '#59B86A',
                                            color: !formData.code.trim()
                                                ? 'black'
                                                : '#fff',
                                            cursor: !formData.code.trim()
                                                ? 'wait'
                                                : 'pointer',
                                            border: 'none',
                                            fontSize: 16,
                                            fontWeight: 600,

                                            marginTop: 10,
                                        }}
                                    >
                                        {isActionLoading
                                            ? 'Отправка...'
                                            : 'Записаться'}
                                    </button>
                                    <button
                                        onClick={() => handleCloseModal()}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#333',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Отмена
                                    </button>
                                </>
                            )}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    )
}
