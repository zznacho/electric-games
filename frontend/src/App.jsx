import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Shop from './pages/Shop'
import Login from './pages/Login'
import Register from './pages/Register'
import GameDetails from './pages/GameDetails'
import Purchase from './pages/Purchase'
import AdminPanel from './pages/AdminPanel'
import AdminGameList from './pages/AdminGameList'
import AdminEditGame from './pages/Admin/AdminEditGame'
import AdminAddGame from './pages/Admin/AdminAddGame'
import Library from './pages/Library'

import { useAuth } from './auth/AuthProvider'



function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return user.isAdmin ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>

        {/* PANEL ADMIN */}
        <Route path="/admin" element={
          <AdminRoute>
          <AdminPanel />
         </AdminRoute>
        } />

        {/* LISTA DE JUEGOS ADMIN */}
        <Route path="/admin/games" element={
          <AdminRoute>
            <AdminGameList />
          </AdminRoute>
        } />

        <Route path="/admin/add" element={
          <AdminRoute>
            <AdminAddGame />
          </AdminRoute>
        } />


        {/* EDITAR */}
        <Route path="/admin/edit/:id" element={
          <AdminRoute>
            <AdminEditGame />
          </AdminRoute>
        } />

        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/games/:id" element={<GameDetails />} />

        {/* RUTAS PRIVADAS */}
        <Route path="/purchase/:id" element={
          <PrivateRoute><Purchase /></PrivateRoute>
        } />

        <Route path="/library" element={
          <PrivateRoute>
          <Library />
        </PrivateRoute>
        } />

      </Routes>

    </div>
  )
}
