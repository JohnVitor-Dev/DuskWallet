import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <div className="error-boundary-icon">
                            <AlertTriangle size={64} />
                        </div>
                        <h1 className="error-boundary-title">Oops! Algo deu errado</h1>
                        <p className="error-boundary-description">
                            Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-boundary-details">
                                <summary>Detalhes do erro (modo desenvolvimento)</summary>
                                <pre className="error-boundary-stack">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="error-boundary-actions">
                            <button
                                className="error-boundary-button error-boundary-button-primary"
                                onClick={this.handleReload}
                            >
                                Recarregar Página
                            </button>
                            <button
                                className="error-boundary-button error-boundary-button-secondary"
                                onClick={() => window.location.href = '/'}
                            >
                                Voltar ao Início
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
