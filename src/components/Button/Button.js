import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    disabled,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    const classes = [
        'button',
        `button-${variant}`,
        `button-${size}`,
        loading && 'button-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            type={type}
            {...props}
        >
            {loading && (
                <span className="button-spinner">
                    <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="spinner" />
                </span>
            )}
            <span className="button-content">
                {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
                {children}
            </span>
        </button>
    );
}

export default Button;
