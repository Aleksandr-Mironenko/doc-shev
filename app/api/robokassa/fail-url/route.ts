import { NextResponse } from 'next/server'

const failHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Ошибка оплаты</title>
</head>
<body style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background-color: #f5f5f5;">
    <script>
        // Отправляем сигнал об ошибке родительскому окну
        window.parent.postMessage('payment_fail', '*');
    </script>
</body>
</html>
`

export async function POST(request: Request) {
    return new NextResponse(failHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
}

export async function GET(request: Request) {
    return new NextResponse(failHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
}
