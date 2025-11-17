import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useToast } from '../../components/Toast/Toast';
import Button from '../../components/Button/Button';
import api from '../../services/api';
import { getCategoryIcon, formatCurrency, formatDate } from '../../utils/helpers';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
    });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchDashboardData();
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard');
            setDashboardData({
                totalIncome: response.data.totalIncome || 0,
                totalExpense: response.data.totalExpense || 0,
                balance: response.data.balance || 0
            });
        } catch (error) {
            toast.error('Erro', 'Não foi possível carregar os dados do dashboard');
        }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/transactions');
            setTransactions(response.data.transactions || []);
        } catch (error) {
            toast.error('Erro', 'Não foi possível carregar as transações');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryChartData = () => {
        const categoryTotals = {};

        transactions
            .filter(t => t.type === 'EXPENSE')
            .forEach(transaction => {
                if (categoryTotals[transaction.category]) {
                    categoryTotals[transaction.category] += transaction.amount;
                } else {
                    categoryTotals[transaction.category] = transaction.amount;
                }
            });

        return Object.keys(categoryTotals).map(category => ({
            name: category,
            value: categoryTotals[category]
        }));
    };

    const getMonthlyChartData = () => {
        const monthlyData = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
            }

            if (transaction.type === 'INCOME') {
                monthlyData[monthKey].income += transaction.amount;
            } else {
                monthlyData[monthKey].expense += transaction.amount;
            }
        });

        return Object.values(monthlyData).slice(-6);
    };

    const COLORS = [
        '#FEE715', '#10B981', '#3B82F6', '#F59E0B',
        '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
    ];

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => navigate('/transactions')}
                >
                    Nova Transação
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Total de Receitas</span>
                        <div className="stat-card-icon stat-card-icon-income">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="stat-card-value">
                        {formatCurrency(dashboardData.totalIncome)}
                    </div>
                    <div className="stat-card-trend stat-card-trend-positive">
                        <ArrowUpRight size={16} />
                        <span>Entradas</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Total de Despesas</span>
                        <div className="stat-card-icon stat-card-icon-expense">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                    <div className="stat-card-value">
                        {formatCurrency(dashboardData.totalExpense)}
                    </div>
                    <div className="stat-card-trend stat-card-trend-negative">
                        <ArrowDownRight size={16} />
                        <span>Saídas</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Saldo Atual</span>
                        <div className="stat-card-icon stat-card-icon-balance">
                            <Wallet size={24} />
                        </div>
                    </div>
                    <div className="stat-card-value">
                        {formatCurrency(dashboardData.balance)}
                    </div>
                    <div className={`stat-card-trend ${dashboardData.balance >= 0
                            ? 'stat-card-trend-positive'
                            : 'stat-card-trend-negative'
                        }`}>
                        {dashboardData.balance >= 0 ? (
                            <ArrowUpRight size={16} />
                        ) : (
                            <ArrowDownRight size={16} />
                        )}
                        <span>Balanço</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            {transactions.length > 0 && (
                <div className="dashboard-charts">
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <h3 className="chart-card-title">Despesas por Categoria</h3>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={getCategoryChartData()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {getCategoryChartData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-card-header">
                            <h3 className="chart-card-title">Receitas vs Despesas</h3>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getMonthlyChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="month" stroke="#A0AEC0" />
                                    <YAxis stroke="#A0AEC0" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1E293B',
                                            border: '1px solid #334155',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value) => formatCurrency(value)}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10B981" name="Receitas" />
                                    <Bar dataKey="expense" fill="#EF4444" name="Despesas" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div className="dashboard-transactions">
                <div className="dashboard-transactions-header">
                    <h3 className="dashboard-transactions-title">Últimas Transações</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/transactions')}
                    >
                        Ver todas
                    </Button>
                </div>

                {loading ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Clock size={40} />
                        </div>
                        <h4 className="empty-state-title">Carregando...</h4>
                    </div>
                ) : recentTransactions.length > 0 ? (
                    <div className="transaction-list">
                        {recentTransactions.map(transaction => {
                            const CategoryIcon = getCategoryIcon(transaction.category);
                            return (
                                <div key={transaction.id} className="transaction-item">
                                    <div
                                        className="transaction-item-icon"
                                        style={{
                                            backgroundColor: transaction.type === 'INCOME'
                                                ? 'rgba(16, 185, 129, 0.1)'
                                                : 'rgba(239, 68, 68, 0.1)',
                                            color: transaction.type === 'INCOME'
                                                ? 'var(--success-green)'
                                                : 'var(--danger-red)'
                                        }}
                                    >
                                        <CategoryIcon size={20} />
                                    </div>
                                    <div className="transaction-item-info">
                                        <div className="transaction-item-description">
                                            {transaction.description}
                                        </div>
                                        <div className="transaction-item-meta">
                                            <span>{transaction.category}</span>
                                            <span>•</span>
                                            <span>{formatDate(transaction.date)}</span>
                                        </div>
                                    </div>
                                    <div className={`transaction-item-amount transaction-item-${transaction.type === 'INCOME' ? 'income' : 'expense'
                                        }`}>
                                        {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Wallet size={40} />
                        </div>
                        <h4 className="empty-state-title">Nenhuma transação</h4>
                        <p className="empty-state-description">
                            Adicione sua primeira transação para começar a gerenciar suas finanças
                        </p>
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() => navigate('/transactions')}
                        >
                            Adicionar Transação
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
