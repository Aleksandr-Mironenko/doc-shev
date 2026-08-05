'use client'

import React, { useRef, useState } from 'react'

import { Calendar, ConfigProvider, Flex } from 'antd'
import type { CalendarProps } from 'antd'
import ruRU from 'antd/locale/ru_RU'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import { createStyles } from 'antd-style'
import type { Dayjs } from 'dayjs'

dayjs.locale('ru')

interface AppProps {
    dates?: Dayjs[]
    selectedDate: Dayjs | null
    isSelected: boolean
    setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs | null>>
    setIsSelected: React.Dispatch<React.SetStateAction<boolean>>
}

type NavigationDirection = 'prev' | 'next' | null

const useStyles = createStyles(() => ({
    root: {
        padding: 10,
        backgroundColor: '#ffffff',
    },
}))

const stylesObject: CalendarProps<Dayjs>['styles'] = {
    root: {
        borderRadius: 20,
        width: '75%',
        maxWidth: '700px',
    },
}

const App: React.FC<AppProps> = ({
    dates = [dayjs().date(3)],
    selectedDate,
    isSelected,
    setSelectedDate,
    setIsSelected,
}) => {
    const { styles: classNames } = useStyles()

    /*
     * Текущий отображаемый месяц
     */
    const [currentMonth, setCurrentMonth] = useState(dayjs())

    /*
     * Выбранная дата
     */

    /*
     * Флаг выбора даты
     */

    /*
     * Анимация смены месяца
     */
    const [isChangingMonth, setIsChangingMonth] = useState(false)

    /*
     * Дата, на которую наведён курсор
     */
    const [hoveredDate, setHoveredDate] = useState<string | null>(null)

    /*
     * Направление навигации
     */
    const [navigationDirection, setNavigationDirection] =
        useState<NavigationDirection>(null)

    /*
     * Таймер кастомной подсказки
     */
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    /*
     * Таймер анимации смены месяца
     */
    const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    /*
     * Очистка таймера наведения
     */
    const clearHoverTimer = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
            hoverTimer.current = null
        }
    }

    /*
     * Удаляем стандартный tooltip Ant Design
     */
    const removeAntTooltip = (element: HTMLElement) => {
        const cell = element.closest('.ant-picker-cell') as HTMLElement | null

        if (cell) {
            cell.removeAttribute('title')
        }
    }

    /*
     * Кастомная подсказка появляется
     * только после 1.5 секунды наведения
     */
    const handleMouseEnter = (date: Dayjs) => {
        clearHoverTimer()

        const dateKey = date.format('YYYY-MM-DD')

        hoverTimer.current = setTimeout(() => {
            setHoveredDate(dateKey)
        }, 1500)
    }

    /*
     * Уход курсора с даты
     */
    const handleMouseLeave = () => {
        clearHoverTimer()
        setHoveredDate(null)
    }

    /*
     * Наведение на стрелку
     */
    const handleNavigationHover = (direction: NavigationDirection) => {
        clearHoverTimer()

        hoverTimer.current = setTimeout(() => {
            setNavigationDirection(direction)
        }, 1500)
    }

    /*
     * Уход курсора со стрелки
     */
    const handleNavigationLeave = () => {
        clearHoverTimer()
        setNavigationDirection(null)
    }

    /*
     * Смена месяца
     */
    const changeMonth = (nextMonth: Dayjs, direction: NavigationDirection) => {
        if (isChangingMonth) {
            return
        }

        clearHoverTimer()

        setHoveredDate(null)
        setNavigationDirection(null)

        if (animationTimer.current) {
            clearTimeout(animationTimer.current)
        }

        /*
         * Начинаем затухание текста
         */
        setIsChangingMonth(true)

        /*
         * Меняем месяц после fade-out
         */
        animationTimer.current = setTimeout(() => {
            setCurrentMonth(nextMonth)

            /*
             * Даём React отрисовать новый месяц
             * перед появлением текста
             */
            animationTimer.current = setTimeout(() => {
                setIsChangingMonth(false)
            }, 50)
        }, 250)
    }

    /*
     * Изменение месяца через Calendar
     */
    const handlePanelChange = (date: Dayjs) => {
        const direction = date.isAfter(currentMonth, 'month') ? 'next' : 'prev'

        changeMonth(date, direction)
    }

    /*
     * Клик по дате
     */
    const handleDateClick = (
        date: Dayjs,
        isCurrentMonth: boolean,
        isNextMonth: boolean,
        isAvailable: boolean,
    ) => {
        if (isChangingMonth) {
            return
        }

        /*
         * Клик по дате следующего месяца
         */
        if (isNextMonth) {
            console.log(
                'Переход к следующему месяцу:',
                date.startOf('month').format('YYYY-MM-DD'),
            )

            changeMonth(date.startOf('month'), 'next')

            return
        }

        /*
         * Клик по дате прошлого месяца
         */
        if (!isCurrentMonth) {
            console.log(
                'Клик по дате прошлого месяца:',
                date.format('YYYY-MM-DD'),
            )

            return
        }

        /*
         * Красная дата
         */
        if (!isAvailable) {
            console.log(
                'Дата недоступна для записи:',
                date.format('YYYY-MM-DD'),
            )

            return
        }

        /*
         * Доступная дата выбрана
         */
        setIsSelected(true)
        setSelectedDate(date)

        console.log('Дата выбрана:', date.format('YYYY-MM-DD'))

        console.log('isSelected:', true)

        console.log('selectedDate:', date.format('YYYY-MM-DD'))
    }

    /*
     * Только текст меняет opacity
     */
    const textOpacity = isChangingMonth ? 0 : 1
    console.log({
        selectedDate,
        isSelected,
        setSelectedDate,
        setIsSelected,
        setIsSelectedType: typeof setIsSelected,
    })
    return (
        <ConfigProvider locale={ruRU}>
            <Flex vertical gap="medium">
                <Calendar
                    fullscreen={false}
                    classNames={classNames}
                    styles={stylesObject}
                    value={currentMonth}
                    onPanelChange={handlePanelChange}
                    headerRender={({ value }) => {
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                }}
                            >
                                {/* ПРЕДЫДУЩИЙ МЕСЯЦ */}

                                <div
                                    style={{
                                        position: 'relative',
                                    }}
                                    onMouseEnter={() =>
                                        handleNavigationHover('prev')
                                    }
                                    onMouseLeave={handleNavigationLeave}
                                >
                                    <button
                                        type="button"
                                        style={{
                                            padding: '12px 16px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                            changeMonth(
                                                value.subtract(1, 'month'),
                                                'prev',
                                            )
                                        }
                                    >
                                        ‹
                                    </button>

                                    {navigationDirection === 'prev' && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                zIndex: 100,
                                                top: 'calc(100% + 8px)',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 180,
                                                padding: '10px 12px',
                                                borderRadius: 8,
                                                backgroundColor:
                                                    'rgba(0, 0, 0, 0.85)',
                                                color: '#fff',
                                                fontSize: 13,
                                                lineHeight: 1.4,
                                                textAlign: 'center',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            Прошлое не вернуть
                                        </div>
                                    )}
                                </div>

                                {/* НАЗВАНИЕ МЕСЯЦА */}

                                <span
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        opacity: textOpacity,
                                        transition: 'opacity 250ms ease',
                                    }}
                                >
                                    {value.format('MMMM YYYY')}
                                </span>

                                {/* СЛЕДУЮЩИЙ МЕСЯЦ */}

                                <div
                                    style={{
                                        position: 'relative',
                                    }}
                                    onMouseEnter={() =>
                                        handleNavigationHover('next')
                                    }
                                    onMouseLeave={handleNavigationLeave}
                                >
                                    <button
                                        type="button"
                                        style={{
                                            padding: '12px 16px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                            changeMonth(
                                                value.add(1, 'month'),
                                                'next',
                                            )
                                        }
                                    >
                                        ›
                                    </button>

                                    {navigationDirection === 'next' && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                zIndex: 100,
                                                top: 'calc(100% + 8px)',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 200,
                                                padding: '10px 12px',
                                                borderRadius: 8,
                                                backgroundColor:
                                                    'rgba(0, 0, 0, 0.85)',
                                                color: '#fff',
                                                fontSize: 13,
                                                lineHeight: 1.4,
                                                textAlign: 'center',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            Перейти к следующему месяцу
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }}
                    fullCellRender={(date) => {
                        const currentMonthStart = currentMonth.startOf('month')

                        const isCurrentMonth = date.isSame(
                            currentMonthStart,
                            'month',
                        )

                        const isNextMonth = date.isAfter(
                            currentMonthStart,
                            'month',
                        )

                        /*
                         * СОСЕДНИЕ МЕСЯЦЫ
                         */

                        if (!isCurrentMonth) {
                            const dateKey = date.format('YYYY-MM-DD')

                            const isHovered = hoveredDate === dateKey

                            return (
                                <div
                                    title=""
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                        height: '100%',
                                        cursor: isNextMonth
                                            ? 'pointer'
                                            : 'default',
                                    }}
                                    onMouseEnter={(event) => {
                                        /*
                                         * Сначала удаляем
                                         * стандартный tooltip
                                         */
                                        removeAntTooltip(event.currentTarget)

                                        /*
                                         * Затем запускаем
                                         * собственный таймер
                                         */
                                        handleMouseEnter(date)
                                    }}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() =>
                                        handleDateClick(
                                            date,
                                            false,
                                            isNextMonth,
                                            false,
                                        )
                                    }
                                >
                                    <div
                                        style={{
                                            fontWeight: 400,
                                            opacity: textOpacity,
                                            transition: 'opacity 250ms ease',
                                        }}
                                    >
                                        {date.date()}
                                    </div>

                                    {isHovered && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                zIndex: 100,
                                                bottom: 'calc(100% + 8px)',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 200,
                                                padding: '10px 12px',
                                                borderRadius: 8,
                                                backgroundColor:
                                                    'rgba(0, 0, 0, 0.85)',
                                                color: '#fff',
                                                fontSize: 13,
                                                lineHeight: 1.4,
                                                textAlign: 'center',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            {isNextMonth
                                                ? 'Перейти к следующему месяцу'
                                                : 'Прошлое не вернуть'}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        /*
                         * ТЕКУЩИЙ МЕСЯЦ
                         */

                        const isAvailable = dates.some((item) =>
                            item.isSame(date, 'day'),
                        )

                        const color = isAvailable ? '#59B86A' : '#E05A5A'

                        const dateKey = date.format('YYYY-MM-DD')

                        const isHovered = hoveredDate === dateKey

                        /*
                         * Выбрана ли дата
                         */
                        const isDateSelected =
                            isSelected && selectedDate?.isSame(date, 'day')

                        return (
                            <div
                                title=""
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                }}
                                onMouseEnter={(event) => {
                                    /*
                                     * Убираем стандартный
                                     * tooltip Ant Design
                                     */
                                    removeAntTooltip(event.currentTarget)

                                    /*
                                     * Запускаем нашу
                                     * подсказку через 1.5 сек
                                     */
                                    handleMouseEnter(date)
                                }}
                                onMouseLeave={handleMouseLeave}
                                onClick={() =>
                                    handleDateClick(
                                        date,
                                        true,
                                        false,
                                        isAvailable,
                                    )
                                }
                            >
                                {/* КРУГ */}

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                        padding: 4,
                                        borderRadius: '50%',
                                        background: `radial-gradient(
                                                circle at center,
                                                ${color}35 0%,
                                                ${color}35 25%,
                                                ${color}30 60%,
                                                ${color}20 80%,
                                                ${color}05 100%
                                            )`,
                                        boxShadow: isDateSelected
                                            ? `0 0 0 2px ${color}`
                                            : 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {/* ЦИФРА */}

                                    <span
                                        style={{
                                            fontWeight: 700,
                                            opacity: textOpacity,
                                            transition: 'opacity 250ms ease',
                                        }}
                                    >
                                        {date.date()}
                                    </span>
                                </div>

                                {/* КАСТОМНАЯ ПОДСКАЗКА */}

                                {isHovered && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            zIndex: 100,
                                            bottom: 'calc(100% + 8px)',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 220,
                                            padding: '10px 12px',
                                            borderRadius: 8,
                                            backgroundColor:
                                                'rgba(0, 0, 0, 0.85)',
                                            color: '#fff',
                                            fontSize: 13,
                                            lineHeight: 1.4,
                                            textAlign: 'center',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        {isAvailable
                                            ? 'Кликните, чтобы записаться'
                                            : 'Записи в этот день закончились'}
                                    </div>
                                )}
                            </div>
                        )
                    }}
                />
            </Flex>
        </ConfigProvider>
    )
}

export default App
