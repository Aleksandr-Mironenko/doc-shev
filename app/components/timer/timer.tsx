'use client'

import { useState, useEffect, useRef } from 'react'

interface ReservationTimerProps {
    expiresAt: number // Точное время окончания брони (Unix Timestamp в миллисекундах)
    onExpire: () => void
}

export function ReservationTimer({
    expiresAt,
    onExpire,
}: ReservationTimerProps) {
    // Вспомогательная функция вычисления остатка секунд
    const [timeLeft, setTimeLeft] = useState<number | null>(null) // Оставшееся время в секундах
    const [orderId, setOrderId] = useState<number | null>(null)
    const reservationTimerRef = useRef<NodeJS.Timeout | null>(null)
    const reservedSlotRef = useRef<{ date: string; time: string } | null>(null)
    const cancelReservationOnServer = () => {
        if (reservedSlotRef.current) {
            const { date, time } = reservedSlotRef.current
            fetch('/api/cancel-time', {
                // ЗАМЕНИТЕ НА ВАШ АКТУАЛЬНЫЙ ЭНДПОИНТ
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dateString: date, timeString: time }),
                keepalive: true, // Гарантирует отправку запроса при закрытии вкладки
            }).catch(console.error)

            reservedSlotRef.current = null
        }
    }
    // Полная остановка таймера
    const clearReservationTimer = () => {
        if (reservationTimerRef.current) {
            clearInterval(reservationTimerRef.current)
            reservationTimerRef.current = null
        }
        setTimeLeft(null)
    }

    const getSecondsLeft = () => {
        const diff = Math.ceil((expiresAt - Date.now()) / 1000)
        return diff > 0 ? diff : 0
    }

    const [timeLeft, setTimeLeft] = useState<number>(getSecondsLeft)

    useEffect(() => {
        const timer = setInterval(() => {
            const seconds = getSecondsLeft()
            setTimeLeft(seconds)

            if (seconds <= 0) {
                clearInterval(timer)
                onExpire()
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [expiresAt, onExpire])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    return (
        <div
            style={{
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 'bold',
                color: timeLeft < 120 ? '#E05A5A' : '#59B86A',
                marginBottom: '10px',
            }}
        >
            Осталось времени на оформление и оплату: {formatTime(timeLeft)}
        </div>
    )
}
