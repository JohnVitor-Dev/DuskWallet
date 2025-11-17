import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavItem.css';

function NavItem({ to, icon: Icon, label, onClick, variant }) {
    const classes = [
        'nav-item',
        variant === 'danger' && 'nav-item-danger'
    ].filter(Boolean).join(' ');

    if (to) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) =>
                    isActive ? `${classes} active` : classes
                }
                onClick={onClick}
            >
                <span className="nav-item-icon">
                    <Icon size={20} />
                </span>
                <span className="nav-item-label">{label}</span>
            </NavLink>
        );
    }

    return (
        <button className={classes} onClick={onClick}>
            <span className="nav-item-icon">
                <Icon size={20} />
            </span>
            <span className="nav-item-label">{label}</span>
        </button>
    );
}

export default NavItem;
