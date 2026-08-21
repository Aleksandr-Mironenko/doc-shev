import '@tanstack/react-table'

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        editable?: boolean
        editor?: 'input' | 'select' | 'date'
        options?: { label: string; value: string | number | boolean }[]
        inputType?: 'text' | 'number' | 'date'
    }
}
