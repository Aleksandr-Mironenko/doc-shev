'use client'

import { useState, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ru'

import styles from './appointment.module.scss'
import App from '../calendar/calendar'

dayjs.locale('ru')

// --- ИМИТАЦИЯ API ЗАПРОСОВ ---
const fetchAvailableTimes = async (date: Dayjs): Promise<string[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(['09:00', '10:30', '12:00', '14:30', '16:00', '18:15'])
        }, 1000)
    })
}

const checkTimeAvailability = async (
    date: Dayjs,
    time: string,
): Promise<{ free: boolean }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isFree = Math.random() > 0.1
            resolve({ free: isFree })
        }, 800)
    })
}

const sendVerificationEmail = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000)
    })
}

const verifyCodeAndProcessPayment = async (code: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(code.length > 3)
        }, 1500)
    })
}

export default function Appointment() {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
    const [isSelected, setIsSelected] = useState(false)
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [isTimesLoading, setIsTimesLoading] = useState(false)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    const [modalStep, setModalStep] = useState<number>(0)
    const [isActionLoading, setIsActionLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        code: '',
    })

    const dates = [dayjs().date(3), dayjs().date(7), dayjs().date(15)]

    useEffect(() => {
        if (isSelected && selectedDate) {
            setIsTimesLoading(true)
            setSelectedTime(null)

            fetchAvailableTimes(selectedDate)
                .then((times) => {
                    setAvailableTimes(times)
                    setIsTimesLoading(false)
                })
                .catch((err) => {
                    console.error('Ошибка при получении времени:', err)
                    setIsTimesLoading(false)
                })
        }
    }, [selectedDate, isSelected])

    const handleTimeClick = (time: string) => {
        setSelectedTime(time)
        setModalStep(1)
    }

    const handleConfirmTime = async () => {
        if (!selectedDate || !selectedTime) return

        setIsActionLoading(true)
        const { free } = await checkTimeAvailability(selectedDate, selectedTime)
        setIsActionLoading(false)

        if (free) {
            setModalStep(2)
        } else {
            setModalStep(5)
        }
    }

    const handleFormSubmit = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert('Пожалуйста, заполните все поля')
            return
        }

        setIsActionLoading(true)
        await sendVerificationEmail(formData.email)
        setIsActionLoading(false)

        setModalStep(3)
    }

    const handleCodeSubmit = async () => {
        if (!formData.code) return

        setIsActionLoading(true)
        const isSuccess = await verifyCodeAndProcessPayment(formData.code)

        if (isSuccess) {
            setModalStep(4)
        } else {
            alert('Неверный код подтверждения')
        }
        setIsActionLoading(false)
    }

    // Полный сброс (при успешном завершении)
    const resetAppointmentState = () => {
        setSelectedDate(null)
        setIsSelected(false)
        setSelectedTime(null)
        setAvailableTimes([])
        setFormData({ name: '', email: '', phone: '', code: '' })
    }

    // Только закрытие модалки с сохранением даты (для "Выберу другое время")
    const handleCloseModalKeepDate = () => {
        setModalStep(0)
        setSelectedTime(null)
        setFormData({ name: '', email: '', phone: '', code: '' })
    }

    // Успешное завершение с редиректом на отзывы                                                       проодумать и поменять
    const handleFinishAndRedirect = () => {
        setModalStep(0)
        resetAppointmentState()
        window.location.href = '/#reviews'
    }
    const userSelectedDate = (value: Dayjs | null) => {
        setSelectedDate(value)
        setTimeout(() => {
            if (document.getElementById('timepodskazka')) {
                document.getElementById('timepodskazka')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            } else {
                document.getElementById('time')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            }
        }, 0)
    }

    return (
        <div
            className={styles.wrapper}
            style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end', // Гарантируем прижатие всех элементов вправо
                gap: '24px',
                flexWrap: 'wrap',
                position: 'relative',
            }}
        >
            {/* НОВЫЕ БЛОКИ: Рендерятся ПЕРЕД календарем, чтобы появляться левее */}
            {isSelected && selectedDate && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap-reverse', // Магия переноса: при сужении экрана правый блок уходит наверх
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        gap: '16px',
                        flex: '1 1 auto', // Блок занимает всё доступное свободное место
                    }}
                >
                    {/* 1. БЛОК ВЫБОРА ВРЕМЕНИ (Слева в строке, снизу в столбике) */}
                    <div
                        id="time"
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            padding: '24px',
                            minWidth: '280px',
                            flex: '1 1 280px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                fontSize: 18,
                                fontWeight: 600,
                                textAlign: 'center',
                            }}
                        >
                            Доступное время на {selectedDate.format('D MMMM')}
                        </h3>

                        {isTimesLoading ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    opacity: 0.5,
                                    padding: '20px 0',
                                }}
                            >
                                Поиск времени...
                            </div>
                        ) : availableTimes.length > 0 ? (
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}
                            >
                                {availableTimes.map((time) => {
                                    const isTimeSelected = selectedTime === time
                                    const color = '#59B86A'
                                    return (
                                        <li
                                            key={time}
                                            onClick={() =>
                                                handleTimeClick(time)
                                            }
                                            style={{
                                                padding: '12px 16px',
                                                borderRadius: 20,
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                fontWeight: 600,
                                                fontSize: 16,
                                                background: isTimeSelected
                                                    ? `radial-gradient(circle at center, ${color}35 0%, ${color}35 25%, ${color}30 60%, ${color}20 80%, ${color}05 100%)`
                                                    : '#F5F5F5',
                                                boxShadow: isTimeSelected
                                                    ? `0 0 0 2px ${color}`
                                                    : 'none',
                                                transition: 'all 250ms ease',
                                                color: isTimeSelected
                                                    ? '#000'
                                                    : '#333',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isTimeSelected)
                                                    e.currentTarget.style.boxShadow = `0 0 0 1px ${color}80`
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isTimeSelected)
                                                    e.currentTarget.style.boxShadow =
                                                        'none'
                                            }}
                                        >
                                            {time}
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <div
                                style={{
                                    textAlign: 'center',
                                    opacity: 0.5,
                                    padding: '20px 0',
                                }}
                            >
                                Нет доступного времени
                            </div>
                        )}
                    </div>

                    {/* 2. БЛОК ПОДСКАЗКИ (Справа в строке, сверху в столбике) */}

                    <div id="timepodskazka" className={styles.podskazka}>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: 18,
                                fontWeight: 600,
                                textAlign: 'center',
                            }}
                        >
                            <div className={styles.heroSection__regal}>
                                <div className={styles.heroSection__name}>
                                    <p className={styles.heroSection__docprof}>
                                        Самое время выбрать время записи
                                    </p>
                                </div>
                                <p className={styles.heroSection__backstage}>
                                    Клик на самое подходящее
                                </p>
                            </div>
                        </h3>
                    </div>
                    {/* )} */}
                </div>
            )}

            {/* КАЛЕНДАРЬ: Рендерится последним, поэтому всегда "прибит" к правому краю */}
            <div style={{ flex: '0 0 auto' }}>
                <App
                    dates={dates}
                    selectedDate={selectedDate}
                    isSelected={isSelected}
                    userSelectedDate={userSelectedDate}
                    setIsSelected={setIsSelected}
                />
            </div>

            {modalStep > 0 && (
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
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 24,
                            padding: '32px',
                            width: '90%',
                            maxWidth: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        }}
                    >
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
                                    Именно это время выберем для записи:{' '}
                                    {selectedDate?.format('DD.MM.YYYY')},{' '}
                                    {selectedTime}?
                                </h3>
                                <button
                                    onClick={handleConfirmTime}
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
                                    }}
                                >
                                    {isActionLoading
                                        ? 'Проверка...'
                                        : 'Да, мне удобно'}
                                </button>
                                <button
                                    onClick={handleCloseModalKeepDate}
                                    style={{
                                        padding: '14px',
                                        borderRadius: 12,
                                        backgroundColor: '#F5F5F5',
                                        color: '#333',
                                        border: 'none',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Выберу другое время
                                </button>
                            </>
                        )}

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
                                    Оформление записи
                                </h3>
                                <p
                                    style={{
                                        margin: 0,
                                        textAlign: 'center',
                                        opacity: 0.6,
                                        fontSize: 14,
                                    }}
                                >
                                    Время забронировано за вами на 15 минут.
                                </p>

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
                                        : 'Записаться'}
                                </button>
                                <button
                                    onClick={handleCloseModalKeepDate}
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

                        {modalStep === 3 && (
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
                                    Мы отправили пароль на {formData.email}
                                </p>

                                <input
                                    placeholder="Введите пароль из письма"
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
                                        : 'Подтвердить почту'}
                                </button>
                                <button
                                    onClick={() => setModalStep(2)}
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

                        {modalStep === 4 && (
                            <>
                                <div
                                    style={{
                                        fontSize: 40,
                                        textAlign: 'center',
                                    }}
                                >
                                    🎉
                                </div>
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: 20,
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: '#59B86A',
                                    }}
                                >
                                    Запись успешно сформирована!
                                </h3>
                                <p
                                    style={{
                                        margin: 0,
                                        textAlign: 'center',
                                        opacity: 0.8,
                                        fontSize: 15,
                                    }}
                                >
                                    Мы ждем вас{' '}
                                    {selectedDate?.format('DD.MM.YYYY')} в{' '}
                                    {selectedTime}.<br />
                                    Подробности и ссылка на MTS Link отправлены
                                    на вашу почту.
                                </p>
                                <button
                                    onClick={handleFinishAndRedirect}
                                    style={{
                                        padding: '14px',
                                        borderRadius: 12,
                                        backgroundColor: '#59B86A',
                                        color: '#fff',
                                        border: 'none',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        marginTop: 10,
                                    }}
                                >
                                    Посмотреть отзывы и вернуться
                                </button>
                            </>
                        )}

                        {modalStep === 5 && (
                            <>
                                <div
                                    style={{
                                        fontSize: 40,
                                        textAlign: 'center',
                                    }}
                                >
                                    😞
                                </div>
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: 20,
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: '#E05A5A',
                                    }}
                                >
                                    Время уже занято
                                </h3>
                                <p
                                    style={{
                                        margin: 0,
                                        textAlign: 'center',
                                        opacity: 0.8,
                                        fontSize: 15,
                                    }}
                                >
                                    Кто-то только что записался на это время.
                                    Выберите другое, пожалуйста.
                                </p>
                                <button
                                    onClick={handleCloseModalKeepDate}
                                    style={{
                                        padding: '14px',
                                        borderRadius: 12,
                                        backgroundColor: '#E05A5A',
                                        color: '#fff',
                                        border: 'none',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        marginTop: 10,
                                    }}
                                >
                                    Понятно
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
