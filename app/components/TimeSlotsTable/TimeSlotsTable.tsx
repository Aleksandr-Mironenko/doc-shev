'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table'

import { useState } from 'react'

import type { TimeSlot } from '@/app/components/AdminPage/AdminPage'

import styles from './TimeSlots.module.scss'

interface AdminTimeSlotsProps {
    timeSlots: TimeSlot[]
}

interface EditingCell {
    rowId: number
    columnId: keyof TimeSlot
    value: string
}

interface TimeSlotsResponse {
    success: boolean
    data: TimeSlot[]
}

interface UpdateResponse {
    success: boolean
}

interface AddTimeSlotResponse {
    success: boolean
    message?: string
}

const columns: ColumnDef<TimeSlot>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'data',
        header: 'Дата',
    },
    {
        accessorKey: 'time',
        header: 'Время',
    },
    {
        accessorKey: 'datatime_reserved',
        header: 'Дата резервирования',
        cell: (info) => {
            const value = info.getValue<Date | string>()

            if (!value) {
                return '—'
            }

            return new Date(value).toLocaleString('ru-RU')
        },
    },
    {
        accessorKey: 'comment',
        header: 'Комментарий',
        cell: (info) => {
            return info.getValue<string | null>() ?? '—'
        },
    },
]

export default function AdminTimeSlots({
    timeSlots: initialTimeSlots,
}: AdminTimeSlotsProps) {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots)

    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)

    const [isAdding, setIsAdding] = useState(false)

    const [newDate, setNewDate] = useState('')

    const [newTime, setNewTime] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState<string | null>(null)

    const addTimeSlot = async (): Promise<void> => {
        if (!newDate || !newTime) {
            setError('Укажите дату и время')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/admin/time-slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: newDate,
                    time: newTime,
                }),
            })

            if (!response.ok) {
                setError('Ошибка при добавлении слота')
                return
            }

            const result: AddTimeSlotResponse = await response.json()

            if (!result.success) {
                setError(result.message ?? 'Не удалось добавить слот')
                return
            }

            const slotsResponse = await fetch('/api/admin/time-slots')

            if (!slotsResponse.ok) {
                setError('Слот добавлен, но не удалось обновить таблицу')
                return
            }

            const slotsResult: TimeSlotsResponse = await slotsResponse.json()

            if (!slotsResult.success) {
                setError('Слот добавлен, но не удалось обновить таблицу')
                return
            }

            setTimeSlots(slotsResult.data)

            setNewDate('')
            setNewTime('')
            setIsAdding(false)
        } catch (error) {
            console.error('Ошибка добавления временного слота:', error)

            setError('Ошибка соединения с сервером')
        } finally {
            setIsLoading(false)
        }
    }

    const saveCell = async (): Promise<void> => {
        if (!editingCell) {
            return
        }

        const { rowId, columnId, value } = editingCell

        setError(null)

        try {
            const response = await fetch('/api/admin/time-slots', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: rowId,
                    columnName: columnId,
                    value,
                }),
            })

            if (!response.ok) {
                setError('Ошибка при сохранении изменения')
                return
            }

            const result: UpdateResponse = await response.json()

            if (!result.success) {
                setError('Не удалось сохранить изменение')
                return
            }

            setTimeSlots((current) =>
                current.map((slot) =>
                    slot.id === rowId
                        ? {
                              ...slot,
                              [columnId]: value,
                          }
                        : slot,
                ),
            )

            setEditingCell(null)
        } catch (error) {
            console.error('Ошибка обновления временного слота:', error)

            setError('Ошибка соединения с сервером')
        }
    }

    const table = useReactTable({
        data: timeSlots,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Временные слоты</h2>

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => {
                        setIsAdding((current) => !current)
                        setError(null)
                    }}
                >
                    {isAdding ? 'Отмена' : 'Добавить слот'}
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {isAdding && (
                <div className={styles.addForm}>
                    <div className={styles.addForm__buttons}>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(event) => setNewDate(event.target.value)}
                        />

                        <input
                            type="time"
                            value={newTime}
                            onChange={(event) => setNewTime(event.target.value)}
                        />

                        <button className={styles.addForm__buttons_add}
                            type="button"
                            disabled={isLoading || !newDate || !newTime}
                            onClick={addTimeSlot}
                        >
                            {isLoading ? 'Добавление...' : 'Добавить'}
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.original.id}>
                                {row.getVisibleCells().map((cell) => {
                                    const columnId = cell.column
                                        .id as keyof TimeSlot

                                    const editable =
                                        columnId === 'data' ||
                                        columnId === 'time' ||
                                        columnId === 'comment'

                                    const isEditing =
                                        editingCell?.rowId ===
                                            row.original.id &&
                                        editingCell?.columnId === columnId

                                    return (
                                        <td
                                            key={cell.id}
                                            onDoubleClick={() => {
                                                if (!editable) {
                                                    return
                                                }

                                                const value = cell.getValue<
                                                    string | null
                                                >()

                                                setEditingCell({
                                                    rowId: row.original.id,
                                                    columnId,
                                                    value: value ?? '',
                                                })
                                            }}
                                        >
                                            {isEditing ? (
                                                <div className={styles.editor}>
                                                    <input
                                                        autoFocus
                                                        type={
                                                            columnId === 'data'
                                                                ? 'date'
                                                                : columnId ===
                                                                    'time'
                                                                  ? 'time'
                                                                  : 'text'
                                                        }
                                                        value={
                                                            editingCell.value
                                                        }
                                                        onChange={(event) =>
                                                            setEditingCell(
                                                                (current) =>
                                                                    current
                                                                        ? {
                                                                              ...current,
                                                                              value: event
                                                                                  .target
                                                                                  .value,
                                                                          }
                                                                        : null,
                                                            )
                                                        }
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={saveCell}
                                                    >
                                                        ✓
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingCell(null)
                                                        }
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
