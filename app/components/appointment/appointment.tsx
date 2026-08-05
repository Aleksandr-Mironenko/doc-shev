'use client'

import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

import styles from './appointment.module.scss'
import App from '../calendar/calendar'

export default function Appointment() {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)

    const [isSelected, setIsSelected] = useState(false)

    const dates = [dayjs().date(3), dayjs().date(7), dayjs().date(15)]

    return (
        <div className={styles.wrapper}>
            <App
                dates={dates}
                selectedDate={selectedDate}
                isSelected={isSelected}
                setSelectedDate={setSelectedDate}
                setIsSelected={setIsSelected}
            />
        </div>
    )
}
