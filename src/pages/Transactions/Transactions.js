import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useToast } from '../../components/Toast/Toast';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Modal from '../../components/Modal/Modal';
import api from '../../services/api';
import {
    getCategoryIcon,
    getCategoryLabel,
    getPaymentMethodLabel,
    formatCurrency,
    formatDate,
    categoryOptions,
    paymentMethodOptions
} from '../../utils/helpers';
import './Transactions.css';

function Transactions() {
    const toast = useToast();

    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Filtros
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        category: '',
        paymentMethod: ''
    });

    // Form data
    const [formData, setFormData] = useState({
        type: 'EXPENSE',
        description: '',
        amount: '',
        category: '',
        paymentMethod: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions, filters]);

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

    const applyFilters = () => {
        let filtered = [...transactions];

        if (filters.search) {
            filtered = filtered.filter(t =>
                t.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.type) {
            filtered = filtered.filter(t => t.type === filters.type);
        }

        if (filters.category) {
            filtered = filtered.filter(t => t.category === filters.category);
        }

        if (filters.paymentMethod) {
            filtered = filtered.filter(t => t.paymentMethod === filters.paymentMethod);
        }

        // Ordena por data (mais recente primeiro)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        setFilteredTransactions(filtered);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };



    const openModal = (transaction = null) => {
        if (transaction) {
            setEditingTransaction(transaction);
            // Extrair apenas a parte da data (YYYY-MM-DD) sem conversão de timezone
            const dateOnly = transaction.date.split('T')[0];
            setFormData({
                type: transaction.type,
                description: transaction.description,
                amount: transaction.amount.toString(),
                category: transaction.category,
                paymentMethod: transaction.paymentMethod,
                date: dateOnly
            });
        } else {
            setEditingTransaction(null);
            setFormData({
                type: 'EXPENSE',
                description: '',
                amount: '',
                category: '',
                paymentMethod: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
        setFormErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingTransaction(null);
        setFormData({
            type: 'EXPENSE',
            description: '',
            amount: '',
            category: '',
            paymentMethod: '',
            date: new Date().toISOString().split('T')[0]
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.description || formData.description.length < 3) {
            errors.description = 'Descrição deve ter no mínimo 3 caracteres';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            errors.amount = 'Valor deve ser maior que zero';
        }

        if (!formData.category) {
            errors.category = 'Categoria é obrigatória';
        }

        if (!formData.paymentMethod) {
            errors.paymentMethod = 'Método de pagamento é obrigatório';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        console.log('Campo alterado:', name, 'Valor:', value);
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTypeChange = (type) => {
        setFormData(prev => ({ ...prev, type }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Erro de validação', 'Corrija os erros no formulário');
            return;
        }

        setLoading(true);

        try {
            // Criar data às 00:00:00 no fuso horário local
            const [year, month, day] = formData.date.split('-');
            const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0);

            const data = {
                type: formData.type,
                description: formData.description,
                amount: parseFloat(formData.amount),
                category: formData.category,
                paymentMethod: formData.paymentMethod,
                date: localDate.toISOString()
            };

            console.log('Data original:', formData.date);
            console.log('Data convertida:', localDate.toISOString());
            console.log('Dados sendo enviados:', data);

            if (editingTransaction) {
                await api.put(`/transactions/${editingTransaction.id}`, data);
                toast.success('Sucesso', 'Transação atualizada com sucesso');
            } else {
                await api.post('/transactions', data);
                toast.success('Sucesso', 'Transação criada com sucesso');
            }

            await fetchTransactions();
            closeModal();
        } catch (error) {
            toast.error('Erro', error.response?.data?.error || 'Erro ao salvar transação');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
            return;
        }

        try {
            await api.delete(`/transactions/${id}`);
            toast.success('Sucesso', 'Transação excluída com sucesso');
            await fetchTransactions();
        } catch (error) {
            toast.error('Erro', 'Não foi possível excluir a transação');
        }
    };

    return (
        <div className="transactions">
            <div className="transactions-header">
                <h1 className="transactions-title">Transações</h1>
            </div>

            {/* Filtros */}
            <div className="transactions-filters">
                <Input
                    placeholder="Buscar transação..."
                    icon={Search}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <Select
                    placeholder="Tipo"
                    options={[
                        { value: '', label: 'Todos' },
                        { value: 'INCOME', label: 'Receitas' },
                        { value: 'EXPENSE', label: 'Despesas' }
                    ]}
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                />
                <Select
                    placeholder="Categoria"
                    options={[
                        { value: '', label: 'Todas' },
                        ...categoryOptions
                    ]}
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                <Select
                    placeholder="Método de Pagamento"
                    options={[
                        { value: '', label: 'Todos' },
                        ...paymentMethodOptions
                    ]}
                    value={filters.paymentMethod}
                    onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                />
            </div>

            {/* Lista de transações */}
            <div className="transactions-list">
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-gray)' }}>Carregando...</p>
                ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map(transaction => {
                        const CategoryIcon = getCategoryIcon(transaction.category);
                        return (
                            <div key={transaction.id} className="transaction-card">
                                <div
                                    className="transaction-card-icon"
                                    style={{
                                        backgroundColor: transaction.type === 'INCOME'
                                            ? 'rgba(16, 185, 129, 0.1)'
                                            : 'rgba(239, 68, 68, 0.1)',
                                        color: transaction.type === 'INCOME'
                                            ? 'var(--success-green)'
                                            : 'var(--danger-red)'
                                    }}
                                >
                                    <CategoryIcon size={24} />
                                </div>
                                <div className="transaction-card-content">
                                    <div className="transaction-card-description">
                                        {transaction.description}
                                    </div>
                                    <div className="transaction-card-meta">
                                        <span className="transaction-card-badge">
                                            {getCategoryLabel(transaction.category)}
                                        </span>
                                        <span className="transaction-card-badge">
                                            {getPaymentMethodLabel(transaction.paymentMethod)}
                                        </span>
                                        <span>{formatDate(transaction.date)}</span>
                                    </div>
                                </div>
                                <div className={`transaction-card-amount transaction-card-amount-${transaction.type === 'INCOME' ? 'income' : 'expense'
                                    }`}>
                                    {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                </div>
                                <div className="transaction-card-actions">
                                    <button
                                        className="transaction-action-btn transaction-action-btn-edit"
                                        onClick={() => openModal(transaction)}
                                        aria-label="Editar"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="transaction-action-btn transaction-action-btn-delete"
                                        onClick={() => handleDelete(transaction.id)}
                                        aria-label="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Filter size={40} />
                        </div>
                        <h4 className="empty-state-title">Nenhuma transação encontrada</h4>
                        <p className="empty-state-description">
                            Adicione uma nova transação ou ajuste os filtros
                        </p>
                    </div>
                )}
            </div>

            {/* FAB Button */}
            <button
                className="fab-button"
                onClick={() => openModal()}
                aria-label="Nova transação"
            >
                <Plus size={24} />
            </button>

            {/* Modal de adicionar/editar */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            loading={loading}
                        >
                            {editingTransaction ? 'Atualizar' : 'Salvar'}
                        </Button>
                    </>
                }
            >
                <form className="transaction-form" onSubmit={handleSubmit}>
                    <div>
                        <label className="input-label">Tipo</label>
                        <div className="transaction-type-selector">
                            <label className={`type-option ${formData.type === 'INCOME' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="INCOME"
                                    checked={formData.type === 'INCOME'}
                                    onChange={() => handleTypeChange('INCOME')}
                                />
                                Receita
                            </label>
                            <label className={`type-option ${formData.type === 'EXPENSE' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="EXPENSE"
                                    checked={formData.type === 'EXPENSE'}
                                    onChange={() => handleTypeChange('EXPENSE')}
                                />
                                Despesa
                            </label>
                        </div>
                    </div>

                    <Input
                        label="Descrição"
                        name="description"
                        placeholder="Ex: Compra no supermercado"
                        value={formData.description}
                        onChange={handleFormChange}
                        error={formErrors.description}
                    />

                    <Input
                        label="Valor"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        prefix="R$"
                        value={formData.amount}
                        onChange={handleFormChange}
                        error={formErrors.amount}
                    />

                    <div className="transaction-form-row">
                        <Select
                            label="Categoria"
                            name="category"
                            placeholder="Selecione..."
                            options={categoryOptions}
                            value={formData.category}
                            onChange={handleFormChange}
                            error={formErrors.category}
                        />

                        <Select
                            label="Método de Pagamento"
                            name="paymentMethod"
                            placeholder="Selecione..."
                            options={paymentMethodOptions}
                            value={formData.paymentMethod}
                            onChange={handleFormChange}
                            error={formErrors.paymentMethod}
                        />
                    </div>

                    <Input
                        label="Data"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleFormChange}
                    />
                </form>
            </Modal>
        </div>
    );
}

export default Transactions;
