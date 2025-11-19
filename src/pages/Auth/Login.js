import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast/Toast';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Auth.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const toast = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpa erro do campo ao digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Limpa erro geral ao digitar
        if (generalError) {
            setGeneralError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Erro de validação', 'Por favor, corrija os erros no formulário');
            return;
        }

        setGeneralError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        setLoading(false);

        if (result.success) {
            toast.success('Login realizado!', 'Bem-vindo de volta ao DuskWallet');
            navigate('/dashboard');
        } else {
            setGeneralError(result.error || 'Erro ao fazer login. Verifique suas credenciais.');
            toast.error('Erro ao fazer login', result.error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <svg width="100" height="100" viewBox="100 120 200 200" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <clipPath id="login-coin-clip">
                                    <rect x="0" y="0" width="400" height="220" />
                                </clipPath>
                            </defs>

                            <rect x="120" y="220" width="160" height="100" rx="8" fill="none" stroke="#FEE715" stroke-width="3" />
                            <path stroke="#FEE715" stroke-width="3" d="M120 250h160" />
                            <circle cx="200" cy="275" r="8" fill="none" stroke="#FEE715" stroke-width="2" />
                            <rect x="197" y="275" width="6" height="10" fill="none" stroke="#FEE715" stroke-width="2" rx="1" />

                            <g clipPath="url(#login-coin-clip)">
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
                    <h1 className="auth-logo-title">DuskWallet</h1>
                    <p className="auth-logo-subtitle">Gestão financeira inteligente</p>
                </div>

                <div className="auth-card">
                    <div className="auth-header">
                        <h2 className="auth-title">Entrar na sua conta</h2>
                        <p className="auth-subtitle">Bem-vindo de volta! Faça login para continuar.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {generalError && (
                            <div className="auth-error-general">
                                {generalError}
                            </div>
                        )}

                        <div className="auth-form-group">
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
                                autoComplete="current-password"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="auth-submit"
                        >
                            Entrar
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <span className="auth-footer-text">
                            Ainda não tem uma conta?
                            <Link to="/register" className="auth-footer-link">
                                Criar conta
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
