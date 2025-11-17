import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast/Toast';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Auth.css';

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const calculatePasswordStrength = (password) => {
        if (password.length === 0) return '';
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return 'strong';
        }
        return 'medium';
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Nome é obrigatório';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
        }

        if (!formData.email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirme sua senha';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Você deve aceitar os termos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));

        // Calcula força da senha
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Limpa erro do campo ao digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Erro de validação', 'Por favor, corrija os erros no formulário');
            return;
        }

        setLoading(true);

        const result = await register(formData.name, formData.email, formData.password);

        setLoading(false);

        if (result.success) {
            toast.success('Conta criada!', 'Bem-vindo ao DuskWallet');
            navigate('/dashboard');
        } else {
            toast.error('Erro ao criar conta', result.error);
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 'weak':
                return 'Senha fraca';
            case 'medium':
                return 'Senha média';
            case 'strong':
                return 'Senha forte';
            default:
                return '';
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <Wallet size={40} color="#101820" />
                    </div>
                    <h1 className="auth-logo-title">DuskWallet</h1>
                    <p className="auth-logo-subtitle">Gestão financeira inteligente com IA</p>
                </div>

                <div className="auth-card">
                    <div className="auth-header">
                        <h2 className="auth-title">Criar sua conta</h2>
                        <p className="auth-subtitle">Comece a gerenciar suas finanças de forma inteligente.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                label="Nome completo"
                                placeholder="João Silva"
                                icon={User}
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                autoComplete="name"
                            />

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="seu@email.com"
                                icon={Mail}
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                autoComplete="email"
                            />

                            <div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    label="Senha"
                                    placeholder="••••••••"
                                    icon={Lock}
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    autoComplete="new-password"
                                />
                                {passwordStrength && (
                                    <div className={`password-strength password-strength-${passwordStrength}`}>
                                        <div className="password-strength-bar">
                                            <div className="password-strength-fill"></div>
                                        </div>
                                        <span className="password-strength-text">
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                label="Confirmar senha"
                                placeholder="••••••••"
                                icon={Lock}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                autoComplete="new-password"
                            />

                            <div className="auth-checkbox">
                                <input
                                    id="acceptTerms"
                                    name="acceptTerms"
                                    type="checkbox"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                />
                                <label htmlFor="acceptTerms">
                                    Eu aceito os termos de uso e política de privacidade
                                </label>
                            </div>
                            {errors.acceptTerms && (
                                <span style={{ color: 'var(--danger-red)', fontSize: '0.75rem' }}>
                                    {errors.acceptTerms}
                                </span>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="auth-submit"
                        >
                            Criar conta
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <span className="auth-footer-text">
                            Já tem uma conta?
                            <Link to="/login" className="auth-footer-link">
                                Fazer login
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
