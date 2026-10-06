'use client'

import { useState } from 'react'

export function DownloadButton({
    productId,
    setIsDownload,
}: {
    productId: number
    setIsDownload: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDownload = async () => {
        try {
            setIsLoading(true)

            // Делаем POST-запрос с передачей ID
            const response = await fetch('/api/free-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: productId }),
            })

            if (!response.ok) {
                // Если сервер вернул ошибку (например, 404)
                const errorData = await response.json()
                throw new Error(errorData.message || 'Ошибка скачивания')
            }

            // 1. Получаем файл в виде Blob
            const blob = await response.blob()

            // Пытаемся достать оригинальное имя файла из заголовков сервера
            const contentDisposition = response.headers.get(
                'Content-Disposition',
            )
            let filename = 'material.pdf'
            if (
                contentDisposition &&
                contentDisposition.includes('filename=')
            ) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/)
                if (match && match[1]) {
                    filename = decodeURIComponent(match[1])
                }
            }

            // 2. Создаем временную ссылку на объект
            const downloadUrl = window.URL.createObjectURL(blob)

            // 3. Создаем невидимый тег <a> и программно кликаем по нему
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()

            // 4. Убираем за собой
            link.remove()
            window.URL.revokeObjectURL(downloadUrl)

            setIsDownload(true)
        } catch (error: unknown) {
            console.error('Ошибка:', error)
            alert(
                (error instanceof Error && error.message) ||
                    'Не удалось скачать файл. Проверьте интернет-соединение.',
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={isLoading}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
            {isLoading ? 'Загрузка файла...' : 'Скачать материал'}
        </button>
    )
}
