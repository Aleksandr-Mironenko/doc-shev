'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table'

import { useState } from 'react'

import type { Article } from '@/app/components/AdminPage/AdminPage'

import styles from './ArticlesTable.module.scss'

interface ArticlesTableProps {
    articles: Article[]
}

interface EditingCell {
    rowId: number
    columnId: keyof Article
    value: string
}

interface AddArticleForm {
    title: string
    description: string
    full_description: string
    preview_image_url: string
    external_link: string
    comment: string
    active: boolean
}

const columns: ColumnDef<Article>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'active',
        header: 'Активна',
        cell: (info) => (info.getValue<boolean>() ? 'Да' : 'Нет'),
    },
    {
        accessorKey: 'title',
        header: 'Название',
    },
    {
        accessorKey: 'description',
        header: 'Описание',
    },
    {
        accessorKey: 'full_description',
        header: 'Полное описание',
    },
    {
        accessorKey: 'preview_image_url',
        header: 'Изображение',
    },
    {
        accessorKey: 'external_link',
        header: 'Ссылка',
    },
    {
        accessorKey: 'comment',
        header: 'Комментарий',
    },

    {
        accessorKey: 'created_at',
        header: 'Создана',
    },
]

const initialForm: AddArticleForm = {
    title: '',
    description: '',
    full_description: '',
    preview_image_url: '',
    external_link: '',
    comment: '',
    active: false,
}

export default function ArticlesTable({
    articles: initialArticles,
}: ArticlesTableProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles)

    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)

    const [isAddFormOpen, setIsAddFormOpen] = useState(false)

    const [form, setForm] = useState<AddArticleForm>(initialForm)

    const [isAdding, setIsAdding] = useState(false)

    const [addError, setAddError] = useState<string | null>(null)

    const saveCell = async (): Promise<void> => {
        if (!editingCell) {
            return
        }

        const { rowId, columnId, value } = editingCell

        const parsedValue = columnId === 'active' ? value === 'true' : value

        const response = await fetch('/api/admin/articles', {
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

        setArticles((current) =>
            current.map((article) =>
                article.id === rowId
                    ? {
                          ...article,
                          [columnId]: parsedValue,
                      }
                    : article,
            ),
        )

        setEditingCell(null)
    }

    const updateForm = (
        field: keyof AddArticleForm,
        value: string | boolean,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    const addArticle = async (): Promise<void> => {
        setAddError(null)

        if (!form.title.trim()) {
            setAddError('Введите название статьи')
            return
        }

        if (!form.description.trim()) {
            setAddError('Введите описание статьи')
            return
        }

        try {
            setIsAdding(true)

            const response = await fetch('/api/admin/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    full_description: form.full_description.trim() || null,
                    preview_image_url: form.preview_image_url.trim() || null,
                    external_link: form.external_link.trim() || null,
                    comment: form.comment.trim() || null,
                    active: form.active,
                }),
            })

            const result: {
                success: boolean
                id?: number
                message?: string
            } = await response.json()

            if (!response.ok || !result.success) {
                setAddError(result.message || 'Не удалось добавить статью')

                return
            }

            /*
             * API возвращает только id.
             *
             * Поэтому здесь не пытаемся вручную
             * добавлять полноценную Article в таблицу.
             *
             * После успешного POST просто закрываем форму.
             * Если AdminPage повторно получает articles
             * с сервера — новая статья появится после
             * обновления данных.
             */
            setForm(initialForm)

            setIsAddFormOpen(false)
        } catch (error) {
            console.error('Ошибка добавления статьи:', error)

            setAddError('Ошибка соединения с сервером')
        } finally {
            setIsAdding(false)
        }
    }

    const table = useReactTable({
        data: articles,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Статьи</h2>

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => {
                        setAddError(null)
                        setIsAddFormOpen(true)
                    }}
                >
                    + Добавить статью
                </button>
            </div>

            {isAddFormOpen && (
                <div className={styles.addForm}>
                    <div className={styles.addFormHeader}>
                        <h3 className={styles.addFormTitle}>
                            Добавление статьи
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

                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span>Название *</span>

                            <input
                                type="text"
                                value={form.title}
                                onChange={(event) =>
                                    updateForm('title', event.target.value)
                                }
                                placeholder="Название статьи"
                                disabled={isAdding}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Описание *</span>

                            <textarea
                                value={form.description}
                                onChange={(event) =>
                                    updateForm(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                placeholder="Краткое описание"
                                disabled={isAdding}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Полное описание</span>

                            <textarea
                                value={form.full_description}
                                onChange={(event) =>
                                    updateForm(
                                        'full_description',
                                        event.target.value,
                                    )
                                }
                                placeholder="Полное описание статьи"
                                disabled={isAdding}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Изображение</span>

                            <input
                                type="text"
                                value={form.preview_image_url}
                                onChange={(event) =>
                                    updateForm(
                                        'preview_image_url',
                                        event.target.value,
                                    )
                                }
                                placeholder="URL изображения"
                                disabled={isAdding}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Внешняя ссылка</span>

                            <input
                                type="text"
                                value={form.external_link}
                                onChange={(event) =>
                                    updateForm(
                                        'external_link',
                                        event.target.value,
                                    )
                                }
                                placeholder="https://..."
                                disabled={isAdding}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Комментарий</span>

                            <textarea
                                value={form.comment}
                                onChange={(event) =>
                                    updateForm('comment', event.target.value)
                                }
                                placeholder="Комментарий"
                                disabled={isAdding}
                            />
                        </label>

                        <label className={styles.checkboxField}>
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={(event) =>
                                    updateForm('active', event.target.checked)
                                }
                                disabled={isAdding}
                            />

                            <span>Статья активна</span>
                        </label>
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
                            onClick={addArticle}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Добавление...' : 'Добавить статью'}
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
                                        .id as keyof Article

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
