import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carrega usuário do localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData || { email }));

            setUser(userData || { email });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Erro ao fazer login'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            await api.post('/auth/register', { name, email, password });

            // Após registro, faz login automaticamente
            return await login(email, password);
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Erro ao registrar usuário'
            };
        }
    };

    const logout = () => {
        // Limpar cache de análise do usuário atual
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                const userId = userData.id || userData.email;
                localStorage.removeItem(`duskwallet_analysis_${userId}`);
                localStorage.removeItem(`duskwallet_analysis_timestamp_${userId}`);
            } catch (error) {
                console.error('Erro ao limpar cache:', error);
            }
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
