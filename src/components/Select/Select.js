import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import './Select.css';

function Select({
    label,
    options = [],
    error,
    className = '',
    ...props
}) {
    const selectClasses = [
        'select',
        error && 'select-error',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="select-wrapper">
            {label && (
                <label className="select-label" htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className="select-container">
                <select
                    className={selectClasses}
                    {...props}
                >
                    {props.placeholder && (
                        <option value="" disabled>
                            {props.placeholder}
                        </option>
                    )}
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.icon && `${option.icon} `}
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="select-icon">
                    <ChevronDown size={16} />
                </span>
            </div>
            {error && (
                <div className="select-error-message">
                    <AlertCircle size={12} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

export default Select;
