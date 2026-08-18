'use client'
import React, { useState } from 'react'
import styles from './buttonsHeroCopy.module.scss'
// Adjust the logo import path if your asset is located elsewhere

import Appointment from '../appointment/appointment'
export default function ButtonsHeroCopy() {
    const [isMountedCalendar, setIsMountedCalendar] = useState(false)
    return (
        <div className={styles.buttonsHero__wrapper}>
            <div className={`${styles.buttonsHero} ${styles.second} `}>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        // maxWidth: '700px',
                        // height: 380,
                    }}
                >
                    {!isMountedCalendar && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                padding: 10,
                                backgroundColor: '#ffffff',
                                borderRadius: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxSizing: 'border-box',
                                zIndex: 2,
                                opacity: isMountedCalendar ? 0 : 1,
                                transform: isMountedCalendar
                                    ? 'scale(0.96)'
                                    : 'scale(1)',

                                transition:
                                    'opacity 0.4s ease, transform 0.4s ease',

                                pointerEvents: isMountedCalendar
                                    ? 'none'
                                    : 'auto',
                            }}
                        >
                            <p style={{ margin: 0, color: '#8c8c8c' }}>
                                загружаю данные
                            </p>
                        </div>
                    )}
                    <div
                        style={{
                            margin: 0,
                            color: '#8c8c8c',
                            width: '100%',
                            height: '100%',
                            opacity: isMountedCalendar ? 1 : 0,
                            transform: isMountedCalendar
                                ? 'scale(1)'
                                : 'scale(0.96)',

                            transition:
                                'opacity 0.4s ease, transform 0.4s ease',
                        }}
                    >
                        <Appointment
                            setIsMountedCalendar={setIsMountedCalendar}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
