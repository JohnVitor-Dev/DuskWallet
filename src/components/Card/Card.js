import React from 'react';
import './Card.css';

function Card({
    title,
    icon: Icon,
    children,
    footer,
    onClick,
    compact = false,
    className = '',
    ...props
}) {
    const classes = [
        'card',
        onClick && 'card-clickable',
        compact && 'card-compact',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick} {...props}>
            {title && (
                <div className="card-header">
                    {Icon && (
                        <div className="card-icon">
                            <Icon size={20} />
                        </div>
                    )}
                    <h3 className="card-title">{title}</h3>
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
}

export default Card;
