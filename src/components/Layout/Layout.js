import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Wallet,
    LayoutDashboard,
    ArrowLeftRight,
    Brain,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast/Toast';
import NavItem from './NavItem';
import api from '../../services/api';
import './Layout.css';

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const toast = useToast();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        fetchBalance();
    }, [location.pathname]);

    const fetchBalance = async () => {
        try {
            const response = await api.get('/dashboard');
            setBalance(response.data.balance || 0);
        } catch (error) {
            console.error('Erro ao buscar saldo:', error);
        }
    };

    const handleLogout = () => {
        logout();
        toast.info('Até logo!', 'Você saiu da sua conta');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const getUserInitials = () => {
        if (!user?.name) return user?.email?.charAt(0).toUpperCase() || 'U';
        const names = user.name.split(' ');
        if (names.length > 1) {
            return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
        }
        return names[0].charAt(0).toUpperCase();
    };

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className={`layout-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="layout-sidebar-logo">
                    <svg width="80" height="80" viewBox="100 120 200 200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <clipPath id="sidebar-coin-clip">
                                <rect x="0" y="0" width="400" height="220" />
                            </clipPath>
                        </defs>

                        <rect x="120" y="220" width="160" height="100" rx="8" fill="none" stroke="#FEE715" stroke-width="3" />
                        <path stroke="#FEE715" stroke-width="3" d="M120 250h160" />
                        <circle cx="200" cy="275" r="8" fill="none" stroke="#FEE715" stroke-width="2" />
                        <rect x="197" y="275" width="6" height="10" fill="none" stroke="#FEE715" stroke-width="2" rx="1" />

                        <g clipPath="url(#sidebar-coin-clip)">
                            <circle cx="200" cy="185" r="60" fill="none" stroke="#FEE715" stroke-width="4" />
                            <circle cx="200" cy="185" r="50" fill="none" stroke="#FEE715" stroke-width="1.5" opacity=".3" />
                            <circle cx="200" cy="185" r="5" fill="#FEE715" />
                            <circle cx="200" cy="155" r="4" fill="#FEE715" />
                            <circle cx="230" cy="185" r="4" fill="#FEE715" />
                            <circle cx="200" cy="215" r="4" fill="#FEE715" />
                            <circle cx="170" cy="185" r="4" fill="#FEE715" />
                            <circle cx="221" cy="164" r="3" fill="#FEE715" opacity=".8" />
                            <circle cx="221" cy="206" r="3" fill="#FEE715" opacity=".8" />
                            <circle cx="179" cy="206" r="3" fill="#FEE715" opacity=".8" />
                            <circle cx="179" cy="164" r="3" fill="#FEE715" opacity=".8" />
                            <path stroke="#FEE715" stroke-width="2" opacity=".6" d="M200 185v-30M200 185h30M200 185v30M200 185h-30" />
                            <path stroke="#FEE715" stroke-width="1.5" opacity=".4" d="M200 185l21-21M200 185l21 21M200 185l-21 21M200 185l-21-21" />
                            <circle cx="200" cy="185" r="5" fill="none" stroke="#FEE715" stroke-width="1.5" opacity="0">
                                <animate attributeName="r" values="5;20;5" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
                            </circle>
                        </g>
                    </svg>
                </div>

                <nav className="layout-sidebar-nav">
                    <NavItem
                        to="/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                        tooltip="Visão geral das suas finanças"
                        onClick={closeSidebar}
                    />
                    <NavItem
                        to="/transactions"
                        icon={ArrowLeftRight}
                        label="Transações"
                        tooltip="Adicione e gerencie receitas e despesas"
                        onClick={closeSidebar}
                    />
                    <NavItem
                        to="/analysis"
                        icon={Brain}
                        label="Análise IA"
                        tooltip="Análises inteligentes dos seus gastos"
                        onClick={closeSidebar}
                    />
                </nav>

                <div className="layout-sidebar-footer">
                    <NavItem
                        onClick={() => {
                            handleLogout();
                            closeSidebar();
                        }}
                        icon={LogOut}
                        label="Sair"
                        variant="danger"
                    />
                </div>
            </aside>

            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="layout-sidebar-overlay visible"
                    onClick={closeSidebar}
                />
            )}

            {/* Main content */}
            <main className="layout-main">
                <header className="layout-header">
                    <button
                        className="layout-header-menu-button"
                        onClick={toggleSidebar}
                        aria-label="Menu"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="layout-header-balance">
                        <span className="layout-header-balance-label">Saldo</span>
                        <span className={`layout-header-balance-value ${balance >= 0 ? 'layout-header-balance-positive' : 'layout-header-balance-negative'
                            }`}>
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(balance)}
                        </span>
                    </div>
                </header>

                <div className="layout-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default Layout;
