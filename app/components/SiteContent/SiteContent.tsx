'use client'

import { useState } from 'react'
import styles from './SiteContentManager.module.scss'

export interface SiteContentItem {
    id: number
    entity_name: string
    title: string | null
    description_1: string | null
    description_2: string | null
    description_3: string | null
    price: number | null
    link: string | null
    image: string | null
    is_active: boolean
    created_at?: Date | string
}

interface Props {
    siteContent: SiteContentItem[]
}

export default function SiteContentManager({
    siteContent: initialContent,
}: Props) {
    const [content, setContent] = useState<SiteContentItem[]>(initialContent)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const getSingleItem = (entityName: string): Partial<SiteContentItem> => {
        return (
            content.find((item) => item.entity_name === entityName) || {
                entity_name: entityName,
            }
        )
    }

    const handleSaveSingle = async (
        entityName: string,
        fields: Partial<SiteContentItem>,
    ) => {
        setIsLoading(true)
        setError(null)
        const existing = getSingleItem(entityName)
        const payload = {
            id: existing.id,
            entity_name: entityName,
            is_active: true,
            ...fields,
        }

        try {
            const res = await fetch('/api/admin/site-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                setError('Ошибка при сохранении данных')
                return
            }

            window.location.reload()
        } catch (err) {
            console.error('Ошибка сохранения:', err)
            setError('Ошибка соединения с сервером')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить элемент?')) return
        setError(null)

        try {
            const res = await fetch(`/api/admin/site-content?id=${id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                setContent((prev) => prev.filter((item) => item.id !== id))
            } else {
                setError('Не удалось удалить элемент')
            }
        } catch (err) {
            console.error('Ошибка удаления:', err)
            setError('Ошибка соединения с сервером')
        }
    }

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Управление текстом сайта</h2>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Основная информация</h3>

                <SingleTextForm
                    label="Имя врача (nameDoctor)"
                    item={getSingleItem('nameDoctor')}
                    isLoading={isLoading}
                    onSave={(title) =>
                        handleSaveSingle('nameDoctor', { title })
                    }
                />
                <SingleTextForm
                    label="Профиль / Специализация (profline)"
                    item={getSingleItem('profline')}
                    isLoading={isLoading}
                    onSave={(title) => handleSaveSingle('profline', { title })}
                />
                <SingleTextForm
                    label="Краткое описание (shortDescription)"
                    item={getSingleItem('shortDescription')}
                    isLoading={isLoading}
                    onSave={(title) =>
                        handleSaveSingle('shortDescription', { title })
                    }
                />
                <SingleTextForm
                    label="Полное описание (fullDescription)"
                    item={getSingleItem('fullDescription')}
                    isLoading={isLoading}
                    onSave={(title) =>
                        handleSaveSingle('fullDescription', { title })
                    }
                />
                <SingleTextForm
                    label="Ссылка на сайт (link_site)"
                    item={getSingleItem('link_site')}
                    fieldKey="link"
                    isLoading={isLoading}
                    onSave={(link) => handleSaveSingle('link_site', { link })}
                />
                <MeritsForm
                    item={getSingleItem('merits')}
                    isLoading={isLoading}
                    onSave={(data) => handleSaveSingle('merits', data)}
                />
            </div>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Списочные блоки</h3>

                <ListTableSection
                    title="Детали (details)"
                    entityName="details"
                    items={content.filter((i) => i.entity_name === 'details')}
                    onDelete={handleDelete}
                    setError={setError}
                />
                <ListTableSection
                    title="Обо мне (aboutMe)"
                    entityName="aboutMe"
                    items={content.filter((i) => i.entity_name === 'aboutMe')}
                    onDelete={handleDelete}
                    setError={setError}
                />
                <ListTableSection
                    title="Принципы (principies)"
                    entityName="principies"
                    items={content.filter(
                        (i) => i.entity_name === 'principies',
                    )}
                    onDelete={handleDelete}
                    setError={setError}
                />
                <ListTableSection
                    title="Образование (education)"
                    entityName="education"
                    items={content.filter((i) => i.entity_name === 'education')}
                    onDelete={handleDelete}
                    setError={setError}
                />
                <ListTableSection
                    title="С чем помогу (ihelp)"
                    entityName="ihelp"
                    hasDescriptions
                    items={content.filter((i) => i.entity_name === 'ihelp')}
                    onDelete={handleDelete}
                    setError={setError}
                />
                {/* НОВЫЙ БЛОК УСЛУГ */}
                <ServicesTableSection
                    items={content.filter((i) => i.entity_name === 'services')}
                    onDelete={handleDelete}
                    setError={setError}
                />
            </div>
        </section>
    )
}

// --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ЗАГРУЗКИ В RELAXDEV STORAGE ---
async function uploadToRelaxDevStorage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    // Запрос на эндпоинт загрузки (RelaxDev Storage)
    const response = await fetch('/api/admin/storage', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения в RelaxDev Storage')
    }

    const data = await response.json()
    // Возвращаем прямую ссылку на файл (url / fileUrl)
    return data.url || data.fileUrl
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФОРМЫ ---

function SingleTextForm({
    label,
    item,
    fieldKey = 'title',
    isLoading,
    onSave,
}: {
    label: string
    item: Partial<SiteContentItem>
    fieldKey?: 'title' | 'link'
    isLoading: boolean
    onSave: (val: string) => void
}) {
    const [val, setVal] = useState(item[fieldKey] || '')

    return (
        <div className={styles.addForm}>
            <div className={styles.addForm__buttons}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {label}:
                </label>
                <input
                    type="text"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                />
                <button
                    type="button"
                    className={styles.addButton}
                    disabled={isLoading}
                    onClick={() => onSave(val)}
                >
                    Сохранить
                </button>
            </div>
        </div>
    )
}

function MeritsForm({
    item,
    isLoading,
    onSave,
}: {
    item: Partial<SiteContentItem>
    isLoading: boolean
    onSave: (data: Partial<SiteContentItem>) => void
}) {
    const [d1, setD1] = useState(item.description_1 || '')
    const [d2, setD2] = useState(item.description_2 || '')
    const [d3, setD3] = useState(item.description_3 || '')

    return (
        <div
            className={styles.addForm}
            style={{ flexDirection: 'column', gap: '8px' }}
        >
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Заслуги / Достижения (merits)
            </span>
            <div className={styles.addForm__buttons}>
                <input
                    placeholder="Описание 1"
                    value={d1}
                    onChange={(e) => setD1(e.target.value)}
                />
                <input
                    placeholder="Описание 2"
                    value={d2}
                    onChange={(e) => setD2(e.target.value)}
                />
                <input
                    placeholder="Описание 3"
                    value={d3}
                    onChange={(e) => setD3(e.target.value)}
                />
                <button
                    type="button"
                    className={styles.addButton}
                    disabled={isLoading}
                    onClick={() =>
                        onSave({
                            description_1: d1,
                            description_2: d2,
                            description_3: d3,
                        })
                    }
                >
                    Сохранить
                </button>
            </div>
        </div>
    )
}

function ListTableSection({
    title,
    entityName,
    items,
    hasDescriptions = false,
    onDelete,
    setError,
}: {
    title: string
    entityName: string
    items: SiteContentItem[]
    hasDescriptions?: boolean
    onDelete: (id: number) => void
    setError: (msg: string | null) => void
}) {
    const [isAdding, setIsAdding] = useState(false)
    const [titleVal, setTitleVal] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [d1, setD1] = useState('')
    const [d2, setD2] = useState('')
    const [d3, setD3] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleAdd = async () => {
        if (!titleVal) {
            setError('Введите заголовок')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            let imageUrl: string | null = null

            // 1. Загружаем картинку в RelaxDev Storage, если она выбрана
            if (imageFile) {
                imageUrl = await uploadToRelaxDevStorage(imageFile)
            }

            // 2. Отправляем в БД уже готовую ссылку
            const res = await fetch('/api/admin/site-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    entity_name: entityName,
                    title: titleVal,
                    image: imageUrl, // Передаётся ссылка из Storage
                    description_1: d1 || null,
                    description_2: d2 || null,
                    description_3: d3 || null,
                    is_active: true,
                }),
            })

            if (res.ok) {
                window.location.reload()
            } else {
                setError('Ошибка при сохранении элемента')
            }
        } catch (err: unknown) {
            console.error('Ошибка добавления:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Ошибка соединения с сервером',
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '16px',
            }}
        >
            <div className={styles.header}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h4>
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => setIsAdding((prev) => !prev)}
                >
                    {isAdding ? 'Отмена' : 'Добавить элемент'}
                </button>
            </div>

            {isAdding && (
                <div className={styles.addForm}>
                    <div
                        className={styles.addForm__buttons}
                        style={{ flexWrap: 'wrap' }}
                    >
                        <input
                            placeholder="Заголовок"
                            value={titleVal}
                            onChange={(e) => setTitleVal(e.target.value)}
                        />

                        {/* Выбор файла вместо текстовой ссылки */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImageFile(e.target.files?.[0] || null)
                            }
                        />

                        {hasDescriptions && (
                            <>
                                <input
                                    placeholder="Описание 1"
                                    value={d1}
                                    onChange={(e) => setD1(e.target.value)}
                                />
                                <input
                                    placeholder="Описание 2"
                                    value={d2}
                                    onChange={(e) => setD2(e.target.value)}
                                />
                                <input
                                    placeholder="Описание 3"
                                    value={d3}
                                    onChange={(e) => setD3(e.target.value)}
                                />
                            </>
                        )}
                        <button
                            type="button"
                            className={styles.addForm__buttons_add}
                            disabled={isLoading || !titleVal}
                            onClick={handleAdd}
                        >
                            {isLoading ? 'Загрузка...' : 'Добавить'}
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Заголовок</th>
                            <th>Картинка</th>
                            {hasDescriptions && <th>Описания</th>}
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={hasDescriptions ? 5 : 4}
                                    style={{ textAlign: 'center' }}
                                >
                                    Нет данных
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.title ?? '—'}</td>
                                    <td>
                                        {item.image ? (
                                            <a
                                                href={item.image}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.title || ''}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    {hasDescriptions && (
                                        <td>
                                            <small>
                                                {[
                                                    item.description_1,
                                                    item.description_2,
                                                    item.description_3,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' | ') || '—'}
                                            </small>
                                        </td>
                                    )}
                                    <td>
                                        <div className={styles.editor}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(item.id)
                                                }
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
// --- НОВЫЙ БЛОК ДЛЯ УСЛУГ (SERVICES) ---
function ServicesTableSection({
    items,
    onDelete,
    setError,
}: {
    items: SiteContentItem[]
    onDelete: (id: number) => void
    setError: (msg: string | null) => void
}) {
    const [isAdding, setIsAdding] = useState(false)
    const [titleVal, setTitleVal] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [d1, setD1] = useState('')
    const [d2, setD2] = useState('')
    const [d3, setD3] = useState('')
    const [linkVal, setLinkVal] = useState('')
    const [priceVal, setPriceVal] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const handleAdd = async () => {
        if (!titleVal) {
            setError('Введите название услуги')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            let imageUrl: string | null = null

            if (imageFile) {
                imageUrl = await uploadToRelaxDevStorage(imageFile)
            }

            const res = await fetch('/api/admin/site-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    entity_name: 'services',
                    title: titleVal,
                    image: imageUrl,
                    description_1: d1 || null,
                    description_2: d2 || null,
                    description_3: d3 || null,
                    link: linkVal || null,
                    price: priceVal ? Number(priceVal) : null,
                    is_active: isActive,
                }),
            })

            if (res.ok) {
                window.location.reload()
            } else {
                setError('Ошибка при сохранении услуги')
            }
        } catch (err: unknown) {
            console.error('Ошибка добавления услуги:', err)

            setError(
                err instanceof Error
                    ? err.message
                    : 'Ошибка соединения с сервером',
            )
        } finally {
            setIsLoading(false)
        }
    }

    // Обработчик для изменения статуса is_active на лету
    const handleToggleActive = async (item: SiteContentItem) => {
        try {
            const res = await fetch('/api/admin/site-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...item,
                    is_active: !item.is_active,
                }),
            })
            if (res.ok) {
                window.location.reload()
            } else {
                setError('Ошибка при обновлении статуса')
            }
        } catch (err) {
            console.error('Ошибка при обновлении статуса:', err)
            setError('Ошибка соединения с сервером')
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '16px',
            }}
        >
            <div className={styles.header}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    Услуги (services)
                </h4>
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => setIsAdding((prev) => !prev)}
                >
                    {isAdding ? 'Отмена' : 'Добавить услугу'}
                </button>
            </div>

            {isAdding && (
                <div className={styles.addForm}>
                    <div
                        className={styles.addForm__buttons}
                        style={{ flexWrap: 'wrap' }}
                    >
                        <input
                            placeholder="Название услуги (title)"
                            value={titleVal}
                            onChange={(e) => setTitleVal(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImageFile(e.target.files?.[0] || null)
                            }
                        />
                        <textarea
                            rows={3}
                            placeholder="Описание 1"
                            value={d1}
                            onChange={(e) => setD1(e.target.value)}
                        />
                        <textarea
                            rows={3}
                            placeholder="Описание 2"
                            value={d2}
                            onChange={(e) => setD2(e.target.value)}
                        />
                        <textarea
                            rows={3}
                            placeholder="Описание 3"
                            value={d3}
                            onChange={(e) => setD3(e.target.value)}
                        />
                        <input
                            placeholder="Ссылка (link)"
                            value={linkVal}
                            onChange={(e) => setLinkVal(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Цена (price)"
                            value={priceVal}
                            onChange={(e) => setPriceVal(e.target.value)}
                        />
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.9rem',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                            Активно (is_active)
                        </label>

                        <button
                            type="button"
                            className={styles.addForm__buttons_add}
                            disabled={isLoading || !titleVal}
                            onClick={handleAdd}
                        >
                            {isLoading ? 'Загрузка...' : 'Добавить'}
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Услуга / Изображение</th>
                            <th>Детали (Описания, Ссылка, Цена)</th>
                            <th>Активность</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center' }}>
                                    Нет данных
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>
                                        <strong
                                            style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {item.title ?? '—'}
                                        </strong>
                                        {item.image ? (
                                            <a
                                                href={item.image}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.title || ''}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    <td>
                                        <small
                                            style={{
                                                display: 'block',
                                                marginBottom: '4px',
                                            }}
                                        >
                                            <strong>Описания: </strong>
                                            {[
                                                item.description_1,
                                                item.description_2,
                                                item.description_3,
                                            ]
                                                .filter(Boolean)
                                                .join(' | ') || '—'}
                                        </small>
                                        <small
                                            style={{
                                                display: 'block',
                                                marginBottom: '4px',
                                            }}
                                        >
                                            <strong>Ссылка: </strong>
                                            {item.link ?? '—'}
                                        </small>
                                        <small style={{ display: 'block' }}>
                                            <strong>Цена: </strong>
                                            {item.price ?? '—'}
                                        </small>
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item.is_active}
                                            onChange={() =>
                                                handleToggleActive(item)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td>
                                        <div className={styles.editor}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(item.id)
                                                }
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
