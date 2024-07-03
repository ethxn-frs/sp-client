import './HeaderComponent.css';
import React, { useState } from 'react';

const HeaderComponent = ({ isAuthenticated, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
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
