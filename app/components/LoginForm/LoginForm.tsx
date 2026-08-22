'use client'

import { useState } from 'react'
import styles from './LoginForm.module.scss'

export default function LoginForm() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const clean = (v: string) => v.trim()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: clean(login), password: clean(password) })
      })

      if (!res.ok) throw new Error('Неверный логин или пароль')

      window.location.href = "/admin"
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }
   

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Вход</h2>

      <input
        type="text"
        placeholder="Логин"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        required
        className={styles.input}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={styles.input}
      />

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Загрузка...' : 'Войти'}
      </button>
    </form>
  )
}



// "use client"

// import { useState } from "react"

// export default function LoginPage() {
//   const [login, setLogin] = useState("")
//   const [password, setPassword] = useState("")

//   const handleLogin = async () => {
//     const res = await fetch("/api/login", {
//       method: "POST",
//       body: JSON.stringify({ login, password })
//     })

//     if (res.ok) {
//       window.location.href = "/admin"
//     } else {
//       alert("Ошибка")
//     }
//   }

//   return (
//     <div>
//       <input onChange={e => setLogin(e.target.value)} />
//       <input type="password" onChange={e => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Войти</button>
//     </div>
//   )
// }