// import { NextResponse } from 'next/server'

// // HTML-шаблон, который отправит сигнал родительскому окну
// const successHtml = `
// <!DOCTYPE html>
// <html lang="ru">
// <head>
//     <meta charset="UTF-8">
//     <title>Оплата успешна</title>
// </head>
// <body style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background-color: #f5f5f5;">
//     <div style="text-align: center;">
//         <h2 style="color: #59B86A;">Оплата успешно завершена!</h2>
//         <p>Пожалуйста, подождите, возвращаем вас на сайт...</p>
//     </div>
//     <script>
//         // Отправляем сообщение родительскому окну (вашему React-приложению)
//         window.parent.postMessage('payment_success', '*');
//     </script>
// </body>
// </html>
// `

// // Робокасса может обращаться к SuccessUrl методами POST или GET (зависит от настроек в ЛК)
// // Обработаем оба варианта для надежности

// export async function POST(request: Request) {
//     return new NextResponse(successHtml, {
//         status: 200,
//         headers: {
//             'Content-Type': 'text/html; charset=utf-8',
//         },
//     })
// }

// export async function GET(request: Request) {
//     return new NextResponse(successHtml, {
//         status: 200,
//         headers: {
//             'Content-Type': 'text/html; charset=utf-8',
//         },
//     })
// }
import { NextResponse } from 'next/server'

// Превращаем HTML в функцию, которая принимает invId
const generateSuccessHtml = (invId: string | null) => `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Оплата успешна</title>
</head>
<body style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background-color: #f5f5f5;">
    <div style="text-align: center;">
        <h2 style="color: #59B86A;">Оплата успешно завершена!</h2>
        <p>Пожалуйста, подождите, возвращаем вас на сайт...</p>
    </div>
    <script>
        // Отправляем объект с типом события и номером заказа
        window.parent.postMessage({ 
            type: 'payment_success', 
            InvId: ${invId ? `'${invId}'` : 'null'} 
        }, '*');
    </script>
</body>
</html>
`

export async function POST(request: Request) {
    let invId = null

    try {
        // Робокасса при POST отправляет данные как FormData (application/x-www-form-urlencoded)
        const formData = await request.formData()
        invId = formData.get('InvId') as string
    } catch (e) {
        console.error('Ошибка получения параметров из POST', e)
    }

    return new NextResponse(generateSuccessHtml(invId), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
}

export async function GET(request: Request) {
    // При GET Робокасса передает данные прямо в URL
    const { searchParams } = new URL(request.url)
    const invId = searchParams.get('InvId')

    return new NextResponse(generateSuccessHtml(invId), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
}
