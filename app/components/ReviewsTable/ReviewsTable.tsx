'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table'

import { useState } from 'react'

import type { Review } from '@/app/components/AdminPage/AdminPage'

import styles from './ReviewsTable.module.scss'

interface ReviewsTableProps {
    reviews: Review[]
}

interface EditingCell {
    rowId: number
    columnId: keyof Review
    value: string
}

interface AddReviewForm {
    text: string
    active: boolean
}

const initialForm: AddReviewForm = {
    text: '',
    active: false,
}

const columns: ColumnDef<Review>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'active',
        header: 'Активен',
        cell: (info) => (info.getValue<boolean>() ? 'Да' : 'Нет'),
    },
    {
        accessorKey: 'text',
        header: 'Текст',
    },

    {
        accessorKey: 'created_at',
        header: 'Создан',
    },
    {
        accessorKey: 'comment',
        header: 'Комментарий',
    },
]

export default function ReviewsTable({
    reviews: initialReviews,
}: ReviewsTableProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews)

    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)

    const [isAddFormOpen, setIsAddFormOpen] = useState(false)

    const [form, setForm] = useState<AddReviewForm>(initialForm)

    const [isAdding, setIsAdding] = useState(false)

    const [addError, setAddError] = useState<string | null>(null)

    const saveCell = async (): Promise<void> => {
        if (!editingCell) {
            return
        }

        const { rowId, columnId, value } = editingCell

        const parsedValue = columnId === 'active' ? value === 'true' : value

        const response = await fetch('/api/admin/reviews', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: rowId,
                columnName: columnId,
                value: parsedValue,
            }),
        })

        if (!response.ok) {
            return
        }

        const result: {
            success: boolean
        } = await response.json()

        if (!result.success) {
            return
        }

        setReviews((current) =>
            current.map((review) =>
                review.id === rowId
                    ? {
                          ...review,
                          [columnId]: parsedValue,
                      }
                    : review,
            ),
        )

        setEditingCell(null)
    }

    const updateForm = (
        field: keyof AddReviewForm,
        value: string | boolean,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    const addReview = async (): Promise<void> => {
        setAddError(null)

        if (!form.text.trim()) {
            setAddError('Введите текст отзыва')
            return
        }

        try {
            setIsAdding(true)

            const response = await fetch('/api/admin/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: form.text.trim(),
                    active: form.active,
                }),
            })

            const result: {
                success: boolean
                id?: number
                message?: string
            } = await response.json()

            if (!response.ok || !result.success) {
                setAddError(result.message || 'Не удалось добавить отзыв')

                return
            }

            setForm(initialForm)

            setIsAddFormOpen(false)
        } catch (error) {
            console.error('Ошибка добавления отзыва:', error)

            setAddError('Ошибка соединения с сервером')
        } finally {
            setIsAdding(false)
        }
    }

    const table = useReactTable({
        data: reviews,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Отзывы</h2>

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => {
                        setAddError(null)
                        setIsAddFormOpen(true)
                    }}
                >
                    + Добавить отзыв
                </button>
            </div>

            {isAddFormOpen && (
                <div className={styles.addForm}>
                    <div className={styles.addFormHeader}>
                        <h3 className={styles.addFormTitle}>
                            Добавление отзыва
                        </h3>

                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => {
                                if (isAdding) {
                                    return
                                }

                                setIsAddFormOpen(false)
                                setAddError(null)
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {addError && <div className={styles.error}>{addError}</div>}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => {
                                if (isAdding) {
                                    return
                                }

                                setIsAddFormOpen(false)
                                setAddError(null)
                            }}
                            disabled={isAdding}
                        >
                            Отмена
                        </button>

                        <button
                            type="button"
                            className={styles.saveButton}
                            onClick={addReview}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Добавление...' : 'Добавить отзыв'}
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
                                        .id as keyof Review

                                    const editable =
                                        columnId !== 'id' &&
                                        columnId !== 'created_at'

                                    const isEditing =
                                        editingCell?.rowId ===
                                            row.original.id &&
                                        editingCell?.columnId === columnId

                                    return (
                                        <td
                                            key={cell.id}
                                            className={
                                                editable
                                                    ? styles.editable
                                                    : undefined
                                            }
                                            onDoubleClick={() => {
                                                if (!editable) {
                                                    return
                                                }

                                                const raw = cell.getValue<
                                                    string | boolean | null
                                                >()

                                                const value =
                                                    typeof raw === 'boolean'
                                                        ? String(raw)
                                                        : (raw ?? '')

                                                setEditingCell({
                                                    rowId: row.original.id,
                                                    columnId,
                                                    value,
                                                })
                                            }}
                                        >
                                            {isEditing ? (
                                                <div className={styles.editor}>
                                                    {columnId === 'active' ? (
                                                        <select
                                                            autoFocus
                                                            value={
                                                                editingCell.value
                                                            }
                                                            onChange={(event) =>
                                                                setEditingCell(
                                                                    (
                                                                        current,
                                                                    ) =>
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
                                                        >
                                                            <option value="true">
                                                                Да
                                                            </option>

                                                            <option value="false">
                                                                Нет
                                                            </option>
                                                        </select>
                                                    ) : (
                                                        <textarea
                                                            style={{
                                                                width: '80%',
                                                            }}
                                                            rows={3}
                                                            autoFocus
                                                            value={
                                                                editingCell.value
                                                            }
                                                            onChange={(event) =>
                                                                setEditingCell(
                                                                    (
                                                                        current,
                                                                    ) =>
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
                                                    )}

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
        </div>
    )
}
