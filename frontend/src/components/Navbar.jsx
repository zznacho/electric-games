// --- frontend/src/components/Navbar.jsx ---
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">Electric Games</Link>
        <Link to="/" className="text-sm">Tienda</Link>

        {/* Biblioteca para cualquier usuario logueado */}
        {user && (
          <Link to="/library" className="text-sm underline">
            Biblioteca
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm">{user.username}</span>

            {/* Admin Panel solo si es admin */}
            {user.isAdmin && (
              <button
                onClick={() => nav('/admin')}
                className="text-sm underline"
              >
                Admin
              </button>
            )}

            <button
              onClick={() => {
                logout()
                nav('/login')
              }}
              className="px-3 py-1 bg-red-600 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-1 bg-blue-600 rounded">
              Login
            </Link>
            <Link to="/register" className="px-3 py-1 bg-green-600 rounded">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

