'use client'

import React, { useState } from 'react'
import { DatePicker, TimePicker, Button, message, Card, Space } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

interface AddTimeFormProps {
    /** Опциональный колбэк, который вызывается после успешного добавления (например, для обновления списка) */
    onSuccess?: () => void
}

export const AddTimeForm: React.FC<AddTimeFormProps> = ({ onSuccess }) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime) {
            message.warning('Пожалуйста, выберите дату и время')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/createDataTime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: selectedDate.format('YYYY-MM-DD'),
                    time: selectedTime.format('HH:mm'),
                }),
            })

            const result = await response.json()

            if (result.success) {
                message.success('Слот времени успешно добавлен!')
                // Сбрасываем выбор времени (дату можно оставить для удобства повторного ввода)
                setSelectedTime(null)

                if (onSuccess) {
                    onSuccess()
                }
            } else {
                message.error(result.message || 'Не удалось добавить слот')
            }
        } catch (error) {
            console.error('Ошибка при отправке:', error)
            message.error('Ошибка сети при попытке добавить слот')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card title="Добавить доступное время" style={{ maxWidth: 400 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 8 }}>
                        Дата:
                    </label>
                    <DatePicker
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        format="YYYY-MM-DD"
                        placeholder="Выберите дату"
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 8 }}>
                        Время:
                    </label>
                    <TimePicker
                        value={selectedTime}
                        onChange={(time) => setSelectedTime(time)}
                        format="HH:mm"
                        minuteStep={15} // Шаг минут (можно убрать или изменить)
                        placeholder="Выберите время"
                        style={{ width: '100%' }}
                    />
                </div>

                <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={!selectedDate || !selectedTime}
                    block
                >
                    Сохранить слот
                </Button>
            </Space>
        </Card>
    )
}
