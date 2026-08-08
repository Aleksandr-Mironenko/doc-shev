// import { NextRequest, NextResponse } from "next/server"
// import crypto from "crypto"

// function sign(value: string) {
//   return crypto
//     .createHmac("sha256", process.env.SESSION_SECRET!)
//     .update(value)
//     .digest("hex")
// }

// function verify(cookie: string) {
//   const [value, signature] = cookie.split(".")

//   if (!value || !signature) return false

//   const expected = sign(value)

//   return signature === expected
// }

// export function middleware(req: NextRequest) {
//   const cookie = req.cookies.get("auth")?.value

//   // 👉 защищаем только админку
//   if (req.nextUrl.pathname.startsWith("/admin")) {
//     if (!cookie || !verify(cookie)) {
//       return NextResponse.redirect(new URL("/login", req.url))
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/admin", "/admin/:path*"]
// }
//---------------------------------------------------------
// middleware.ts
// import { NextRequest, NextResponse } from "next/server"

// const enc = new TextEncoder()

// async function sign(value: string) {
//   const key = await crypto.subtle.importKey(
//     "raw",
//     enc.encode(process.env.SESSION_SECRET!),
//     { name: "HMAC", hash: "SHA-256" },
//     false,
//     ["sign"]
//   )

//   const sig = await crypto.subtle.sign(
//     "HMAC",
//     key,
//     enc.encode(value)
//   )

//   return Buffer.from(sig).toString("hex")
// }

// async function verify(token: string) {
//   const [value, sig] = token.split(".")
//   if (!value || !sig) return false

//   const expected = await sign(value)
//   return expected === sig
// }

// export async function middleware(req: NextRequest) {
//   const cookie = req.cookies.get("auth")?.value

//   if (req.nextUrl.pathname.startsWith("/admin")) {
//     if (!cookie) {
//       return NextResponse.redirect(new URL("/login", req.url))
//     }

//     const ok = await verify(cookie)

//     if (!ok) {
//       return NextResponse.redirect(new URL("/login", req.url))
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/admin/:path*"]
// }
//------------------------------------------------------------
import { NextRequest, NextResponse } from 'next/server'

const enc = new TextEncoder()

async function getKey() {
    return crypto.subtle.importKey(
        'raw',
        enc.encode(process.env.SESSION_SECRET!),
        {
            name: 'HMAC',
            hash: 'SHA-256',
        },
        false,
        ['sign'],
    )
}

async function sign(value: string) {
    const key = await getKey()

    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value))

    return Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

function timingSafeEqual(a: string, b: string) {
    if (a.length !== b.length) return false

    let result = 0

    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return result === 0
}

async function verify(token: string) {
    try {
        const parts = token.split('.')

        if (parts.length !== 2) return false

        const [value, sig] = parts

        if (!value || !sig) return false

        const expected = await sign(value)

        return timingSafeEqual(expected, sig)
    } catch {
        return false
    }
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (pathname.startsWith('/admin')) {
        const cookie = req.cookies.get('auth')?.value

        if (!cookie) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        const ok = await verify(cookie)

        if (!ok) {
            const res = NextResponse.redirect(new URL('/login', req.url))

            res.cookies.delete('auth')

            return res
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
