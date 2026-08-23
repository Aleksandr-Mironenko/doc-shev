import { NextResponse } from 'next/server'

import sendEmail from '@/app/services/serviceSendEmail'
//5
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { message, email } = body
        console.log(JSON.stringify(message))
        if (!message) {
            return NextResponse.json(
                { success: false, message: 'Нет сообщения' },
                { status: 400 },
            )
        }
        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Нет электронной почты' },
                { status: 400 },
            )
        }
        const escapeHtml = (text: string) => {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
        }
        const safeMessage = escapeHtml(message)

        //         const emailHtml = `
        //         <div styles={{backgroundColor:"rgba(244, 249, 253, 0.9)"   }}>
        //         <div style="white-space: pre-wrap;">
        //         ${safeMessage}
        //         </div>

        //     <div styles={{backgroundColor:"rgba(255, 255, 255, 0.2)", marginTop:"15px"   }}>
        //     <p>Надеюсь, наша встреча была полезной и помогла разобраться в вашем вопросе. </p>
        //     <p>Если у вас есть минутка, я буду очень признательна, если Вы поделитесь своими впечатлениями о нашей консультации. </p>
        //     <p>Ваши отзывы очень важны для меня! </p>
        //     <p>Спасибо за доверие и желаю вам крепкого здоровья!</p>
        //     </div>
        //     </div>
        // `
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f9fd;
    font-family: Arial, Helvetica, sans-serif;
    color: #333333;
">

    <div style="
        max-width: 650px;
        margin: 20px auto;
        padding: 30px;
        background-color: rgba(244, 249, 253, 0.9);
        box-sizing: border-box;
    ">

        <div style="
            background-color: #ffffff;
            padding: 25px;
            border-radius: 12px;
            font-size: 16px;
            line-height: 1.6;
            white-space: pre-wrap;
        ">
            ${safeMessage}
        </div>

        <div style="
            margin-top: 15px;
            padding: 25px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            font-size: 15px;
            line-height: 1.6;
        ">

            <p style="margin: 0 0 12px;">
                Надеюсь, наша встреча была полезной и помогла разобраться
                в вашем вопросе.
            </p>

            <p style="margin: 0 0 12px;">
                Если у вас есть минутка, я буду очень признательна,
                если Вы поделитесь своими впечатлениями о нашей консультации.
            </p>

            <p style="margin: 0 0 12px;">
                Ваши отзывы очень важны для меня!
            </p>

            <p style="margin: 0;">
                Спасибо за доверие и желаю вам крепкого здоровья!
            </p>

        </div>

    </div>

</body>
</html>
`
        await sendEmail(
            email,
            'Сообщение после консультации doctor-shev',
            emailHtml,
            'Спасибо за доверие',
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Критическая ошибка на отправки сообщения', error)
        return NextResponse.json(
            { success: false, message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        )
    }
}
