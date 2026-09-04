'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ru'

import styles from './appointment.module.scss'
import App from '../calendar/calendar'

dayjs.locale('ru')

// --- ИМИТАЦИЯ API ЗАПРОСОВ ---
// const fetchAvailableTimes = async (date: Dayjs): Promise<string[]> => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(['09:00', '10:30', '12:00', '14:30', '16:00', '18:15'])
//         }, 1000)
//     })
// }

// const checkTimeAvailability = async (
//     date: Dayjs,
//     time: string,
// ): Promise<{ free: boolean }> => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             const isFree = Math.random() > 0.1
//             resolve({ free: isFree })
//         }, 800)
//     })
// }

// const sendVerificationEmail = async (email: string): Promise<boolean> => {
//     return new Promise((resolve) => {
//         setTimeout(() => resolve(true), 1000)
//     })
// }

// const verifyCodeAndProcessPayment = async (code: string): Promise<boolean> => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(code.length > 3)
//         }, 1500)
//     })
// }

export interface Services {
    id: number
    title: string
    description_1?: string | null
    description_1_name?: string | null
    description_2?: string | null
    description_2_name?: string | null
    description_3?: string | null
    description_3_name?: string | null
    description_4?: string | null
    description_4_name?: string | null
    description_5?: string | null
    description_5_name?: string | null
    link:
        | 'consult-video-follow-up'
        | 'consult-video'
        | 'consult-doctor'
        | 'сonsult-audio-follow-up'
        | 'consult-audio'
    is_check: boolean
    is_active?: boolean | null
    price: number
    image?: string | null
    created_at: Date | string
}
interface AppProps {
    setIsSelectProduct: React.Dispatch<React.SetStateAction<boolean>>
    setIsMountedCalendar: React.Dispatch<React.SetStateAction<boolean>>
    product: Services
    dates: string[]
}

export default function Appointment({
    setIsSelectProduct,
    setIsMountedCalendar,
    product,
    dates: date,
}: AppProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
    const [isSelected, setIsSelected] = useState<boolean>(false)
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [isTimesLoading, setIsTimesLoading] = useState<boolean>(false)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
    const [modalStep, setModalStep] = useState<number>(0)
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false)
    const [dates, setDates] = useState<Dayjs[]>([])
    // const [isDatesLoading, setIsDatesLoading] = useState<boolean>(true) ///надо сделать лоадер для календаря
    // const [code, setCode] = useState<string | null>(null)
    const codeRef = useRef('')

    // const [price, setPrice] = useState<number>(1000)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        code: '',
    })
    const [timeLeft, setTimeLeft] = useState<number | null>(null) // Оставшееся время в секундах
    const [orderId, setOrderId] = useState<number | null>(null)

    // Реф для хранения таймера бронирования
    const reservationTimerRef = useRef<NodeJS.Timeout | null>(null)
    const reservedSlotRef = useRef<{ date: string; time: string } | null>(null)

    const [consent_pd, setConsent_pd] = useState<boolean>(false)
    const [dateConsent_pd, setDateConsent_pd] = useState<false | string>(false)
    const [consent_promo, setConsent_promo] = useState<boolean>(false)
    const [dateConsent_promo, setDateConsent_promo] = useState<false | string>(
        false,
    )
    const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [approoveOferta, setApprooveOferta] = useState<boolean>(false)
    const [dateApprooveOferta, setDateApprooveOferta] = useState<
        false | string
    >(false)

    // ввод точной даты в состояние
    const handleConsentClick = (
        stateAction: React.Dispatch<React.SetStateAction<false | string>>,
        state: boolean,
    ) => {
        if (state) {
            const date = new Date()
            date.setUTCHours(date.getUTCHours() + 3)
            const moscowIsoString = date.toISOString().replace('Z', '+03:00')

            stateAction(moscowIsoString)
        } else {
            stateAction(false)
        }
    }

    // Освобождение времени на бэкенде
    const cancelReservationOnServer = async () => {
        if (reservedSlotRef.current) {
            const { date, time } = reservedSlotRef.current
            await fetch('/api/cancel-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dateString: date, timeString: time }),
                keepalive: true, // Гарантирует отправку запроса при закрытии вкладки
            }).catch(console.error)

            reservedSlotRef.current = null
        }
    }
    useEffect(() => {
        setIsMounted(true)
    }, [])
    // Полная остановка таймера
    const clearReservationTimer = () => {
        if (reservationTimerRef.current) {
            clearInterval(reservationTimerRef.current)
            reservationTimerRef.current = null
        }
        setTimeLeft(null)
    }
    //  функции сброса состояния
    const resetAppointmentState = () => {
        clearReservationTimer()
        setSelectedDate(null)
        setIsSelected(false)
        setSelectedTime(null)
        setAvailableTimes([])
        setFormData({ name: '', email: '', phone: '', code: '' })
        setModalStep(0)
    }

    // /вопрос при ошибках на стороне оплаты возмиожно правильнее клиента вернуть к тому месту где он уже был?
    const handleCloseModalKeepDate = () => {
        clearReservationTimer()
        cancelReservationOnServer() // Клиент сам отменил запись, снимаем бронь
        setModalStep(0) //что если его вернуть на второй шаг
        setSelectedTime(null)
        setFormData({ name: '', email: '', phone: '', code: '' })
    }

    // Запуск обратного отсчета на 15 минут
    const startReservationTimer = () => {
        clearReservationTimer()
        setTimeLeft(900) // 900 секунд = 15 минут

        reservationTimerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null) return null
                if (prev <= 1) {
                    // Время вышло!
                    clearReservationTimer()
                    cancelReservationOnServer()
                    alert(
                        'Время бронирования истекло. Пожалуйста, выберите время заново.',
                    )
                    resetAppointmentState()
                    return null
                }
                return prev - 1
            })
        }, 1000)
    }

    // Форматирование секунд в строку MM:SS для рендера
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    // const dates = [dayjs().date(3), dayjs().date(7), dayjs().date(15)]

    // поиск дат доступных для записи
    // useEffect(() => {
    //     let ignore = false

    //     const fetchDates = async () => {
    //         setIsDatesLoading(true)
    //         try {
    //             const response = await fetch('/api/dates', {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //             })

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`)
    //             }

    //             const result = await response.json()

    //             if (!ignore) {
    //                 if (result.success && Array.isArray(result.dates)) {
    //                     const today = dayjs().startOf('day')

    //                     const dayjsDates = result.dates
    //                         .map((dateStr: string) => dayjs(dateStr))
    //                         .filter(
    //                             (date: Dayjs) => !date.isBefore(today, 'day'),
    //                         )

    //                     setDates(dayjsDates)
    //                 } else {
    //                     setDates([])
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Ошибка при загрузке дат:', error)
    //             if (!ignore) {
    //                 setDates([])
    //             }
    //         } finally {
    //             if (!ignore) {
    //                 setIsDatesLoading(false)
    //             }
    //         }
    //     }

    //     fetchDates()

    //     return () => {
    //         ignore = true
    //     }
    // }, [])
    useEffect(() => {
        if (date.length && Array.isArray(date)) {
            const today = dayjs().startOf('day')

            const dayjsDates = date
                .map((dateStr: string) => dayjs(dateStr))
                .filter((date: Dayjs) => !date.isBefore(today, 'day'))

            setDates(dayjsDates)
        } else {
            setDates([])
        }
    }, [])
    //поиск времени по дате
    // useEffect(() => {
    //     let ignore = false

    //     if (isSelected && selectedDate) {
    //         setIsTimesLoading(true)
    //         setSelectedTime(null)

    //         // Явно форматируем в YYYY-MM-DD, чтобы избежать UTC-сдвигов
    //         const formattedDate = selectedDate.format('YYYY-MM-DD')

    //         const fetchAvailableTimes = async () => {
    //             try {
    //                 const response = await fetch('/api/times', {
    //                     method: 'POST',
    //                     headers: { 'Content-Type': 'application/json' },
    //                     body: JSON.stringify({ date: formattedDate }),
    //                 })

    //                 if (!response.ok) {
    //                     throw new Error(
    //                         `HTTP error! status: ${response.status}`,
    //                     )
    //                 }

    //                 const result = await response.json()

    //                 if (!result.success) {
    //                     throw new Error(result.message || 'Ошибка на сервере')
    //                 }

    //                 if (!ignore) {
    //                     setAvailableTimes(result.times)
    //                 }
    //             } catch (err) {
    //                 if (!ignore) {
    //                     console.error('Ошибка при получении времени:', err)
    //                 }
    //             } finally {
    //                 if (!ignore) {
    //                     setIsTimesLoading(false)
    //                 }
    //             }
    //         }

    //         fetchAvailableTimes()
    //     }

    //     return () => {
    //         ignore = true // Защита от race condition: игнорируем ответ, если дата изменилась до его получения
    //     }
    // }, [selectedDate, isSelected])
    useEffect(() => {
        let ignore = false

        if (isSelected && selectedDate) {
            setIsTimesLoading(true)
            setSelectedTime(null)

            const formattedDate = selectedDate.format('YYYY-MM-DD')

            const fetchAvailableTimes = async () => {
                try {
                    const response = await fetch('/api/times', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            date: formattedDate,
                        }),
                    })

                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        )
                    }

                    const result = await response.json()

                    if (!result.success) {
                        throw new Error(result.message || 'Ошибка на сервере')
                    }

                    if (!ignore) {
                        const times = Array.isArray(result.times)
                            ? result.times
                            : []

                        const now = dayjs()

                        const filteredTimes = times.filter((time: string) => {
                            // Будущие даты — все времена доступны
                            if (!selectedDate.isSame(now, 'day')) {
                                return true
                            }

                            const [hours, minutes] = time.split(':').map(Number)

                            const slotDateTime = selectedDate
                                .hour(hours)
                                .minute(minutes)
                                .second(0)
                                .millisecond(0)

                            // До начала должно быть минимум 30 минут
                            return slotDateTime.diff(now) >= 30 * 60 * 1000
                        })

                        setAvailableTimes(filteredTimes)
                    }
                } catch (err) {
                    if (!ignore) {
                        console.error('Ошибка при получении времени:', err)
                        setAvailableTimes([])
                    }
                } finally {
                    if (!ignore) {
                        setIsTimesLoading(false)
                    }
                }
            }

            fetchAvailableTimes()
        }

        return () => {
            ignore = true
        }
    }, [selectedDate, isSelected])

    useEffect(() => {
        const handleIframeMessage = async (event: MessageEvent) => {
            // Проверяем, что пришло именно наше сообщение об успехе
            //console.log(262)

            if (event.data && event.data.type === 'payment_success') {
                const invId = event.data.InvId
                //console.log(265)
                // Оплата прошла, переводим пользователя на экран успеха
                // Очищаем таймер брони, так как оплата прошла успешно
                clearReservationTimer()
                //console.log('payment_success 265')

                try {
                    //console.log(272) // Вызываем эндпоинт финализации оплаты
                    const response = await fetch('/api/finalize-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            isPaymentSuccess: true,
                            orderId: invId, // Убедитесь, что в стейте компонента хранится ID текущего заказа
                            code: codeRef.current,
                        }),
                    })
                    //console.log('response 276', response)
                    //console.log(82)
                    const result = await response.json()
                    //console.log('result 279', result)
                    if (result.success) {
                        // Переводим пользователя на экран успеха только после успешного выполнения всех серверных задач
                        setTimeout(() => {
                            setModalStep(5)
                        }, 15000)
                        //console.log('setModalStep 284')
                    } else {
                        alert(
                            result.message || 'Ошибка при финализации оплаты.',
                        )
                    }
                } catch (error) {
                    console.error(
                        'Ошибка при обращении к finalize-payment:',
                        error,
                        //console.log(
                        //     'Ошибка при обращении к finalize-payment: 293',
                        // ),
                    )
                    alert(
                        'Произошла ошибка при подтверждении оплаты. Пожалуйста, обратитесь в поддержку.',
                    )
                }

                setModalStep(5)
                //console.log()
            } else if (event.data === 'payment_fail') {
                // Выводим уведомление. Клиент при этом остается на modalStep === 4
                setModalStep(2)
                alert(
                    'Оплата не удалась или была отменена. Вы можете попробовать снова.',
                )
            }
        }

        // Подписываемся на события
        window.addEventListener('message', handleIframeMessage)

        // Отписываемся при размонтировании компонента
        return () => {
            window.removeEventListener('message', handleIframeMessage)
        }
    }, [])

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (reservedSlotRef.current) {
                cancelReservationOnServer()
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [])

    const handleTimeClick = (time: string) => {
        setSelectedTime(time)
        //console.log(time) //onClick={()=>handleConfirmTime()}
        //console.log(typeof time)
        setModalStep(1)
    }

    //при получении времени от клиента проверяем свободное ли оно и броним на 15 мин
    const handleConfirmTime = async (time: string) => {
        if (!selectedDate) return

        const formattedDate = selectedDate.format('YYYY-MM-DD')

        const formattedTime = time.padStart(5, '0')
        try {
            const response = await fetch('/api/check-time', {
                // Замените на ваш актуальный путь к эндпоинту
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dateString: formattedDate,
                    timeString: formattedTime,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            // success: true,
            // date: slot[0].data,
            // datatime_reserved: slot[0].datatime_reserved,
            // Проверяем общий успех ответа и поле available, которое возвращает ваш бэкенд
            if (result.success && result.date) {
                // Время успешно забронировано (заблокировано на 15 минут)
                setSelectedTime(time)
                // setModalStep(1)

                reservedSlotRef.current = {
                    date: formattedDate,
                    time: formattedTime,
                }

                clearReservationTimer()

                startReservationTimer()
                setModalStep(2)
            } else {
                // Время уже занято кем-то другим

                alert(
                    'Извините, этот слот уже занято или недоступен. Пожалуйста, выберите другое время.',
                )
                // setModalStep(1)
                // Опционально: можно обновить список доступных слотов на экране
                // fetchAvailableTimes()
            }
        } catch (error) {
            //console.log(7)
            console.error('Ошибка при проверке времени:', error)
            alert('Произошла ошибка при выборе времени. Попробуйте еще раз.')
        }
        // setModalStep(2)
        // setSelectedDate((prev) => prev)
        // setSelectedTime(null)
    }

    // const handleFormSubmit = async () => {
    //     if (!formData.name || !formData.email || !formData.phone) {
    //         alert('Пожалуйста, заполните все поля')
    //         return
    //     }

    //     setIsActionLoading(true)
    //     await sendVerificationEmail(formData.email)
    //     setIsActionLoading(false)

    //     setModalStep(3)
    // }

    const handleFormSubmit = async () => {
        // Проверка заполненности полей
        if (!formData.name || !formData.email || !formData.phone) {
            alert('Пожалуйста, заполните все поля')
            return
        }
        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim()
        ) {
            alert('Заполните все обязательные поля')
            return
        }

        if (!consent_pd) {
            alert('Необходимо дать согласие')
            return
        }

        setIsActionLoading(true)

        try {
            const response = await fetch('/api/client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fio: formData.name, // Маппим name во fio для бэкенда
                    phone: formData.phone,
                    email: formData.email,
                    dateConsent_pd: dateConsent_pd,
                    dateConsent_promo: dateConsent_promo,
                    check: product.is_check,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (
                !result.success &&
                result.message === 'Временные рамки нарушены'
            ) {
                // Переводим клиента на специальный экран с ошибкой
                setModalStep(7)

                clearReservationTimer()
                cancelReservationOnServer()

                // Запускаем таймер на 15 секунд для автовозврата
                redirectTimeoutRef.current = setTimeout(() => {
                    handleReturnToStart()
                }, 15000)
                return
            } else if (result.success) {
                // Клиент успешно сохранен в БД, а код отправлен на почту
                setModalStep(3)
            } else {
                // Бэкенд вернул ошибку (например, "Заполнены не все поля")
                alert(result.message || 'Ошибка при отправке данных.')
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error)
            alert('Не удалось отправить код подтверждения. Попробуйте позже.')
        } finally {
            // Выключит загрузку в любом случае: и при успехе, и при ошибке
            setIsActionLoading(false)
        }
    }

    const handleCodeSubmit = async () => {
        // Проверяем, что есть все необходимые данные для создания заказа
        if (
            !formData.code ||
            !formData.email ||
            !selectedDate ||
            !selectedTime ||
            !dateApprooveOferta
        ) {
            alert(
                'Пожалуйста, введите код подтверждения или проверьте выбранное время',
            )
            return
        }

        setIsActionLoading(true)

        try {
            // Форматируем дату и время (как мы это делали на предыдущих шагах)
            const formattedDate = selectedDate.format('YYYY-MM-DD')
            const formattedTime = selectedTime.padStart(5, '0')

            const response = await fetch('/api/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    code: formData.code,

                    // Передаем все детали заказа, которые ждет dbCreateOrder
                    orderDetails: {
                        fio: formData.name, // маппим name из формы в fio
                        phone: formData.phone,
                        date: formattedDate,
                        time: formattedTime,
                        // Замените эти значения на актуальные из вашей формы/состояния
                        consent_pd: consent_pd, // Согласие на обработку ПД
                        consent_promo: consent_promo, // Согласие на рассылку (если есть)
                        price: product.price, // Ваша цена услуги (константа или из состояния)
                        approoveOferta: approoveOferta,
                        dateApprooveOferta: dateApprooveOferta,
                    },
                }),
            })

            if (!response.ok) {
                // Если сервер вернул 400 (неверный код) или 500
                const errResult = await response.json().catch(() => ({}))
                throw new Error(
                    errResult.message ||
                        `HTTP error! status: ${response.status}`,
                )
            }

            const result = await response.json()

            if (result.success && result.paymentUrl && result.orderId) {
                // Сохраняем ссылку на оплату
                setPaymentUrl(result.paymentUrl)
                setOrderId(result.orderId)
                // setCode(formData.code)
                codeRef.current = formData.code
                // console.log('formData.code', formData.code)
                // console.log('code', code)
                // Переходим на шаг с Iframe
                setModalStep(4)
            } else {
                // Ошибка от сервера (например, "Неверный код")
                alert(result.message || 'Неверный код подтверждения')
            }
            // console.log('code 699', code)
        } catch (error: unknown) {
            console.error(
                'Ошибка при проверке кода и оформлении заказа:',
                error,
            )
            // Показываем сообщение об ошибке, которое пришло от сервера, или дефолтное
            alert(
                error instanceof Error && error.message === 'Неверный код'
                    ? 'Неверный код подтверждения'
                    : 'Произошла ошибка при оформлении. Попробуйте еще раз.',
            )
        } finally {
            setIsActionLoading(false)
        }
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
    //console.log('selectedTime', selectedTime)

    const handleReturnToStart = () => {
        // Очищаем таймер, если клиент нажал кнопку сам
        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current)
            redirectTimeoutRef.current = null
        }

        // Сбрасываем выбор продукта и возвращаем в начало страницы
        setIsSelectProduct(false)
        setSelectedDate(null)
        setIsSelected(false)
        setSelectedTime(null)
        setModalStep(0)

        // Данные formData намеренно не очищаем, чтобы клиенту не вводить их заново
    }

    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        document.body.classList.toggle('modal-open', modalStep > 0) //

        return () => {
            document.body.classList.remove('modal-open') //[cite: 1]
        }
    }, [modalStep])
    return (
        <div className={styles.wrapper}>
            {/* НОВЫЕ БЛОКИ: Рендерятся ПЕРЕД календарем, чтобы появляться левее */}
            {isSelected && selectedDate && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap-reverse', // перенос : при сужении экрана правый блок уходит наверх
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end ',
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
                    setIsMountedCalendar={setIsMountedCalendar}
                    dates={dates}
                    selectedDate={selectedDate}
                    isSelected={isSelected}
                    userSelectedDate={userSelectedDate}
                    setIsSelected={setIsSelected}
                />
            </div>
            {modalStep > 0 &&
                isMounted &&
                selectedDate &&
                isSelected &&
                selectedTime &&
                createPortal(
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
                        <div>
                            {modalStep > 0 && (
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        // backgroundColor: 'rgba(0,0,0,0.5)',
                                        zIndex: 100000,
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
                                            boxShadow:
                                                '0 10px 25px rgba(0,0,0,0.1)',
                                        }}
                                    >
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
                                                    {`Именно это время выберем
                                                    для записи: 
                                                    ${selectedDate?.format(
                                                        'DD.MM.YYYY',
                                                    )}, ${selectedTime}?
                                                    `}
                                                </h3>
                                                <button
                                                    onClick={() => {
                                                        if (selectedTime) {
                                                            handleConfirmTime(
                                                                selectedTime,
                                                            )
                                                        }
                                                    }}
                                                    disabled={isActionLoading}
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: 12,
                                                        backgroundColor:
                                                            '#59B86A',
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
                                                    onClick={
                                                        handleCloseModalKeepDate
                                                    }
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: 12,
                                                        backgroundColor:
                                                            '#F5F5F5',
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
                                                        color: '#333030',
                                                    }}
                                                >
                                                    Оформление записи
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
                                                    Время забронировано за вами
                                                    на 15 минут.
                                                </p>
                                                {timeLeft !== null && (
                                                    <div
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize: 18,
                                                            fontWeight: 'bold',
                                                            color:
                                                                timeLeft < 120
                                                                    ? '#E05A5A'
                                                                    : '#59B86A', // Краснеет за 2 минуты до конца
                                                            margin: '-10px 0 10px 0',
                                                        }}
                                                    >
                                                        Осталось времени на
                                                        оформление:
                                                        {formatTime(timeLeft)}
                                                    </div>
                                                )}
                                                <input
                                                    placeholder="ФИО"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            name: e.target
                                                                .value,
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
                                                            email: e.target
                                                                .value,
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
                                                            phone: e.target
                                                                .value,
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
                                                            alignItems:
                                                                'flex-start',
                                                            gap: 10,
                                                            cursor: 'pointer',
                                                            fontSize: 13,
                                                            lineHeight: 1.4,
                                                            color: '#555',
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                consent_promo
                                                            }
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
                                                                    e.target
                                                                        .checked

                                                                setConsent_promo(
                                                                    isChecked,
                                                                )

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
                                                                    получение
                                                                    информационных
                                                                    рассылок
                                                                </b>
                                                            </a>
                                                        </span>
                                                    </label>

                                                    <label
                                                        style={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'flex-start',
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
                                                                    e.target
                                                                        .checked

                                                                setConsent_pd(
                                                                    isChecked,
                                                                )

                                                                if (isChecked) {
                                                                    setDateConsent_pd(
                                                                        new Date().toISOString(),
                                                                    )
                                                                } else {
                                                                    setDateConsent_pd(
                                                                        false,
                                                                    )
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
                                                                    обработку
                                                                    персональных
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
                                                            !consent_pd ||
                                                            isActionLoading
                                                                ? '#999'
                                                                : '#59B86A',
                                                        color:
                                                            !formData.name.trim() ||
                                                            !formData.email.trim() ||
                                                            !formData.phone.trim() ||
                                                            !consent_pd ||
                                                            isActionLoading
                                                                ? 'black'
                                                                : '#fff',
                                                        cursor:
                                                            !formData.name.trim() ||
                                                            !formData.email.trim() ||
                                                            !formData.phone.trim() ||
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
                                                        : 'Записаться'}
                                                </button>
                                                <button
                                                    onClick={
                                                        handleCloseModalKeepDate
                                                    }
                                                    style={{
                                                        background:
                                                            'transparent',
                                                        border: 'none',
                                                        color: '#333',
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
                                                    {`Мы отправили пароль на 
                                            ${formData.email}`}
                                                </p>

                                                <input
                                                    placeholder="Введите пароль из письма"
                                                    value={formData.code}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            code: e.target
                                                                .value,
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
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        alignItems:
                                                            'flex-start',
                                                        gap: 10,
                                                        cursor: 'pointer',
                                                        fontSize: 13,
                                                        lineHeight: 1.4,
                                                        color: '#555',
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={approoveOferta}
                                                        // onChange={(e) => {
                                                        //     handleConsentClick(
                                                        //         setDateApprooveOferta,
                                                        //         approoveOferta,
                                                        //     )
                                                        //     setApprooveOferta(
                                                        //         e.target
                                                        //             .checked,
                                                        //     )
                                                        // }}
                                                        onChange={(e) => {
                                                            const isChecked =
                                                                e.target.checked

                                                            setApprooveOferta(
                                                                isChecked,
                                                            )

                                                            if (isChecked) {
                                                                setDateApprooveOferta(
                                                                    new Date().toISOString(),
                                                                )
                                                            } else {
                                                                setDateApprooveOferta(
                                                                    false,
                                                                )
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
                                                        Я ознакомлен(а) и
                                                        принимаю условия
                                                        <a
                                                            style={{
                                                                textDecoration:
                                                                    'underline',
                                                                color: 'black',
                                                                fontWeight: 700,
                                                            }}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            href="/public-offer"
                                                        >
                                                            <b>
                                                                {`Публичной
                                                                оферты на
                                                                оказание услуг `}
                                                            </b>
                                                        </a>
                                                    </span>
                                                </label>
                                                <button
                                                    onClick={handleCodeSubmit}
                                                    disabled={
                                                        !formData.code.trim() ||
                                                        !approoveOferta ||
                                                        isActionLoading
                                                    }
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: 12,

                                                        border: 'none',
                                                        fontSize: 16,
                                                        fontWeight: 600,

                                                        backgroundColor:
                                                            !formData.code.trim() ||
                                                            !approoveOferta ||
                                                            isActionLoading
                                                                ? '#999'
                                                                : '#59B86A',
                                                        color:
                                                            !formData.code.trim() ||
                                                            !approoveOferta ||
                                                            isActionLoading
                                                                ? 'black'
                                                                : '#fff',
                                                        cursor:
                                                            !formData.code.trim() ||
                                                            !approoveOferta ||
                                                            isActionLoading
                                                                ? 'wait'
                                                                : 'pointer',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    {isActionLoading
                                                        ? 'Проверка...'
                                                        : 'Подтвердить '}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setModalStep(2)
                                                    }
                                                    style={{
                                                        background:
                                                            'transparent',
                                                        border: 'none',
                                                        color: '#333',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Вернуться назад
                                                </button>
                                            </>
                                        )}
                                        {modalStep === 4 && (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '500px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        color: '#333030',
                                                        margin: '0 0 16px 0',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Оплата записи
                                                </h3>

                                                {paymentUrl ? (
                                                    <iframe
                                                        src={paymentUrl}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            border: 'none',
                                                            borderRadius:
                                                                '12px',
                                                        }}
                                                        title="Оплата Робокасса"
                                                    />
                                                ) : (
                                                    <p
                                                        style={{
                                                            color: '#333030',
                                                        }}
                                                    >
                                                        Загрузка оплаты...
                                                    </p>
                                                )}

                                                <button
                                                    onClick={
                                                        handleCloseModalKeepDate
                                                    } // Или функция отмены заказа
                                                    style={{
                                                        marginTop: '16px',
                                                        background:
                                                            'transparent',
                                                        border: 'none',
                                                        color: '#333',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Отменить и закрыть
                                                </button>
                                            </div>
                                        )}
                                        {modalStep === 5 && (
                                            <>
                                                <div
                                                    style={{
                                                        fontSize: 40,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    🎉🎉🎉
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
                                                        color: '#333030',
                                                        margin: 0,
                                                        textAlign: 'center',
                                                        opacity: 0.8,
                                                        fontSize: 15,
                                                    }}
                                                >
                                                    {`Мы ждем вас 
                                                    ${selectedDate?.format(
                                                        'DD.MM.YYYY',
                                                    )} в ${selectedTime}`}
                                                    .<br />
                                                    Подробности и ссылка на
                                                    консультацию отправлены на
                                                    вашу почту.
                                                </p>
                                                <button
                                                    onClick={
                                                        handleFinishAndRedirect
                                                    }
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: 12,
                                                        backgroundColor:
                                                            '#59B86A',
                                                        color: '#fff',
                                                        border: 'none',
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    Посмотреть отзывы и
                                                    вернуться
                                                </button>
                                            </>
                                        )}

                                        {modalStep === 6 && (
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
                                                        color: '#333030',
                                                        margin: 0,
                                                        textAlign: 'center',
                                                        opacity: 0.8,
                                                        fontSize: 15,
                                                    }}
                                                >
                                                    Кто-то только что записался
                                                    на это время. Выберите
                                                    другое, пожалуйста.
                                                </p>
                                                <button
                                                    onClick={
                                                        handleCloseModalKeepDate
                                                    }
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: 12,
                                                        backgroundColor:
                                                            '#E05A5A',
                                                        color: '#fff',
                                                        border: 'none',
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    Перейти к перезаписи
                                                </button>
                                            </>
                                        )}

                                        {modalStep === 7 && (
                                            <>
                                                <div
                                                    style={{
                                                        fontSize: 40,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    ⏳
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
                                                    Невозможно выбрать эту
                                                    услугу
                                                </h3>
                                                <p
                                                    style={{
                                                        color: '#333030',
                                                        margin: 0,
                                                        textAlign: 'center',
                                                        opacity: 0.8,
                                                        fontSize: 15,
                                                        lineHeight: 1.5,
                                                    }}
                                                >
                                                    Мы уточнили - вы получали
                                                    первичную консультацию более
                                                    21 дня назад (или ее не
                                                    получали)
                                                    <br />
                                                    <br />
                                                    Через 15 секунд вы будете
                                                    возвращены к началу для
                                                    выбора другой услуги.
                                                    Выберите пожалуйста
                                                    консультацию
                                                    <b>
                                                        <i>
                                                            {` без указания, что
                                                            она повторная`}
                                                        </i>
                                                    </b>
                                                </p>
                                                <button
                                                    onClick={
                                                        handleReturnToStart
                                                    }
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: 12,
                                                        backgroundColor:
                                                            '#59B86A', // Используем зеленый, как призыв к действию
                                                        color: '#fff',
                                                        border: 'none',
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    Выбрать другую услугу сейчас
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    )
}
