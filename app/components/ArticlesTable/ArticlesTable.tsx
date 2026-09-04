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
    image_url: string
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
    image_url: '',
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
    const [isUploading, setIsUploading] = useState(false)

    // Вспомогательная функция для удаления файла с сервера
    const deleteStorageFile = async (url: string | null | undefined) => {
        if (!url) return
        try {
            await fetch('/api/admin/storage', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
        } catch (error) {
            console.error('Ошибка при удалении файла с сервера:', error)
        }
    }

    // Сохранение отредактированной ячейки
    const saveCell = async (): Promise<void> => {
        if (!editingCell) return

        const { rowId, columnId, value } = editingCell
        const parsedValue = columnId === 'active' ? value === 'true' : value

        // Находим прежнее значение из состояния таблицы
        const previousRow = articles.find((r) => r.id === rowId)
        const oldValue = previousRow ? previousRow[columnId] : null

        // 1. Обновляем записи в БД
        const response = await fetch('/api/admin/articles', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: rowId,
                columnName: columnId,
                value: parsedValue,
            }),
        })

        if (!response.ok) return

        const result = await response.json()
        if (!result.success) return

        // 2. Обновляем клиентское состояние
        setArticles((current) =>
            current.map((article) =>
                article.id === rowId
                    ? { ...article, [columnId]: parsedValue }
                    : article,
            ),
        )

        // 3. Если это была колонка с картинкой и картинку заменили — удаляем старый файл с сервера
        const isImageColumn =
            columnId === 'preview_image_url' || columnId === 'image_url'

        if (
            isImageColumn &&
            oldValue &&
            typeof oldValue === 'string' &&
            oldValue !== parsedValue
        ) {
            await deleteStorageFile(oldValue)
        }

        setEditingCell(null)
    }

    // Отмена редактирования ячейки
    const cancelCellEditing = async () => {
        if (editingCell) {
            const { rowId, columnId, value } = editingCell
            const isImageColumn =
                columnId === 'preview_image_url' || columnId === 'image_url'

            const previousRow = articles.find((r) => r.id === rowId)
            const oldValue = previousRow ? previousRow[columnId] : null

            // Если в процессе редактирования ячейки загрузили новую картинку, но нажали отмену — удаляем загруженный файл
            if (isImageColumn && value && value !== oldValue) {
                await deleteStorageFile(value)
            }
        }
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

    // Добавление новой статьи
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

        const imageUrlToSend =
            form.preview_image_url.trim() || form.image_url.trim() || null

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
                    preview_image_url: imageUrlToSend,
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

            setForm(initialForm)
            setIsAddFormOpen(false)
        } catch (error) {
            console.error('Ошибка добавления статьи:', error)
            setAddError('Ошибка соединения с сервером')
        } finally {
            setIsAdding(false)
        }
    }

    // Отмена добавления статьи (с удалением картинки, если успели загрузить)
    const handleCancelAdd = async () => {
        if (isAdding) return

        const uploadedUrl = form.image_url || form.preview_image_url
        if (uploadedUrl) {
            await deleteStorageFile(uploadedUrl)
        }

        setForm(initialForm)
        setIsAddFormOpen(false)
        setAddError(null)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/admin/storage', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()
            if (data.url) {
                updateForm('image_url', data.url)
            }
        } catch (err) {
            console.error('Ошибка загрузки файла:', err)
        } finally {
            setIsUploading(false)
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
                            onClick={handleCancelAdd}
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
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={isAdding || isUploading}
                            />

                            {form.image_url && (
                                <input
                                    type="text"
                                    value={form.image_url}
                                    readOnly
                                    placeholder="URL изображения"
                                />
                            )}
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
                            onClick={handleCancelAdd}
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
                                                if (!editable) return

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
                                                    ) : columnId ===
                                                          'image_url' ||
                                                      columnId ===
                                                          'preview_image_url' ? (
                                                        <div
                                                            className={
                                                                styles.imageEditor
                                                            }
                                                        >
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editingCell.value
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingCell(
                                                                        (
                                                                            current,
                                                                        ) =>
                                                                            current
                                                                                ? {
                                                                                      ...current,
                                                                                      value: e
                                                                                          .target
                                                                                          .value,
                                                                                  }
                                                                                : null,
                                                                    )
                                                                }
                                                                placeholder="URL или выберите файл"
                                                            />

                                                            <label
                                                                className={
                                                                    styles.fileUploadBtn
                                                                }
                                                            >
                                                                📁
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    style={{
                                                                        display:
                                                                            'none',
                                                                    }}
                                                                    onChange={async (
                                                                        e,
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0]
                                                                        if (
                                                                            !file
                                                                        )
                                                                            return

                                                                        try {
                                                                            const formData =
                                                                                new FormData()
                                                                            formData.append(
                                                                                'file',
                                                                                file,
                                                                            )

                                                                            const res =
                                                                                await fetch(
                                                                                    '/api/admin/storage',
                                                                                    {
                                                                                        method: 'POST',
                                                                                        body: formData,
                                                                                    },
                                                                                )

                                                                            if (
                                                                                !res.ok
                                                                            )
                                                                                throw new Error(
                                                                                    'Загрузка не удалась',
                                                                                )
                                                                            const data =
                                                                                await res.json()

                                                                            if (
                                                                                data.url
                                                                            ) {
                                                                                setEditingCell(
                                                                                    (
                                                                                        current,
                                                                                    ) =>
                                                                                        current
                                                                                            ? {
                                                                                                  ...current,
                                                                                                  value: data.url,
                                                                                              }
                                                                                            : null,
                                                                                )
                                                                            }
                                                                        } catch (err) {
                                                                            console.error(
                                                                                'Ошибка загрузки:',
                                                                                err,
                                                                            )
                                                                        }
                                                                    }}
                                                                />
                                                            </label>

                                                            {editingCell.value && (
                                                                <button
                                                                    type="button"
                                                                    title="Удалить картинку"
                                                                    onClick={() =>
                                                                        setEditingCell(
                                                                            (
                                                                                current,
                                                                            ) =>
                                                                                current
                                                                                    ? {
                                                                                          ...current,
                                                                                          value: '',
                                                                                      }
                                                                                    : null,
                                                                        )
                                                                    }
                                                                >
                                                                    🗑
                                                                </button>
                                                            )}
                                                        </div>
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
                                                        onClick={
                                                            cancelCellEditing
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
