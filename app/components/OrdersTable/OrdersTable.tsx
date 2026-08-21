'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table'

import { useState } from 'react'

import styles from './OrdersTable.module.scss'


export interface Order {
    id: number
    fio: string
    phone: string
    email: string
    date: string
    time: string
    create_data_time: Date | string
    consent_pd: boolean
    consent_promo: boolean
    verification_code: string
    approve: boolean
    approve_pr: boolean
    payment: boolean | null
    link: string | null
    price: number
    room_id: string | null
    date_payment: Date | string | null
    comment: string | null
}


type EditableColumn =
    | 'approve'
    | 'approve_pr'
    | 'payment'


interface EditingCell {
    orderId: number
    columnId: EditableColumn
    value: boolean
}


interface AdminOrdersProps {
    orders: Order[]
}


const booleanLabel = (value: boolean | null): string => {
    if (value === true) return 'Да'
    if (value === false) return 'Нет'

    return '—'
}


export default function AdminOrders({
    orders: initialOrders,
}: AdminOrdersProps) {

    const [orders, setOrders] = useState<Order[]>(initialOrders)

    const [editingCell, setEditingCell] =
        useState<EditingCell | null>(null)


    const updateOrder = async (
        orderId: number,
        field: EditableColumn,
        value: boolean,
    ): Promise<void> => {

        const response = await fetch('/api/admin/orders/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: orderId,
                field,
                value,
            }),
        })

        if (!response.ok) {
            throw new Error('Не удалось изменить запись')
        }

        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order.id === orderId
                    ? {
                        ...order,
                        [field]: value,
                    }
                    : order,
            ),
        )
    }


    const saveCell = async (): Promise<void> => {

        if (!editingCell) {
            return
        }

        const {
            orderId,
            columnId,
            value,
        } = editingCell

        try {

            await updateOrder(
                orderId,
                columnId,
                value,
            )

            setEditingCell(null)

        } catch (error) {

            console.error(error)

        }
    }


    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'id',
            header: '№',
        },
        {
            accessorKey: 'fio',
            header: 'ФИО',
        },
        {
            accessorKey: 'phone',
            header: 'Телефон',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'date',
            header: 'Дата',
        },
        {
            accessorKey: 'time',
            header: 'Время',
        },
        {
            accessorKey: 'price',
            header: 'Стоимость',
            cell: (info) => `${info.getValue<number>()} ₽`,
        },
        {
            accessorKey: 'approve',
            header: 'Запись подтверждена',
            cell: (info) =>
                booleanLabel(info.getValue<boolean>()),
        },
        {
            accessorKey: 'approve_pr',
            header: 'Подтверждение PR',
            cell: (info) =>
                booleanLabel(info.getValue<boolean>()),
        },
        {
            accessorKey: 'payment',
            header: 'Оплата',
            cell: (info) =>
                booleanLabel(info.getValue<boolean | null>()),
        },
        {
            accessorKey: 'link',
            header: 'Ссылка',
            cell: (info) =>
                info.getValue<string | null>() ?? '—',
        },
        {
            accessorKey: 'comment',
            header: 'Комментарий',
            cell: (info) =>
                info.getValue<string | null>() ?? '—',
        },
    ]


    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })


    const editableColumns: EditableColumn[] = [
        'approve',
        'approve_pr',
        'payment',
    ]


    const isEditableColumn = (
        columnId: string,
    ): columnId is EditableColumn => {

        return editableColumns.includes(
            columnId as EditableColumn,
        )
    }


    return (
        <section className={styles.wrapper}>

            <h2 className={styles.title}>
                Все записи
            </h2>

            <div className={styles.tableWrapper}>

                <table className={styles.table}>

                    <thead>
                        {table.getHeaderGroups().map(
                            (headerGroup) => (
                                <tr key={headerGroup.id}>

                                    {headerGroup.headers.map(
                                        (header) => (
                                            <th key={header.id}>
                                                {flexRender(
                                                    header.column
                                                        .columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                            </th>
                                        ),
                                    )}

                                </tr>
                            ),
                        )}
                    </thead>


                    <tbody>

                        {table.getRowModel().rows.map(
                            (row) => (

                                <tr key={row.original.id}>

                                    {row.getVisibleCells().map(
                                        (cell) => {

                                            const isEditing =
                                                editingCell?.orderId ===
                                                    row.original.id &&
                                                editingCell?.columnId ===
                                                    cell.column.id

                                            const columnId = cell.column.id
                                            const editable =
                                                isEditableColumn(columnId)

                                            return (
                                                <td
                                                    key={cell.id}
                                                    className={
                                                        editable
                                                            ? styles.editable
                                                            : undefined
                                                    }
                                                    onDoubleClick={() => {

                                                        if (!isEditableColumn(columnId)) {
                                                            return
                                                        }

                                                        const value =
                                                            cell.getValue<
                                                                boolean | null
                                                            >()

                                                        setEditingCell({
                                                            orderId:
                                                                row.original.id,
                                                            columnId:
                                                                columnId,
                                                            value:
                                                                value === true,
                                                        })
                                                    }}
                                                >

                                                    {isEditing ? (

                                                        <div
                                                            className={
                                                                styles.editor
                                                            }
                                                        >

                                                            <select
                                                                autoFocus
                                                                value={
                                                                    editingCell
                                                                        .value
                                                                        ? 'true'
                                                                        : 'false'
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) => {

                                                                    setEditingCell(
                                                                        (
                                                                            current,
                                                                        ) =>
                                                                            current
                                                                                ? {
                                                                                    ...current,
                                                                                    value:
                                                                                        event
                                                                                            .target
                                                                                            .value ===
                                                                                        'true',
                                                                                }
                                                                                : null,
                                                                    )
                                                                }}
                                                            >

                                                                <option value="true">
                                                                    Да
                                                                </option>

                                                                <option value="false">
                                                                    Нет
                                                                </option>

                                                            </select>


                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    saveCell
                                                                }
                                                            >
                                                                ✓
                                                            </button>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setEditingCell(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                ✕
                                                            </button>

                                                        </div>

                                                    ) : (

                                                        flexRender(
                                                            cell.column
                                                                .columnDef
                                                                .cell,
                                                            cell.getContext(),
                                                        )

                                                    )}

                                                </td>
                                            )
                                        },
                                    )}

                                </tr>
                            ),
                        )}

                    </tbody>

                </table>

            </div>

        </section>
    )
}