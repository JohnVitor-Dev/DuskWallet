import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Brain,
    TrendingUp,
    AlertTriangle,
    Lightbulb,
    ShieldAlert,
    BarChart3,
    RefreshCw
} from 'lucide-react';
import { useToast } from '../../components/Toast/Toast';
import Button from '../../components/Button/Button';
import api from '../../services/api';
import './Analysis.css';

function Analysis() {
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const getUserId = () => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            return userData.id || userData.email;
        }
        return 'default';
    };

    const CACHE_KEY = useMemo(() => `duskwallet_analysis_${getUserId()}`, []);
    const CACHE_TIMESTAMP_KEY = useMemo(() => `duskwallet_analysis_timestamp_${getUserId()}`, []);

    const fetchAnalysis = useCallback(async (showToast = false) => {
        try {
            setLoading(true);
            const response = await api.get('/analysis');

            if (response.data.message) {
                setAnalysis(null);
                localStorage.removeItem(CACHE_KEY);
                localStorage.removeItem(CACHE_TIMESTAMP_KEY);
                if (showToast) {
                    toast.info('Sem dados', response.data.message);
                }
            } else {
                const analysisData = response.data.analysis;
                const timestamp = new Date().toISOString();

                setAnalysis(analysisData);
                setLastUpdate(new Date(timestamp));

                localStorage.setItem(CACHE_KEY, JSON.stringify(analysisData));
                localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp);

                if (showToast) {
                    toast.success('Atualizado!', 'Análise atualizada com sucesso');
                }
            }
        } catch (error) {
            toast.error('Erro', 'Não foi possível carregar a análise');
        } finally {
            setLoading(false);
        }
    }, [CACHE_KEY, CACHE_TIMESTAMP_KEY, toast]);

    const loadCachedAnalysis = useCallback(() => {
        try {
            const cachedAnalysis = localStorage.getItem(CACHE_KEY);
            const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

            if (cachedAnalysis && cachedTimestamp) {
                setAnalysis(JSON.parse(cachedAnalysis));
                setLastUpdate(new Date(cachedTimestamp));
            } else {
                fetchAnalysis(false);
            }
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
            fetchAnalysis(false);
        }
    }, [CACHE_KEY, CACHE_TIMESTAMP_KEY, fetchAnalysis]);

    useEffect(() => {
        loadCachedAnalysis();
    }, [loadCachedAnalysis]);

    const handleRefresh = useCallback(() => {
        fetchAnalysis(true);
    }, [fetchAnalysis]);

    const formatLastUpdate = () => {
        if (!lastUpdate) return null;

        const now = new Date();
        const diffMs = now - lastUpdate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `Há ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
        if (diffHours < 24) return `Há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
        return `Há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    };

    if (loading) {
        return (
            <div className="analysis">
                <div className="analysis-header">
                    <h1 className="analysis-title">Análise Inteligente</h1>
                </div>
                <div className="analysis-loading">
                    <div className="analysis-loading-spinner"></div>
                    <p className="analysis-loading-text">Analisando suas finanças...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="analysis">
                <div className="analysis-header">
                    <h1 className="analysis-title">Análise Inteligente</h1>
                </div>
                <div className="analysis-intro">
                    <div className="analysis-intro-icon">
                        <Brain size={32} color="#101820" />
                    </div>
                    <h2 className="analysis-intro-title">Análise Inteligente com IA</h2>
                    <p className="analysis-intro-description">
                        Adicione transações para receber análises personalizadas sobre seus gastos,
                        identificar padrões e obter conselhos práticos para melhorar sua saúde financeira.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="analysis">
            <div className="analysis-header">
                <h1 className="analysis-title">Análise Inteligente</h1>
                <Button
                    variant="primary"
                    icon={RefreshCw}
                    onClick={handleRefresh}
                    loading={loading}
                >
                    Atualizar Análise
                </Button>
            </div>

            <div className="analysis-intro">
                <div className="analysis-intro-icon">
                    <Brain size={32} color="#101820" />
                </div>
                <h2 className="analysis-intro-title">Análise Inteligente DuskWallet</h2>
                <p className="analysis-intro-description">
                    Insights personalizados baseados em seus hábitos financeiros
                </p>
                {lastUpdate && (
                    <p className="analysis-last-update">
                        Última atualização: {formatLastUpdate()}
                    </p>
                )}
            </div>

            <div className="analysis-content">
                {/* Resumo */}
                {analysis.resumo && (
                    <div className="analysis-section">
                        <div className="analysis-section-header">
                            <div className="analysis-section-icon analysis-section-icon-default">
                                <BarChart3 size={20} />
                            </div>
                            <h3 className="analysis-section-title">Resumo Financeiro</h3>
                        </div>
                        <div className="analysis-section-content">
                            <p>{analysis.resumo}</p>
                        </div>
                    </div>
                )}

                {/* Ponto Positivo */}
                {analysis.ponto_positivo && (
                    <div className="analysis-section">
                        <div className="analysis-section-header">
                            <div className="analysis-section-icon analysis-section-icon-positive">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="analysis-section-title">Pontos Positivos</h3>
                        </div>
                        <div className="analysis-section-content">
                            <p>{analysis.ponto_positivo}</p>
                        </div>
                    </div>
                )}

                {/* Ponto de Atenção */}
                {analysis.ponto_de_atencao && (
                    <div className="analysis-section">
                        <div className="analysis-section-header">
                            <div className="analysis-section-icon analysis-section-icon-warning">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="analysis-section-title">Pontos de Atenção</h3>
                        </div>
                        <div className="analysis-section-content">
                            <p>{analysis.ponto_de_atencao}</p>
                        </div>
                    </div>
                )}

                {/* Padrões Identificados */}
                {analysis.analise_de_padroes && analysis.analise_de_padroes.length > 0 && (
                    <div className="analysis-section">
                        <div className="analysis-section-header">
                            <div className="analysis-section-icon analysis-section-icon-default">
                                <BarChart3 size={20} />
                            </div>
                            <h3 className="analysis-section-title">Padrões Identificados</h3>
                        </div>
                        <div className="analysis-list">
                            {analysis.analise_de_padroes.map((padrao, index) => (
                                <div key={index} className="analysis-list-item">
                                    <div className="analysis-list-item-icon">
                                        {index + 1}
                                    </div>
                                    <div className="analysis-list-item-content">
                                        {padrao}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Conselhos Práticos */}
                {analysis.conselhos && analysis.conselhos.length > 0 && (
                    <div className="analysis-section">
                        <div className="analysis-section-header">
                            <div className="analysis-section-icon analysis-section-icon-positive">
                                <Lightbulb size={20} />
                            </div>
                            <h3 className="analysis-section-title">Conselhos Práticos</h3>
                        </div>
                        <div className="analysis-list">
                            {analysis.conselhos.map((conselho, index) => (
                                <div key={index} className="analysis-list-item">
                                    <div className="analysis-list-item-icon">
                                        {index + 1}
                                    </div>
                                    <div className="analysis-list-item-content">
                                        {conselho}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Plano de Emergência */}
                {analysis.plano_de_emergencia && analysis.plano_de_emergencia.length > 0 && (
                    <div className="analysis-section">
                        <div className="analysis-section-header">
                            <div className="analysis-section-icon analysis-section-icon-danger">
                                <ShieldAlert size={20} />
                            </div>
                            <h3 className="analysis-section-title">Plano de Emergência</h3>
                        </div>
                        <div className="analysis-timeline">
                            {analysis.plano_de_emergencia.map((passo, index) => (
                                <div key={index} className="analysis-timeline-item">
                                    <div className="analysis-timeline-marker">
                                        {index + 1}
                                    </div>
                                    <div className="analysis-timeline-content">
                                        <div className="analysis-timeline-description">
                                            {passo}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analysis;
