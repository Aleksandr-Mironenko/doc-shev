'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table'

import { useState } from 'react'

import type { Client } from '@/app/components/AdminPage/AdminPage'

import styles from './ClientsTable.module.scss'

interface ClientsTableProps {
    clients: Client[]
}

interface EditingCell {
    rowId: number
    columnId: keyof Client
    value: string
}

const columns: ColumnDef<Client>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
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
        accessorKey: 'comment',
        header: 'Комментарий',
    },
]

export default function ClientsTable({
    clients: initialClients,
}: ClientsTableProps) {
    const [clients, setClients] = useState<Client[]>(initialClients)

    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)

    const saveCell = async (): Promise<void> => {
        if (!editingCell) {
            return
        }

        const { rowId, columnId, value } = editingCell

        const response = await fetch('/api/admin/clients', {
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
            return
        }

        const result: {
            success: boolean
        } = await response.json()

        if (!result.success) {
            return
        }

        setClients((current) =>
            current.map((client) =>
                client.id === rowId
                    ? {
                          ...client,
                          [columnId]: value,
                      }
                    : client,
            ),
        )

        setEditingCell(null)
    }

    const table = useReactTable({
        data: clients,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className={styles.wrapper}>
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
                                const columnId = cell.column.id as keyof Client

                                const editable = columnId !== 'id'

                                const isEditing =
                                    editingCell?.rowId === row.original.id &&
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
                                                    value={editingCell.value}
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
    )
}
