// --- frontend/src/components/Navbar.jsx ---
import logo from '../assets/electric-games.jpg'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const baseBtn =
    "px-3 py-1 rounded-md font-semibold transition-colors duration-200"

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      {/* Logo y enlaces principales */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-blue-400">
        <img src={logo} alt="Logo" className="w-12 h-12" />
        Electric Games
        </Link>

        <Link
          to="/"
          className={`${baseBtn} text-white hover:bg-gray-700`}
        >
          Tienda
        </Link>

        {user && (
          <Link
            to="/library"
            className={`${baseBtn} text-white hover:bg-gray-700`}
          >
            Biblioteca
          </Link>
        )}
      </div>

      {/* Botones de usuario / login */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-white font-medium">{user.username}</span>

            {user.isAdmin && (
              <button
                onClick={() => nav('/admin')}
                className={`${baseBtn} text-white hover:bg-gray-700`}
              >
                Gestiones
              </button>
            )}

            <button
              onClick={() => {
                logout()
                nav('/login')
              }}
              className={`${baseBtn} bg-red-600 text-white hover:bg-red-700`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`${baseBtn} bg-blue-600 text-white hover:bg-blue-700`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`${baseBtn} bg-green-600 text-white hover:bg-green-700`}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}