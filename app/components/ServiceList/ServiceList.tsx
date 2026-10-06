'use client'
import { useEffect, useRef, useState } from 'react'
import MaterialCard from '../MaterialCard/MaterialCard'
import { createPortal } from 'react-dom'

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

export default function ServiceList({ content }: { content: Services[] }) {
    const [orderId, setOrderId] = useState<number | null>(null)
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
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

            if (result.success && result.paymentUrl && result.orderId) {
                // Сохраняем ссылку на оплату
                setPaymentUrl(result.paymentUrl)
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
        const handleIframeMessage = async (event: MessageEvent) => {
            // Проверяем, что пришло именно наше сообщение об успехе
            //console.log(262)

            if (event.data && event.data.type === 'payment_success') {
                const invId = event.data.InvId
                //console.log(265)
                // Оплата прошла, переводим пользователя на экран успеха
                // Очищаем таймер брони, так как оплата прошла успешно
                // clearReservationTimer()
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
                            productCard: productCard
                                ? { id: productCard.id }
                                : undefined,
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
    }, [productCard, setModalStep])

    return (
        <>
            <ul style={{ listStyleType: 'none' }}>{cards}</ul>
        </>
    )
}
