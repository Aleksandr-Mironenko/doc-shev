import '@tanstack/react-table'

export interface Article {
    id: number
    title: string
    description: string
    full_description: string | null
    preview_image_url: string | null
    external_link: string
    comment: string | null
    active: boolean
    created_at: Date | string
}

export interface Review {
    id: number
    external_link: string
    text: string
    active: boolean
    created_at: Date | string
    comment: string | null
}

export interface TimeSlot {
    id: number
    data: string | null
    time: string | null
    datatime_reserved: Date | string
    comment: string | null
}

export interface Client {
    id: number
    fio: string
    phone: string
    email: string
    comment: string | null
}

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

// Расширяем метаданные колонок TanStack Table без использования any
declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        editable?: boolean
        editor?: 'input' | 'select' | 'date'
        inputType?: 'text' | 'number' | 'date'
        options?: Array<{ label: string; value: string | number | boolean }>
    }
}
