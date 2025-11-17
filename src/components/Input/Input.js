import React from 'react';
import { AlertCircle } from 'lucide-react';
import './Input.css';

function Input({
    label,
    type = 'text',
    error,
    icon: Icon,
    prefix,
    helper,
    className = '',
    ...props
}) {
    const inputClasses = [
        'input',
        Icon && 'input-with-icon',
        prefix && 'input-with-prefix',
        error && 'input-error',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="input-wrapper">
            {label && (
                <label className="input-label" htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className="input-container">
                {Icon && (
                    <span className="input-icon">
                        <Icon size={16} />
                    </span>
                )}
                {prefix && (
                    <span className="input-prefix">
                        {prefix}
                    </span>
                )}
                {type === 'textarea' ? (
                    <textarea
                        className={inputClasses}
                        {...props}
                    />
                ) : (
                    <input
                        className={inputClasses}
                        type={type}
                        {...props}
                    />
                )}
            </div>
            {error && (
                <div className="input-error-message">
                    <AlertCircle size={12} />
                    <span>{error}</span>
                </div>
            )}
            {helper && !error && (
                <div className="input-helper">
                    {helper}
                </div>
            )}
        </div>
    );
}

export default Input;
