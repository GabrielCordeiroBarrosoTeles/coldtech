import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Agenda from "../pages/Agenda";
import HomePage from "../components/HomePage";
import Login from "../pages/Admin/Login";
import Dashboard from "../pages/Admin/Dashboard";
import DashboardHome from "../pages/Admin/components/DashboardHome";
import AgendamentosAdmin from "../pages/Admin/components/AgendamentosAdmin";
import ClientesAdmin from "../pages/Admin/components/ClientesAdmin";
import ServicosAdmin from "../pages/Admin/components/ServicosAdmin";
import NotFoundPage from "../components/NotFoundPage";
import SchedulingModal from "../components/SchedulingModal";
import WhatsAppButton from "../components/WhatsAppButton";
import PrivateRoute from "./PrivateRoute";
import authService from "../services/simpleAuthService";

const configuracoesStyle = {
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const configTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '1rem',
  color: '#333'
};

function AppContent() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith('/admin');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="agendamentos" element={<AgendamentosAdmin />} />
          <Route path="clientes" element={<ClientesAdmin />} />
          <Route path="servicos" element={<ServicosAdmin />} />
          <Route path="configuracoes" element={
            <div style={configuracoesStyle}>
              <h2 style={configTitleStyle}>Configurações do Sistema</h2>
              <p style={{color: '#4b5563'}}>Aqui você poderá ajustar as configurações do sistema.</p>
            </div>
          } />
        </Route>
        <Route path="*" element={<NotFoundPage openModal={openModal} />} />
      </Routes>
      {!isAdminRoute && <WhatsAppButton />}
      {isModalOpen && <SchedulingModal closeModal={closeModal} />}
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}