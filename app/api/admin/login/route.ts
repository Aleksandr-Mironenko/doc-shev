import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sign } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const login = body?.login?.trim()
        const password = body?.password?.trim()

        const envLogin = process.env.ADMIN_LOGIN
        const envHash = process.env.ADMIN_PASSWORD_HASH

        // проверка env
        if (!envLogin || !envHash) {
            return NextResponse.json(
                { error: 'server config error' },
                { status: 500 },
            )
        }
        console.log('password', password)

        console.log('envHash', envHash)
        console.log('login')
        console.log('envLogin')

        // проверка логина
        if (login !== envLogin) {
            return NextResponse.json(
                { error: 'invalid login' },
                { status: 401 },
            )
        }

        // проверка пароля
        const isValid = await bcrypt.compare(password, envHash)

        if (!isValid) {
            return NextResponse.json(
                { error: 'invalid password' },
                { status: 401 },
            )
        }

        // создаём signed token
        const token = await sign('admin')

        const res = NextResponse.json({
            ok: true,
        })

        // сохраняем cookie
        res.cookies.set('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        })

        return res
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: 'internal server error' },
            { status: 500 },
        )
    }
}
