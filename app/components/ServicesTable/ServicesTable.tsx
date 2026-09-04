// 'use client'

// import {
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
//     type ColumnDef,
// } from '@tanstack/react-table'

// import { useState } from 'react'

// // Подключите ваши стили. Если они в отдельном файле, укажите правильный путь,
// // например: import styles from './ServicesTable.module.scss'
// import styles from './ServicesTable.module.scss'

// export interface Services {
//     id: number
//     entity_name: string
//     title: string | null
//     description_1: string | null
//     description_2: string | null
//     description_3: string | null
//     price: number | null
//     link: string | null
//     image: string | null
//     is_active: boolean
//     created_at?: Date | string
// }

// interface ServicesTableProps {
//     services: Services[]
// }

// interface EditingCell {
//     rowId: number
//     columnId: keyof Services
//     value: string
// }

// interface AddServiceForm {
//     title: string
//     description_1: string
//     description_2: string
//     description_3: string
//     link: string
//     price: string
//     is_active: boolean
//     image: string
// }

// const columns: ColumnDef<Services>[] = [
//     { accessorKey: 'id', header: 'ID' },
//     {
//         accessorKey: 'is_active',
//         header: 'Активна',
//         cell: (info) => (info.getValue<boolean>() ? 'Да' : 'Нет'),
//     },
//     { accessorKey: 'title', header: 'Название' },
//     {
//         accessorKey: 'image',
//         header: 'Изображение',
//         cell: (info) => {
//             const val = info.getValue<string | null>()
//             return val ? (
//                 <a href={val} target="_blank" rel="noreferrer">
//                     Смотреть
//                 </a>
//             ) : (
//                 '—'
//             )
//         },
//     },
//     { accessorKey: 'description_1', header: 'Описание 1' },
//     { accessorKey: 'description_2', header: 'Описание 2' },
//     { accessorKey: 'description_3', header: 'Описание 3' },
//     { accessorKey: 'link', header: 'Ссылка' },
//     { accessorKey: 'price', header: 'Цена' },
//     {
//         id: 'actions',
//         header: 'Действия',
//     },
// ]

// const initialForm: AddServiceForm = {
//     title: '',
//     description_1: '',
//     description_2: '',
//     description_3: '',
//     link: '',
//     price: '',
//     is_active: true,
//     image: '',
// }

// export default function ServicesTable({
//     services: initialServices,
// }: ServicesTableProps) {
//     const [servicesList, setServicesList] = useState<SiteContentItem[]>(
//         initialServices.filter((s) => s.entity_name === 'services'),
//     )
//     const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
//     const [isAddFormOpen, setIsAddFormOpen] = useState(false)
//     const [form, setForm] = useState<AddServiceForm>(initialForm)
//     const [isAdding, setIsAdding] = useState(false)
//     const [addError, setAddError] = useState<string | null>(null)
//     const [isUploading, setIsUploading] = useState(false)

//     // Вспомогательная функция для удаления файла с сервера[cite: 3]
//     const deleteStorageFile = async (url: string | null | undefined) => {
//         if (!url) return
//         try {
//             await fetch('/api/admin/storage', {
//                 method: 'DELETE',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ url }),
//             })
//         } catch (error) {
//             console.error('Ошибка при удалении файла с сервера:', error)
//         }
//     }

//     // Сохранение отредактированной ячейки[cite: 3]
//     const saveCell = async (): Promise<void> => {
//         if (!editingCell) return

//         const { rowId, columnId, value } = editingCell

//         // Парсим значение в зависимости от типа колонки
//         let parsedValue: string | boolean | number | null = value
//         if (columnId === 'is_active') parsedValue = value === 'true'
//         if (columnId === 'price') parsedValue = value ? Number(value) : null

//         const previousRow = servicesList.find((r) => r.id === rowId)
//         if (!previousRow) return

//         const oldValue = previousRow[columnId]

//         // Подготавливаем полный объект для /api/admin/site-content (в SiteContent используется POST для апдейта)[cite: 5]
//         const updatedRow = {
//             ...previousRow,
//             [columnId]: parsedValue === '' ? null : parsedValue,
//         }

//         try {
//             const response = await fetch('/api/admin/site-content', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(updatedRow),
//             })

//             if (!response.ok) throw new Error('Ошибка обновления')

//             // Обновляем локальное состояние[cite: 3]
//             setServicesList((current) =>
//                 current.map((item) => (item.id === rowId ? updatedRow : item)),
//             )

//             // Если картинку заменили — удаляем старый файл[cite: 3]
//             if (
//                 columnId === 'image' &&
//                 oldValue &&
//                 typeof oldValue === 'string' &&
//                 oldValue !== parsedValue
//             ) {
//                 await deleteStorageFile(oldValue)
//             }
//         } catch (err) {
//             console.error('Ошибка при сохранении ячейки:', err)
//         } finally {
//             setEditingCell(null)
//         }
//     }

//     // Отмена редактирования ячейки[cite: 3]
//     const cancelCellEditing = async () => {
//         if (editingCell) {
//             const { rowId, columnId, value } = editingCell
//             const previousRow = servicesList.find((r) => r.id === rowId)
//             const oldValue = previousRow ? previousRow[columnId] : null

//             // Если загрузили новую картинку, но нажали отмену — удаляем загруженный файл[cite: 3]
//             if (columnId === 'image' && value && value !== oldValue) {
//                 await deleteStorageFile(value)
//             }
//         }
//         setEditingCell(null)
//     }

//     const updateForm = (
//         field: keyof AddServiceForm,
//         value: string | boolean,
//     ) => {
//         setForm((current) => ({
//             ...current,
//             [field]: value,
//         }))
//     }

//     // Обработка загрузки файла для формы[cite: 3]
//     const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (!file) return

//         try {
//             setIsUploading(true)
//             const formData = new FormData()
//             formData.append('file', file)

//             const res = await fetch('/api/admin/storage', {
//                 method: 'POST',
//                 body: formData,
//             })

//             const data = await res.json()
//             if (data.url || data.fileUrl) {
//                 updateForm('image', data.url || data.fileUrl)
//             }
//         } catch (err) {
//             console.error('Ошибка загрузки файла:', err)
//         } finally {
//             setIsUploading(false)
//         }
//     }

//     // Добавление новой услуги[cite: 5]
//     const addService = async (): Promise<void> => {
//         setAddError(null)

//         if (!form.title.trim()) {
//             setAddError('Введите название услуги')
//             return
//         }

//         try {
//             setIsAdding(true)

//             const response = await fetch('/api/admin/site-content', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     entity_name: 'services',
//                     title: form.title.trim(),
//                     description_1: form.description_1.trim() || null,
//                     description_2: form.description_2.trim() || null,
//                     description_3: form.description_3.trim() || null,
//                     image: form.image.trim() || null,
//                     link: form.link.trim() || null,
//                     price: form.price ? Number(form.price) : null,
//                     is_active: form.is_active,
//                 }),
//             })

//             if (!response.ok) {
//                 setAddError('Не удалось добавить услугу')
//                 return
//             }

//             // В идеале возвращать добавленный объект с ID из API.
//             // Пока просто перезагружаем страницу или можно сделать fetch всех данных.
//             window.location.reload()
//         } catch (error) {
//             console.error('Ошибка добавления услуги:', error)
//             setAddError('Ошибка соединения с сервером')
//         } finally {
//             setIsAdding(false)
//         }
//     }

//     // Отмена добавления[cite: 3]
//     const handleCancelAdd = async () => {
//         if (isAdding) return

//         if (form.image) {
//             await deleteStorageFile(form.image)
//         }

//         setForm(initialForm)
//         setIsAddFormOpen(false)
//         setAddError(null)
//     }

//     // Удаление услуги[cite: 5]
//     const handleDeleteService = async (id: number) => {
//         if (!confirm('Удалить услугу?')) return
//         try {
//             const res = await fetch(`/api/admin/site-content?id=${id}`, {
//                 method: 'DELETE',
//             })
//             if (res.ok) {
//                 setServicesList((prev) => prev.filter((item) => item.id !== id))
//             } else {
//                 alert('Не удалось удалить элемент')
//             }
//         } catch (err) {
//             console.error('Ошибка удаления:', err)
//         }
//     }

//     const table = useReactTable({
//         data: servicesList,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//     })

//     return (
//         <div className={styles.wrapper}>
//             <div className={styles.header}>
//                 <h2 className={styles.title}>Услуги (Services)</h2>

//                 <button
//                     type="button"
//                     className={styles.addButton}
//                     onClick={() => {
//                         setAddError(null)
//                         setIsAddFormOpen(true)
//                     }}
//                 >
//                     + Добавить услугу
//                 </button>
//             </div>

//             {isAddFormOpen && (
//                 <div className={styles.addForm}>
//                     <div className={styles.addFormHeader}>
//                         <h3 className={styles.addFormTitle}>
//                             Добавление услуги
//                         </h3>

//                         <button
//                             type="button"
//                             className={styles.closeButton}
//                             onClick={handleCancelAdd}
//                         >
//                             ✕
//                         </button>
//                     </div>

//                     <div className={styles.formGrid}>
//                         <label className={styles.field}>
//                             <span>Название *</span>
//                             <input
//                                 type="text"
//                                 value={form.title}
//                                 onChange={(e) =>
//                                     updateForm('title', e.target.value)
//                                 }
//                                 placeholder="Название услуги"
//                                 disabled={isAdding}
//                             />
//                         </label>

//                         <label className={styles.field}>
//                             <span>Изображение</span>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileUpload}
//                                 disabled={isAdding || isUploading}
//                             />
//                             {form.image && (
//                                 <input
//                                     type="text"
//                                     value={form.image}
//                                     readOnly
//                                     placeholder="URL изображения"
//                                 />
//                             )}
//                         </label>

//                         <label className={styles.field}>
//                             <span>Описание 1</span>
//                             <textarea
//                                 value={form.description_1}
//                                 onChange={(e) =>
//                                     updateForm('description_1', e.target.value)
//                                 }
//                                 placeholder="Краткое описание"
//                                 disabled={isAdding}
//                             />
//                         </label>

//                         <label className={styles.field}>
//                             <span>Описание 2</span>
//                             <textarea
//                                 value={form.description_2}
//                                 onChange={(e) =>
//                                     updateForm('description_2', e.target.value)
//                                 }
//                                 placeholder="Дополнительное описание"
//                                 disabled={isAdding}
//                             />
//                         </label>

//                         <label className={styles.field}>
//                             <span>Описание 3</span>
//                             <textarea
//                                 value={form.description_3}
//                                 onChange={(e) =>
//                                     updateForm('description_3', e.target.value)
//                                 }
//                                 placeholder="Детали"
//                                 disabled={isAdding}
//                             />
//                         </label>

//                         <label className={styles.field}>
//                             <span>Ссылка</span>
//                             <input
//                                 type="text"
//                                 value={form.link}
//                                 onChange={(e) =>
//                                     updateForm('link', e.target.value)
//                                 }
//                                 placeholder="https://..."
//                                 disabled={isAdding}
//                             />
//                         </label>

//                         <label className={styles.field}>
//                             <span>Цена</span>
//                             <input
//                                 type="number"
//                                 value={form.price}
//                                 onChange={(e) =>
//                                     updateForm('price', e.target.value)
//                                 }
//                                 placeholder="0"
//                                 disabled={isAdding}
//                             />
//                         </label>

//                         <label className={styles.checkboxField}>
//                             <input
//                                 type="checkbox"
//                                 checked={form.is_active}
//                                 onChange={(e) =>
//                                     updateForm('is_active', e.target.checked)
//                                 }
//                                 disabled={isAdding}
//                             />
//                             <span>Услуга активна (отображается на сайте)</span>
//                         </label>
//                     </div>

//                     {addError && <div className={styles.error}>{addError}</div>}

//                     <div className={styles.formActions}>
//                         <button
//                             type="button"
//                             className={styles.cancelButton}
//                             onClick={handleCancelAdd}
//                             disabled={isAdding}
//                         >
//                             Отмена
//                         </button>

//                         <button
//                             type="button"
//                             className={styles.saveButton}
//                             onClick={addService}
//                             disabled={isAdding}
//                         >
//                             {isAdding ? 'Добавление...' : 'Добавить услугу'}
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className={styles.tableWrapper}>
//                 <table className={styles.table}>
//                     <thead>
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <tr key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => (
//                                     <th key={header.id}>
//                                         {flexRender(
//                                             header.column.columnDef.header,
//                                             header.getContext(),
//                                         )}
//                                     </th>
//                                 ))}
//                             </tr>
//                         ))}
//                     </thead>

//                     <tbody>
//                         {table.getRowModel().rows.map((row) => (
//                             <tr key={row.original.id}>
//                                 {row.getVisibleCells().map((cell) => {
//                                     const columnId = cell.column.id as
//                                         | keyof SiteContentItem
//                                         | 'actions'

//                                     if (columnId === 'actions') {
//                                         return (
//                                             <td key={cell.id}>
//                                                 <button
//                                                     className={
//                                                         styles.cancelButton
//                                                     }
//                                                     style={{
//                                                         color: '#dc2626',
//                                                         padding: '4px 8px',
//                                                     }}
//                                                     onClick={() =>
//                                                         handleDeleteService(
//                                                             row.original.id,
//                                                         )
//                                                     }
//                                                 >
//                                                     Удалить
//                                                 </button>
//                                             </td>
//                                         )
//                                     }

//                                     const editable =
//                                         columnId !== 'id' &&
//                                         columnId !== 'created_at'
//                                     const isEditing =
//                                         editingCell?.rowId ===
//                                             row.original.id &&
//                                         editingCell?.columnId === columnId

//                                     return (
//                                         <td
//                                             key={cell.id}
//                                             className={
//                                                 editable
//                                                     ? styles.editable
//                                                     : undefined
//                                             }
//                                             onDoubleClick={() => {
//                                                 if (!editable) return

//                                                 const raw = cell.getValue<
//                                                     | string
//                                                     | boolean
//                                                     | number
//                                                     | null
//                                                 >()
//                                                 const value =
//                                                     typeof raw === 'boolean' ||
//                                                     typeof raw === 'number'
//                                                         ? String(raw)
//                                                         : (raw ?? '')

//                                                 setEditingCell({
//                                                     rowId: row.original.id,
//                                                     columnId,
//                                                     value,
//                                                 })
//                                             }}
//                                         >
//                                             {isEditing ? (
//                                                 <div className={styles.editor}>
//                                                     {columnId ===
//                                                     'is_active' ? (
//                                                         <select
//                                                             autoFocus
//                                                             value={
//                                                                 editingCell.value
//                                                             }
//                                                             onChange={(e) =>
//                                                                 setEditingCell(
//                                                                     (curr) =>
//                                                                         curr
//                                                                             ? {
//                                                                                   ...curr,
//                                                                                   value: e
//                                                                                       .target
//                                                                                       .value,
//                                                                               }
//                                                                             : null,
//                                                                 )
//                                                             }
//                                                         >
//                                                             <option value="true">
//                                                                 Да
//                                                             </option>
//                                                             <option value="false">
//                                                                 Нет
//                                                             </option>
//                                                         </select>
//                                                     ) : columnId === 'image' ? (
//                                                         <div
//                                                             className={
//                                                                 styles.imageEditor
//                                                             }
//                                                         >
//                                                             <input
//                                                                 type="text"
//                                                                 value={
//                                                                     editingCell.value
//                                                                 }
//                                                                 onChange={(e) =>
//                                                                     setEditingCell(
//                                                                         (
//                                                                             curr,
//                                                                         ) =>
//                                                                             curr
//                                                                                 ? {
//                                                                                       ...curr,
//                                                                                       value: e
//                                                                                           .target
//                                                                                           .value,
//                                                                                   }
//                                                                                 : null,
//                                                                     )
//                                                                 }
//                                                                 placeholder="URL или файл"
//                                                             />
//                                                             <label
//                                                                 className={
//                                                                     styles.fileUploadBtn
//                                                                 }
//                                                             >
//                                                                 📁
//                                                                 <input
//                                                                     type="file"
//                                                                     accept="image/*"
//                                                                     style={{
//                                                                         display:
//                                                                             'none',
//                                                                     }}
//                                                                     onChange={async (
//                                                                         e,
//                                                                     ) => {
//                                                                         const file =
//                                                                             e
//                                                                                 .target
//                                                                                 .files?.[0]
//                                                                         if (
//                                                                             !file
//                                                                         )
//                                                                             return
//                                                                         try {
//                                                                             const formData =
//                                                                                 new FormData()
//                                                                             formData.append(
//                                                                                 'file',
//                                                                                 file,
//                                                                             )
//                                                                             const res =
//                                                                                 await fetch(
//                                                                                     '/api/admin/storage',
//                                                                                     {
//                                                                                         method: 'POST',
//                                                                                         body: formData,
//                                                                                     },
//                                                                                 )
//                                                                             const data =
//                                                                                 await res.json()
//                                                                             if (
//                                                                                 data.url ||
//                                                                                 data.fileUrl
//                                                                             ) {
//                                                                                 setEditingCell(
//                                                                                     (
//                                                                                         curr,
//                                                                                     ) =>
//                                                                                         curr
//                                                                                             ? {
//                                                                                                   ...curr,
//                                                                                                   value:
//                                                                                                       data.url ||
//                                                                                                       data.fileUrl,
//                                                                                               }
//                                                                                             : null,
//                                                                                 )
//                                                                             }
//                                                                         } catch (err) {
//                                                                             console.error(
//                                                                                 'Ошибка:',
//                                                                                 err,
//                                                                             )
//                                                                         }
//                                                                     }}
//                                                                 />
//                                                             </label>
//                                                         </div>
//                                                     ) : (
//                                                         <textarea
//                                                             autoFocus
//                                                             value={
//                                                                 editingCell.value
//                                                             }
//                                                             onChange={(e) =>
//                                                                 setEditingCell(
//                                                                     (curr) =>
//                                                                         curr
//                                                                             ? {
//                                                                                   ...curr,
//                                                                                   value: e
//                                                                                       .target
//                                                                                       .value,
//                                                                               }
//                                                                             : null,
//                                                                 )
//                                                             }
//                                                             rows={2}
//                                                         />
//                                                     )}
//                                                     <button
//                                                         type="button"
//                                                         onClick={saveCell}
//                                                     >
//                                                         ✓
//                                                     </button>
//                                                     <button
//                                                         type="button"
//                                                         onClick={
//                                                             cancelCellEditing
//                                                         }
//                                                     >
//                                                         ✕
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 flexRender(
//                                                     cell.column.columnDef.cell,
//                                                     cell.getContext(),
//                                                 )
//                                             )}
//                                         </td>
//                                     )
//                                 })}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     )
// }

'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table'

import { useState } from 'react'

// Подключите ваши стили. Если они в отдельном файле, укажите правильный путь,
// например: import styles from './ServicesTable.module.scss'
import styles from './ServicesTable.module.scss'

// export interface Services {
//     id: number
//     entity_name: string
//     title: string | null
//     description_1: string | null
//     description_1_name: string | null
//     description_2: string | null
//     description_2_name: string | null
//     description_3: string | null
//     description_3_name: string | null
//     description_4: string | null
//     description_4_name: string | null
//     description_5: string | null
//     description_5_name: string | null
//     price: number | null
//     link: string | null
//     image: string | null
//     is_check: boolean
//     is_active: boolean
//     created_at?: Date | string
// }
export interface Services {
    id: number
    title: string
    description_1?: string | null
    description_1_name?: string | null
    description_2?: string | null
    description_2_name?: string | null
    description_3?: string | null
    description_3_name?: string | null
    description_4?: string | null
    description_4_name?: string | null
    description_5?: string | null
    description_5_name?: string | null
    link:
        | 'consult-video-follow-up'
        | 'consult-video'
        | 'consult-doctor'
        | 'сonsult-audio-follow-up'
        | 'consult-audio'
    is_check: boolean
    is_active?: boolean | null
    price: number
    image?: string | null
    created_at: Date | string
}
interface ServicesTableProps {
    services: Services[]
}

interface EditingCell {
    rowId: number
    columnId: keyof Services
    value: string
}

interface AddServiceForm {
    title: string
    description_1: string
    description_1_name: string
    description_2: string
    description_2_name: string
    description_3: string
    description_3_name: string
    description_4: string
    description_4_name: string
    description_5: string
    description_5_name: string
    link:
        | 'consult-video-follow-up'
        | 'consult-video'
        | 'consult-doctor'
        | 'сonsult-audio-follow-up'
        | 'consult-audio'
    price: string
    is_active: boolean
    is_check: boolean
    image: string
}

const columns: ColumnDef<Services>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
        accessorKey: 'is_active',
        header: 'Активна',
        cell: (info) => (info.getValue<boolean>() ? 'Да' : 'Нет'),
    },
    {
        accessorKey: 'is_check',
        header: 'Проверяем историю',
        cell: (info) => (info.getValue<boolean>() ? 'Да' : 'Нет'),
    },
    { accessorKey: 'title', header: 'Название' },
    {
        accessorKey: 'image',
        header: 'Изображение',
        cell: (info) => {
            const val = info.getValue<string | null>()
            return val ? (
                <a href={val} target="_blank" rel="noreferrer">
                    Смотреть
                </a>
            ) : (
                '—'
            )
        },
    },
    { accessorKey: 'description_1_name', header: 'Название описания 1' },
    { accessorKey: 'description_1', header: 'Описание 1' },
    { accessorKey: 'description_2_name', header: 'Название описания 2' },
    { accessorKey: 'description_2', header: 'Описание 2' },
    { accessorKey: 'description_3_name', header: 'Название описания 3' },
    { accessorKey: 'description_3', header: 'Описание 3' },
    { accessorKey: 'description_4_name', header: 'Название описания 4' },
    { accessorKey: 'description_4', header: 'Описание 4' },
    { accessorKey: 'description_5_name', header: 'Название описания 5' },
    { accessorKey: 'description_5', header: 'Описание 5' },
    { accessorKey: 'link', header: 'Ссылка' },
    { accessorKey: 'price', header: 'Цена' },
    {
        id: 'actions',
        header: 'Действия',
    },
]

const initialForm: AddServiceForm = {
    title: '',
    description_1: '',
    description_1_name: '',
    description_2: '',
    description_2_name: '',
    description_3: '',
    description_3_name: '',
    description_4: '',
    description_4_name: '',
    description_5: '',
    description_5_name: '',
    link: 'consult-video',
    price: '',
    is_active: true,
    is_check: false,
    image: '',
}

export default function ServicesTable({
    services: initialServices,
}: ServicesTableProps) {
    const [servicesList, setServicesList] =
        useState<Services[]>(initialServices)
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
    const [isAddFormOpen, setIsAddFormOpen] = useState(false)
    const [form, setForm] = useState<AddServiceForm>(initialForm)
    const [isAdding, setIsAdding] = useState(false)
    const [addError, setAddError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    // Вспомогательная функция для удаления файла с сервера[cite: 3]
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

    // Сохранение отредактированной ячейки[cite: 3]
    const saveCell = async (): Promise<void> => {
        if (!editingCell) return

        const { rowId, columnId, value } = editingCell

        // Парсим значение в зависимости от типа колонки
        let parsedValue: string | boolean | number | null = value
        if (columnId === 'is_active') parsedValue = value === 'true'
        if (columnId === 'price') parsedValue = value ? Number(value) : null

        const previousRow = servicesList.find((r) => r.id === rowId)
        if (!previousRow) return

        const oldValue = previousRow[columnId]

        // Подготавливаем полный объект для /api/admin/services (в SiteContent используется POST для апдейта)[cite: 5]
        const updatedRow = {
            ...previousRow,
            [columnId]: parsedValue === '' ? null : parsedValue,
        }

        try {
            const response = await fetch('/api/admin/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRow),
            })

            if (!response.ok) throw new Error('Ошибка обновления')

            // Обновляем локальное состояние[cite: 3]
            setServicesList((current) =>
                current.map((item) => (item.id === rowId ? updatedRow : item)),
            )

            // Если картинку заменили — удаляем старый файл[cite: 3]
            if (
                columnId === 'image' &&
                oldValue &&
                typeof oldValue === 'string' &&
                oldValue !== parsedValue
            ) {
                await deleteStorageFile(oldValue)
            }
        } catch (err) {
            console.error('Ошибка при сохранении ячейки:', err)
        } finally {
            setEditingCell(null)
        }
    }

    // Отмена редактирования ячейки[cite: 3]
    const cancelCellEditing = async () => {
        if (editingCell) {
            const { rowId, columnId, value } = editingCell
            const previousRow = servicesList.find((r) => r.id === rowId)
            const oldValue = previousRow ? previousRow[columnId] : null

            // Если загрузили новую картинку, но нажали отмену — удаляем загруженный файл[cite: 3]
            if (columnId === 'image' && value && value !== oldValue) {
                await deleteStorageFile(value)
            }
        }
        setEditingCell(null)
    }

    const updateForm = (
        field: keyof AddServiceForm,
        value: string | boolean,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    // Обработка загрузки файла для формы[cite: 3]
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
            if (data.url || data.fileUrl) {
                updateForm('image', data.url || data.fileUrl)
            }
        } catch (err) {
            console.error('Ошибка загрузки файла:', err)
        } finally {
            setIsUploading(false)
        }
    }

    // Добавление новой услуги[cite: 5]
    const addService = async (): Promise<void> => {
        setAddError(null)

        if (!form.title.trim()) {
            setAddError('Введите название услуги')
            return
        }

        try {
            setIsAdding(true)

            const response = await fetch('/api/admin/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    entity_name: 'services',
                    title: form.title.trim(),
                    description_1: form.description_1.trim() || null,
                    description_1_name: form.description_1_name.trim() || null,
                    description_2: form.description_2.trim() || null,
                    description_2_name: form.description_2_name.trim() || null,
                    description_3: form.description_3.trim() || null,
                    description_3_name: form.description_3_name.trim() || null,
                    description_4: form.description_4.trim() || null,
                    description_4_name: form.description_4_name.trim() || null,
                    description_5: form.description_5.trim() || null,
                    description_5_name: form.description_5_name.trim() || null,
                    image: form.image.trim() || null,
                    link: form.link.trim() || null,
                    price: form.price ? Number(form.price) : null,
                    is_active: form.is_active,
                    is_check: form.is_check,
                }),
            })

            if (!response.ok) {
                setAddError('Не удалось добавить услугу')
                return
            }

            // В идеале возвращать добавленный объект с ID из API.
            // Пока просто перезагружаем страницу или можно сделать fetch всех данных.
            window.location.reload()
        } catch (error) {
            console.error('Ошибка добавления услуги:', error)
            setAddError('Ошибка соединения с сервером')
        } finally {
            setIsAdding(false)
        }
    }

    // Отмена добавления[cite: 3]
    const handleCancelAdd = async () => {
        if (isAdding) return

        if (form.image) {
            await deleteStorageFile(form.image)
        }

        setForm(initialForm)
        setIsAddFormOpen(false)
        setAddError(null)
    }

    // Удаление услуги[cite: 5]
    const handleDeleteService = async (
        id: number,
        url: string | null | undefined,
        // extraParam: string,
    ) => {
        if (!confirm('Удалить услугу?')) return
        try {
            const res = await fetch('/api/admin/services', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    url,
                    // extraParam,
                }),
            })
            if (res.ok) {
                setServicesList((prev) => prev.filter((item) => item.id !== id))
            } else {
                alert('Не удалось удалить элемент')
            }
        } catch (err) {
            console.error('Ошибка удаления:', err)
        }
    }

    const table = useReactTable({
        data: servicesList,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Услуги (Services)</h2>

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => {
                        setAddError(null)
                        setIsAddFormOpen(true)
                    }}
                >
                    + Добавить услугу
                </button>
            </div>

            {isAddFormOpen && (
                <div className={styles.addForm}>
                    <div className={styles.addFormHeader}>
                        <h3 className={styles.addFormTitle}>
                            Добавление услуги
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
                                onChange={(e) =>
                                    updateForm('title', e.target.value)
                                }
                                placeholder="Название услуги"
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
                            {form.image && (
                                <input
                                    type="text"
                                    value={form.image}
                                    readOnly
                                    placeholder="URL изображения"
                                />
                            )}
                        </label>
                        <label className={styles.field}>
                            <span>Название описания 1</span>
                            <textarea
                                value={form.description_1_name}
                                onChange={(e) =>
                                    updateForm(
                                        'description_1_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Краткое описание"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Описание 1</span>
                            <textarea
                                value={form.description_1}
                                onChange={(e) =>
                                    updateForm('description_1', e.target.value)
                                }
                                placeholder="Краткое описание"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Название описания 2</span>
                            <textarea
                                value={form.description_2_name}
                                onChange={(e) =>
                                    updateForm(
                                        'description_2_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Краткое описание"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Описание 2</span>
                            <textarea
                                value={form.description_2}
                                onChange={(e) =>
                                    updateForm('description_2', e.target.value)
                                }
                                placeholder="Дополнительное описание"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Название описания 3</span>
                            <textarea
                                value={form.description_3_name}
                                onChange={(e) =>
                                    updateForm(
                                        'description_3_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Краткое описание"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Описание 3</span>
                            <textarea
                                value={form.description_3}
                                onChange={(e) =>
                                    updateForm('description_3', e.target.value)
                                }
                                placeholder="Детали"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Название описания 4</span>
                            <textarea
                                value={form.description_4_name}
                                onChange={(e) =>
                                    updateForm(
                                        'description_4_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Краткое описание"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Описание 4</span>
                            <textarea
                                value={form.description_4}
                                onChange={(e) =>
                                    updateForm('description_4', e.target.value)
                                }
                                placeholder="Детали"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Название описания 5</span>
                            <textarea
                                value={form.description_5_name}
                                onChange={(e) =>
                                    updateForm(
                                        'description_5_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Краткое описание"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Описание 5</span>
                            <textarea
                                value={form.description_5}
                                onChange={(e) =>
                                    updateForm('description_5', e.target.value)
                                }
                                placeholder="Детали"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Ссылка</span>
                            <input
                                type="text"
                                value={form.link}
                                onChange={(e) =>
                                    updateForm('link', e.target.value)
                                }
                                placeholder="https://..."
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Цена</span>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) =>
                                    updateForm('price', e.target.value)
                                }
                                placeholder="0"
                                disabled={isAdding}
                            />
                        </label>
                        <label className={styles.checkboxField}>
                            <input
                                type="checkbox"
                                checked={form.is_check}
                                onChange={(e) =>
                                    updateForm('is_check', e.target.checked)
                                }
                                disabled={isAdding}
                            />
                            <span>необходимость проверки(повторный ли)</span>
                        </label>
                        <label className={styles.checkboxField}>
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) =>
                                    updateForm('is_active', e.target.checked)
                                }
                                disabled={isAdding}
                            />
                            <span>Услуга активна (отображается на сайте)</span>
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
                            onClick={addService}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Добавление...' : 'Добавить услугу'}
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
                                    const columnId = cell.column.id as
                                        | keyof Services
                                        | 'actions'

                                    if (columnId === 'actions') {
                                        return (
                                            <td key={cell.id}>
                                                <button
                                                    className={
                                                        styles.cancelButton
                                                    }
                                                    style={{
                                                        color: '#dc2626',
                                                        padding: '4px 8px',
                                                    }}
                                                    onClick={() =>
                                                        handleDeleteService(
                                                            row.original.id,
                                                            row.original.image,
                                                        )
                                                    }
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        )
                                    }

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
                                                    | string
                                                    | boolean
                                                    | number
                                                    | null
                                                >()
                                                const value =
                                                    typeof raw === 'boolean' ||
                                                    typeof raw === 'number'
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
                                                    {columnId ===
                                                    'is_active' ? (
                                                        <select
                                                            autoFocus
                                                            value={
                                                                editingCell.value
                                                            }
                                                            onChange={(e) =>
                                                                setEditingCell(
                                                                    (curr) =>
                                                                        curr
                                                                            ? {
                                                                                  ...curr,
                                                                                  value: e
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
                                                    ) : columnId === 'image' ? (
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
                                                                            curr,
                                                                        ) =>
                                                                            curr
                                                                                ? {
                                                                                      ...curr,
                                                                                      value: e
                                                                                          .target
                                                                                          .value,
                                                                                  }
                                                                                : null,
                                                                    )
                                                                }
                                                                placeholder="URL или файл"
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
                                                                            const data =
                                                                                await res.json()
                                                                            if (
                                                                                data.url ||
                                                                                data.fileUrl
                                                                            ) {
                                                                                setEditingCell(
                                                                                    (
                                                                                        curr,
                                                                                    ) =>
                                                                                        curr
                                                                                            ? {
                                                                                                  ...curr,
                                                                                                  value:
                                                                                                      data.url ||
                                                                                                      data.fileUrl,
                                                                                              }
                                                                                            : null,
                                                                                )
                                                                            }
                                                                        } catch (err) {
                                                                            console.error(
                                                                                'Ошибка:',
                                                                                err,
                                                                            )
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <textarea
                                                            autoFocus
                                                            value={
                                                                editingCell.value
                                                            }
                                                            onChange={(e) =>
                                                                setEditingCell(
                                                                    (curr) =>
                                                                        curr
                                                                            ? {
                                                                                  ...curr,
                                                                                  value: e
                                                                                      .target
                                                                                      .value,
                                                                              }
                                                                            : null,
                                                                )
                                                            }
                                                            rows={2}
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
