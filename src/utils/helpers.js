import {
    Home,
    Receipt,
    ShoppingCart,
    Coffee,
    Car,
    Heart,
    GraduationCap,
    Gamepad2,
    ShoppingBag,
    CreditCard,
    TrendingUp,
    Briefcase,
    DollarSign,
    Package
} from 'lucide-react';

// Enums
export const TransactionType = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE'
};

export const TransactionCategory = {
    MORADIA: 'MORADIA',
    CONTAS: 'CONTAS',
    MERCADO: 'MERCADO',
    COMIDA_FORA: 'COMIDA_FORA',
    TRANSPORTE: 'TRANSPORTE',
    SAUDE: 'SAUDE',
    EDUCACAO: 'EDUCACAO',
    LAZER: 'LAZER',
    COMPRAS: 'COMPRAS',
    DIVIDAS: 'DIVIDAS',
    INVESTIMENTOS: 'INVESTIMENTOS',
    SALARIO: 'SALARIO',
    OUTRAS_RECEITAS: 'OUTRAS_RECEITAS',
    OUTROS: 'OUTROS'
};

export const PaymentMethod = {
    DINHEIRO: 'DINHEIRO',
    PIX: 'PIX',
    CREDITO: 'CREDITO'
};

// Mapeamento de ícones por categoria
export const categoryIcons = {
    MORADIA: Home,
    CONTAS: Receipt,
    MERCADO: ShoppingCart,
    COMIDA_FORA: Coffee,
    TRANSPORTE: Car,
    SAUDE: Heart,
    EDUCACAO: GraduationCap,
    LAZER: Gamepad2,
    COMPRAS: ShoppingBag,
    DIVIDAS: CreditCard,
    INVESTIMENTOS: TrendingUp,
    SALARIO: Briefcase,
    OUTRAS_RECEITAS: DollarSign,
    OUTROS: Package
};

// Labels amigáveis
export const categoryLabels = {
    MORADIA: 'Moradia',
    CONTAS: 'Contas',
    MERCADO: 'Mercado',
    COMIDA_FORA: 'Comida Fora',
    TRANSPORTE: 'Transporte',
    SAUDE: 'Saúde',
    EDUCACAO: 'Educação',
    LAZER: 'Lazer',
    COMPRAS: 'Compras',
    DIVIDAS: 'Dívidas',
    INVESTIMENTOS: 'Investimentos',
    SALARIO: 'Salário',
    OUTRAS_RECEITAS: 'Outras Receitas',
    OUTROS: 'Outros'
};

export const paymentMethodLabels = {
    DINHEIRO: 'Dinheiro',
    PIX: 'PIX',
    CREDITO: 'Crédito'
};

// Funções auxiliares
export const getCategoryIcon = (category) => {
    return categoryIcons[category] || Package;
};

export const getCategoryLabel = (category) => {
    return categoryLabels[category] || category;
};

export const getPaymentMethodLabel = (method) => {
    return paymentMethodLabels[method] || method;
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
};

export const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
};

// Opções para selects
export const categoryOptions = Object.keys(TransactionCategory).map(key => ({
    value: key,
    label: categoryLabels[key]
}));

export const paymentMethodOptions = Object.keys(PaymentMethod).map(key => ({
    value: key,
    label: paymentMethodLabels[key]
}));

export const typeOptions = [
    { value: 'INCOME', label: 'Receita' },
    { value: 'EXPENSE', label: 'Despesa' }
];
