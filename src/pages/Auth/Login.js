import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Wallet } from 'lucide-react';
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Erro de validação', 'Por favor, corrija os erros no formulário');
            return;
        }

        setLoading(true);

        const result = await login(formData.email, formData.password);

        setLoading(false);

        if (result.success) {
            toast.success('Login realizado!', 'Bem-vindo de volta ao DuskWallet');
            navigate('/dashboard');
        } else {
            toast.error('Erro ao fazer login', result.error);
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
                        <h2 className="auth-title">Entrar na sua conta</h2>
                        <p className="auth-subtitle">Bem-vindo de volta! Faça login para continuar.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
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
