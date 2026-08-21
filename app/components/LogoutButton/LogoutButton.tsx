'use client'

import styles from './LogoutButton.module.scss'

export default function LogoutButton() {
    const handleLogout = async () => {
        await fetch('/api/admin/logout', {
            method: 'POST',
        })

        window.location.href = '/login'
    }

    return (
        <button onClick={handleLogout} className={styles.button}>
            Выйти
        </button>
    )
}
