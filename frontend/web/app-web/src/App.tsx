// Punto de entrada de la aplicacion: define el enrutamiento principal y la estructura de layout con rutas publicas y privadas.
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/layout/PrivateRoute';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { FloatingRoleSelector } from './components/layout/FloatingRoleSelector';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Crops } from './pages/Crops';
import { Marketplace } from './pages/Marketplace';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

// Layout compartido por todas las vistas privadas: incluye Navbar, Sidebar y el selector de rol flotante
const AppLayout: React.FC = () => {
  // Estado del sidebar en movil (en escritorio siempre visible via CSS)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="main-content">
        <Outlet />
      </main>

      {/* Floating Selector for Demo Role Switching */}
      <FloatingRoleSelector />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes inside general Layout */}
          <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Crops page restricted to Farmers and Admins */}
            <Route 
              path="/crops" 
              element={
                <PrivateRoute allowedRoles={['farmer', 'admin']}>
                  <Crops />
                </PrivateRoute>
              } 
            />
            
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin panel — only admin role */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Admin />
                </PrivateRoute>
              }
            />

            {/* Default page redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
