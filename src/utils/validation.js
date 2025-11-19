import validator from 'validator';

export const validateEmail = (email) => {
    if (!email) {
        return 'Email é obrigatório';
    }
    if (!validator.isEmail(email)) {
        return 'Email inválido';
    }
    return '';
};

export const validatePassword = (password) => {
    if (!password) {
        return 'Senha é obrigatória';
    }
    if (password.length < 6) {
        return 'Senha deve ter no mínimo 6 caracteres';
    }
    return '';
};

export const validateName = (name) => {
    if (!name) {
        return 'Nome é obrigatório';
    }
    if (name.length < 3) {
        return 'Nome deve ter no mínimo 3 caracteres';
    }
    if (!validator.isAlpha(name.replace(/\s/g, ''), 'pt-BR')) {
        return 'Nome deve conter apenas letras';
    }
    return '';
};

export const validateAmount = (amount) => {
    if (!amount) {
        return 'Valor é obrigatório';
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        return 'Valor deve ser maior que zero';
    }
    if (numAmount > 999999999) {
        return 'Valor muito alto';
    }
    return '';
};

export const validateDescription = (description) => {
    if (!description || !description.trim()) {
        return 'Descrição é obrigatória';
    }
    if (description.length < 3) {
        return 'Descrição deve ter no mínimo 3 caracteres';
    }
    if (description.length > 200) {
        return 'Descrição muito longa (máx. 200 caracteres)';
    }
    return '';
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return validator.escape(input.trim());
};

export const validateDate = (date) => {
    if (!date) {
        return 'Data é obrigatória';
    }
    if (!validator.isDate(date)) {
        return 'Data inválida';
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
        return 'Data não pode ser no futuro';
    }
    return '';
};

export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} é obrigatório`;
    }
    return '';
};
