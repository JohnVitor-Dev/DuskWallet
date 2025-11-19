import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../../components/Button/Button';
import './NotFound.css';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound">
            <div className="notfound-content">
                <div className="notfound-number">404</div>
                <div className="notfound-icon">
                    <Search size={80} />
                </div>
                <h1 className="notfound-title">Página não encontrada</h1>
                <p className="notfound-description">
                    Desculpe, a página que você está procurando não existe ou foi movida.
                </p>
                <div className="notfound-actions">
                    <Button
                        variant="primary"
                        icon={Home}
                        onClick={() => navigate('/dashboard')}
                        size="lg"
                    >
                        Ir para o Dashboard
                    </Button>
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() => navigate(-1)}
                        size="lg"
                    >
                        Voltar
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
