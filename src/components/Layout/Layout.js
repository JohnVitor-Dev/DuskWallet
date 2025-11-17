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
                <div className="layout-sidebar-header">
                    <div className="layout-sidebar-logo">
                        <Wallet size={24} color="#101820" />
                    </div>
                    <h1 className="layout-sidebar-title">DuskWallet</h1>
                </div>

                <nav className="layout-sidebar-nav">
                    <NavItem
                        to="/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                        onClick={closeSidebar}
                    />
                    <NavItem
                        to="/transactions"
                        icon={ArrowLeftRight}
                        label="Transações"
                        onClick={closeSidebar}
                    />
                    <NavItem
                        to="/analysis"
                        icon={Brain}
                        label="Análise IA"
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
                    <div className="layout-header-left">
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
                    </div>

                    <div className="layout-header-right">
                        <div className="layout-header-user">
                            <div className="layout-header-user-avatar">
                                {getUserInitials()}
                            </div>
                            <div className="layout-header-user-info">
                                <span className="layout-header-user-name">
                                    {user?.name || 'Usuário'}
                                </span>
                                <span className="layout-header-user-email">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
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
