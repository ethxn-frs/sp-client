import './HeaderComponent.css';
import React, { useState, useEffect } from 'react';

const HeaderComponent = ({ handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsAuthenticated(true);
            setUserRole(user.role.role);
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const getDashboardLink = () => {
        switch (userRole) {
            case 'ADMIN':
                return '/admin';
            case 'CLUB':
            case 'ADMIN_CLUB':
                return '/club';
            case 'FORMATIONCENTER':
            case 'ADMIN_FORMATIONCENTER':
                return '/training-center';
            default:
                return '/dashboard';
        }
    };

    return (
        <header className="header">
            <nav className="nav">
                <div className="logo"><a href="/">Logo</a></div>
                <div className={`navList ${isOpen ? 'open' : ''}`}>
                    <a href="/" className="navItem">Accueil</a>
                    <a href="/blog" className="navItem">Blog</a>
                    <a href="/aboutus" className="navItem">L'Association</a>
                    <a href="/don" className="navItem">Donation</a>
                    <a href="/contact" className="navItem">Nous contacter</a>
                    {isAuthenticated ? (
                        <>
                            <a href={getDashboardLink()} className="navItem">Mon espace</a>
                            <a href="/logout" className="navItem" onClick={handleLogout}>Déconnexion</a>
                        </>
                    ) : (
                        <a href="/login" className="navItem">Connexion</a>
                    )}
                </div>
                <div className="menuIcon" onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </nav>
        </header>
    );
};

export default HeaderComponent;
