import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast/Toast';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';

const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions/Transactions'));
const Analysis = lazy(() => import('./pages/Analysis/Analysis'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

const PageLoader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-light)',
        fontSize: '1.25rem'
    }}>
        Carregando...
    </div>
);

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <AuthProvider>
                    <ToastProvider>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Dashboard />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/transactions"
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Transactions />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/analysis"
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Analysis />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />

                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </ToastProvider>
                </AuthProvider>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
