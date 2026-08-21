// import styles from './orderButton.module.scss'
// import Image from 'next/image'
// import calend from '../../../public/ggg/cal.png'
// import Link from 'next/link'

// interface OrderButtonProps {
//     linka?: string
//     text?: string
// }

// export default function OrderButton({
//     linka = '#',
//     text = 'Подробнее обо мне',
// }: OrderButtonProps) {
//     return (
//         <div className={`${styles.buttonsHero} ${styles.first} `}>
//             <Link
//                 href="/timetable"
//                 className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.blue}`}
//             >
//                 <span>Записаться на консультацияю</span>

//                 <Image
//                     className={styles.buttonsHero__calendarLogo}
//                     src={calend}
//                     alt="календарь"
//                     width={30}
//                     height={30}
//                     priority
//                     style={{ width: 'auto', height: 'auto' }}
//                 />
//             </Link>
//             <button
//                 className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.buttonsHero__info_second}`} // onClick={() => {}}
//             >
//                 <p>{text}</p>
//             </button>
//         </div>
//     )
// }
'use client' // Обязательно для Next.js (App Router), так как используем useState

import { useState } from 'react'
import styles from './orderButton.module.scss'
import Image from 'next/image'
import calend from '../../../public/ggg/cal.png'
import Link from 'next/link'

interface OrderButtonProps {
    linka?: string
    text?: string
}

export default function OrderButton({
    text = 'Написать сообщение', // Изменил текст по умолчанию для наглядности
}: OrderButtonProps) {
    // Состояния для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalStep, setModalStep] = useState(1) // 1 - ввод данных, 2 - ввод кода
    const [isActionLoading, setIsActionLoading] = useState(false)

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
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Ошибка при отправке кода')
            }

            setModalStep(2) // Переходим к вводу кода
        } catch (error: any) {
            console.error('Ошибка отправки кода', error)
            alert(error.message || 'Произошла ошибка при отправке кода')
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
        } catch (error: any) {
            console.error('Неверный код или ошибка сервера', error)
            alert(error.message || 'Неверный код подтверждения')
        } finally {
            setIsActionLoading(false)
        }
    }

    return (
        <>
            <div className={`${styles.buttonsHero} ${styles.first} `}>
                <Link
                    href="/timetable"
                    className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.blue}`}
                >
                    <span>Записаться на консультацию</span>
                    <Image
                        className={styles.buttonsHero__calendarLogo}
                        src={calend}
                        alt="календарь"
                        width={30}
                        height={30}
                        priority
                        style={{ width: 'auto', height: 'auto' }}
                    />
                </Link>
                {text === 'Написать сообщение' && (
                    <button
                        onClick={() => setIsModalOpen(true)} // Открываем модальное окно
                        className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.buttonsHero__info_second}`}
                    >
                        <p>{text}</p>
                    </button>
                )}
                {text === 'Обо мне' && (
                    <Link
                        href="/timetable" //поменять на страницу обо мне
                        className={`${styles.buttonsHero__button} ${styles.buttonsHero__info} ${styles.buttonsHero__info_second}`}
                    >
                        <p>{text}</p>
                    </Link>
                )}
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
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
                                        padding: '12px 16px',
                                        borderRadius: 12,
                                        border: '1px solid #ddd',
                                        fontSize: 16,
                                        resize: 'none',
                                    }}
                                />

                                <button
                                    onClick={handleFormSubmit}
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
                                        ? 'Отправка...'
                                        : 'Продолжить'}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#999',
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
                                </button>
                                <button
                                    onClick={() => setModalStep(1)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#999',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Вернуться назад
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
