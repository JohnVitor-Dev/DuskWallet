import React, { useState, useEffect, useCallback } from 'react';
import {
    Brain,
    TrendingUp,
    AlertTriangle,
    Lightbulb,
    ShieldAlert,
    BarChart3,
    RefreshCw,
    Star,
    Zap
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
    const [analysisStatus, setAnalysisStatus] = useState(null);
    const [hasSubscription, setHasSubscription] = useState(false);

    const fetchAnalysisStatus = useCallback(async () => {
        try {
            const response = await api.get('/analysis/status');
            setAnalysisStatus(response.data);
            setHasSubscription(response.data.hasSubscription);
        } catch (error) {
            console.error('Erro ao buscar status:', error);
        }
    }, []);

    const fetchLastAnalysis = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/analysis/last');

            if (response.data.analysis) {
                setAnalysis(response.data.analysis);
                setLastUpdate(new Date(response.data.createdAt));
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setAnalysis(null);
                setLastUpdate(null);
            } else {
                console.error('Erro ao buscar última análise:', error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const generateNewAnalysis = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/analysis');

            if (response.data.analysis) {
                setAnalysis(response.data.analysis);
                setLastUpdate(new Date());

                await fetchAnalysisStatus();

                if (response.data.message) {
                    toast.info('Análise gerada', response.data.message);
                } else {
                    toast.success('Sucesso!', 'Análise financeira gerada com sucesso');
                }
            } else if (response.data.message) {
                toast.info('Sem dados', response.data.message);
            }
        } catch (error) {
            if (error.response?.status === 403) {
                const data = error.response.data;
                toast.error(
                    'Limite atingido',
                    `Você já utilizou suas análises gratuitas desta semana. Próximo reset em ${data.daysUntilReset} dia(s).`
                );

                await fetchLastAnalysis();
            } else {
                const errorMessage = error.response?.data?.message || 'Não foi possível gerar a análise';
                toast.error('Erro', errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }, [toast, fetchAnalysisStatus, fetchLastAnalysis]);

    useEffect(() => {
        const loadAnalysisPage = async () => {
            await fetchAnalysisStatus();
            await fetchLastAnalysis();
        };

        loadAnalysisPage();
    }, [fetchAnalysisStatus, fetchLastAnalysis]);

    const handleRefresh = useCallback(() => {
        generateNewAnalysis();
    }, [generateNewAnalysis]);

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

    const renderAnalysisCounter = () => {
        if (!analysisStatus || hasSubscription) return null;

        const { analysisRemaining, maxAnalysisPerWeek, daysUntilReset } = analysisStatus;
        const percentage = (analysisRemaining / maxAnalysisPerWeek) * 100;

        return (
            <div className="analysis-status-card">
                <div
                    className="progress-circle"
                    style={{ '--progress': `${percentage}%` }}
                    data-status={analysisRemaining === 0 ? 'depleted' : analysisRemaining === 1 ? 'warning' : 'normal'}
                >
                    <span className="analysis-counter">{analysisRemaining}/{maxAnalysisPerWeek}</span>
                </div>
                <div className="status-info">
                    <p className="status-message">
                        {analysisRemaining > 0
                            ? `Você tem ${analysisRemaining} análise${analysisRemaining > 1 ? 's' : ''} gratuita${analysisRemaining > 1 ? 's' : ''} restante${analysisRemaining > 1 ? 's' : ''} esta semana`
                            : 'Limite de análises atingido'}
                    </p>
                    {analysisRemaining === 0 && (
                        <small className="reset-info">Próximo reset em {daysUntilReset} dia{daysUntilReset > 1 ? 's' : ''}</small>
                    )}
                </div>
            </div>
        );
    };

    if (loading && !analysis) {
        return (
            <div className="analysis">
                <div className="analysis-header">
                    <div className="analysis-header-top">
                        <div className="analysis-title-wrapper">
                            <div className="analysis-title-icon">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h1 className="analysis-title">Análise Inteligente</h1>
                                <p className="analysis-subtitle">Powered by AI</p>
                            </div>
                        </div>
                        {hasSubscription && (
                            <span className="badge premium">
                                <Star size={14} /> Premium
                            </span>
                        )}
                    </div>
                </div>
                <div className="analysis-loading">
                    <div className="analysis-loading-spinner"></div>
                    <p className="analysis-loading-text">Carregando análise...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="analysis">
                <div className="analysis-header">
                    <div className="analysis-header-top">
                        <div className="analysis-title-wrapper">
                            <div className="analysis-title-icon">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h1 className="analysis-title">Análise Inteligente</h1>
                                <p className="analysis-subtitle">Powered by AI</p>
                            </div>
                        </div>
                        <div className="analysis-header-actions">
                            {renderAnalysisCounter()}
                            {hasSubscription && (
                                <span className="badge premium">
                                    <Star size={14} /> Premium
                                </span>
                            )}
                        </div>
                    </div>
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

                    {analysisStatus && (analysisStatus.analysisRemaining > 0 || hasSubscription) && (
                        <Button
                            variant="primary"
                            icon={Zap}
                            onClick={handleRefresh}
                            loading={loading}
                        >
                            Gerar Primeira Análise
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="analysis">
            <div className="analysis-header">
                <div className="analysis-header-top">
                    <div className="analysis-title-wrapper">
                        <div className="analysis-title-icon">
                            <Brain size={24} />
                        </div>
                        <div>
                            <h1 className="analysis-title">Análise Inteligente</h1>
                            <p className="analysis-subtitle">Powered by AI</p>
                        </div>
                    </div>
                    <div className="analysis-header-actions">
                        {renderAnalysisCounter()}
                        {hasSubscription && (
                            <span className="badge premium">
                                <Star size={14} /> Premium
                            </span>
                        )}
                        <Button
                            variant="primary"
                            icon={RefreshCw}
                            onClick={handleRefresh}
                            loading={loading}
                            disabled={!hasSubscription && analysisStatus?.analysisRemaining === 0}
                        >
                            {loading ? 'Gerando...' : 'Nova Análise'}
                        </Button>
                    </div>
                </div>

                {lastUpdate && (
                    <div className="analysis-meta">
                        <span className="analysis-meta-item">
                            📊 Última análise: {formatLastUpdate()}
                        </span>
                    </div>
                )}
            </div>

            <div className="analysis-grid">
                {analysis.resumo && (
                    <div className="analysis-card analysis-card-highlight">
                        <div className="analysis-card-header">
                            <div className="analysis-card-icon" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <h3 className="analysis-card-title">Resumo Financeiro</h3>
                                <p className="analysis-card-description">Visão geral da sua situação</p>
                            </div>
                        </div>
                        <div className="analysis-card-content">
                            <p className="analysis-text">{analysis.resumo}</p>
                        </div>
                    </div>
                )}

                <div className="analysis-row">
                    {analysis.ponto_positivo && (
                        <div className="analysis-card analysis-card-positive">
                            <div className="analysis-card-header">
                                <div className="analysis-card-icon" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className="analysis-card-title">Ponto Positivo</h3>
                                    <p className="analysis-card-description">Continue assim!</p>
                                </div>
                            </div>
                            <div className="analysis-card-content">
                                <p className="analysis-text">{analysis.ponto_positivo}</p>
                            </div>
                        </div>
                    )}

                    {analysis.ponto_de_atencao && (
                        <div className="analysis-card analysis-card-warning">
                            <div className="analysis-card-header">
                                <div className="analysis-card-icon" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="analysis-card-title">Ponto de Atenção</h3>
                                    <p className="analysis-card-description">Fique atento</p>
                                </div>
                            </div>
                            <div className="analysis-card-content">
                                <p className="analysis-text">{analysis.ponto_de_atencao}</p>
                            </div>
                        </div>
                    )}
                </div>

                {analysis.analise_de_padroes && analysis.analise_de_padroes.length > 0 && (
                    <div className="analysis-card">
                        <div className="analysis-card-header">
                            <div className="analysis-card-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}>
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <h3 className="analysis-card-title">Padrões de Comportamento</h3>
                                <p className="analysis-card-description">{analysis.analise_de_padroes.length} padrões identificados</p>
                            </div>
                        </div>
                        <div className="analysis-card-content">
                            <div className="analysis-patterns">
                                {analysis.analise_de_padroes.map((padrao, index) => (
                                    <div key={index} className="analysis-pattern-item">
                                        <div className="analysis-pattern-number">{index + 1}</div>
                                        <p className="analysis-pattern-text">{padrao}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {analysis.conselhos && analysis.conselhos.length > 0 && (
                    <div className="analysis-card">
                        <div className="analysis-card-header">
                            <div className="analysis-card-icon" style={{ background: 'linear-gradient(135deg, #FEE715 0%, #FCD20B 100%)' }}>
                                <Lightbulb size={24} color="#101820" />
                            </div>
                            <div>
                                <h3 className="analysis-card-title">Conselhos Práticos</h3>
                                <p className="analysis-card-description">Ações recomendadas</p>
                            </div>
                        </div>
                        <div className="analysis-card-content">
                            <div className="analysis-advice-list">
                                {analysis.conselhos.map((conselho, index) => (
                                    <div key={index} className="analysis-advice-item">
                                        <div className="analysis-advice-icon">💡</div>
                                        <p className="analysis-advice-text">{conselho}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {analysis.plano_de_emergencia && analysis.plano_de_emergencia.length > 0 && (
                    <div className="analysis-card analysis-card-emergency">
                        <div className="analysis-card-header">
                            <div className="analysis-card-icon" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h3 className="analysis-card-title">Plano de Emergência</h3>
                                <p className="analysis-card-description">Para situações críticas</p>
                            </div>
                        </div>
                        <div className="analysis-card-content">
                            <div className="analysis-emergency-steps">
                                {analysis.plano_de_emergencia.map((passo, index) => (
                                    <div key={index} className="analysis-emergency-item">
                                        <div className="analysis-emergency-step">Passo {index + 1}</div>
                                        <p className="analysis-emergency-text">{passo}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analysis;
