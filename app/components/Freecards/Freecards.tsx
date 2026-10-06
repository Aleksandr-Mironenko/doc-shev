'use client'
import { useEffect, useRef, useState } from 'react'
import MaterialCard from '../MaterialCard/MaterialCard'
import { createPortal } from 'react-dom'
import { DownloadButton } from '../DownloadButton/DownloadButton'

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
    link?: string | null
    is_check: boolean
    is_active?: boolean | null
    price: number
    image?: string | null
    created_at: Date | string
    entity: string
}

export default function Freecards({ content }: { content: Services[] }) {
    const [orderId, setOrderId] = useState<number | null>(null)
    const [isDownload, setIsDownload] = useState<boolean>(false)
    const [modalStep, setModalStep] = useState<number>(0)
    const [productCard, setProductCard] = useState<Services | null>(null) //на этом этапе я знаю что выбрано и выбрано ли по принципу не null
    const [consent_promo, setConsent_promo] = useState<boolean>(false)
    const [consent_pd, setConsent_pd] = useState<boolean>(false)
    const [dateConsent_pd, setDateConsent_pd] = useState<false | string>(false)
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false)
    const [dateConsent_promo, setDateConsent_promo] = useState<false | string>(
        false,
    )
    const [approoveOferta, setApprooveOferta] = useState<boolean>(false)
    const [dateApprooveOferta, setDateApprooveOferta] = useState<
        false | string
    >(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        code: '',
    })
    const codeRef = useRef('')

    const clickChangeStep = (product: Services) => {
        setProductCard(product)
        setModalStep(2)
    }
    const handleReturnToStart = () => {
        // Сбрасываем выбор продукта и возвращаем в начало страницы

        setProductCard(null)

        setModalStep(0)

        // Данные formData намеренно не очищаем, чтобы клиенту не вводить их заново
    }
    //  const clearReservationTimer = () => {
    //         if (reservationTimerRef.current) {
    //             clearInterval(reservationTimerRef.current)
    //             reservationTimerRef.current = null
    //         }
    //         setTimeLeft(null)
    //     }

    // Освобождение времени на бэкенде
    // const cancelReservationOnServer = async () => {
    //     if (reservedSlotRef.current) {
    //         const { date, time } = reservedSlotRef.current
    //         await fetch('/api/cancel-time', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ dateString: date, timeString: time }),
    //             keepalive: true, // Гарантирует отправку запроса при закрытии вкладки
    //         }).catch(console.error)

    //         reservedSlotRef.current = null
    //     }
    // }
    const resetAppointmentState = () => {
        setProductCard(null)
        setFormData({ name: '', email: '', phone: '', code: '' })
        setModalStep(0)
    }

    const handleFinishAndRedirect = () => {
        setModalStep(0)
        resetAppointmentState()
        window.location.href = '/#reviews'
    }

    const handleCodeSubmit = async () => {
        // Проверяем, что есть все необходимые данные для создания заказа
        if (
            !formData.code ||
            !formData.email ||
            !productCard ||
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
            const formattedDate = productCard.title //пишем просто строки объясняющие что в заказе
            const formattedTime = productCard.entity //пишем просто строки объясняющие что в заказе

            const response = await fetch('/api/verify-code', {
                //нужно немного переделать эндпоинт для другого вида работы чтобы не отправил что у него есть запись на встречу
                //нет тут просто создается заказ а при удачной оплате происходит проверка на happy эндпоинте именно там надо логику поправить что и в каком слуае отправлять
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
                        price: productCard.price, // Ваша цена услуги (константа или из состояния)
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

            if (result.success && result.orderId) {
                // Сохраняем ссылку на оплату

                setOrderId(result.orderId)

                codeRef.current = formData.code

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

    const handleCloseModalKeepDate = () => {
        // clearReservationTimer()
        // cancelReservationOnServer() // Клиент сам отменил запись, снимаем бронь
        setModalStep(0) //что если его вернуть на второй шаг
        setProductCard(null)
        setFormData({ name: '', email: '', phone: '', code: '' })
    }

    const cards = content.map((el) => (
        <li key={el.id}>
            <MaterialCard
                productCard={productCard}
                clickChangeStep={clickChangeStep}
                product={el}
            />
        </li>
    ))
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
                    check: productCard?.is_check,
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

                // clearReservationTimer()
                // cancelReservationOnServer()

                // // Запускаем таймер на 15 секунд для автовозврата
                // redirectTimeoutRef.current = setTimeout(() => {
                //     handleReturnToStart()
                // }, 15000)
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

    useEffect(() => {
        if (isDownload) {
            setTimeout(() => {
                setModalStep(0)
                setFormData((prev) => ({
                    name: prev.name,
                    email: prev.email,
                    phone: prev.phone,
                    code: '',
                }))
                setApprooveOferta(false)
                setConsent_pd(false)
                setConsent_promo(false)
                setProductCard(null)
            }, 2000) // 2 секунды
        }
    }, [isDownload])

    return (
        <div>
            <ul style={{ listStyleType: 'none' }}>{cards}</ul>

            {/* //когда не null вызываю модалку и провожу по всем шагам */}
            {modalStep > 0 &&
                productCard !== null &&
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
                                                        : 'Хочу получить'}
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
                                                    Скачивание начнется после
                                                    клика на кнопку
                                                </h3>
                                                <DownloadButton
                                                    setIsDownload={
                                                        setIsDownload
                                                    }
                                                    productId={productCard.id}
                                                />
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
                                                    Оплата проведена,
                                                    методический материал
                                                    отправлен на почту!
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
                                                    {`Материал отправлен в указанную вами электронную почту`}
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
