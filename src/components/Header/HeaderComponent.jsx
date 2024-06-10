import './HeaderComponent.css'
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
                    <a href="/" className="navItem">Home</a>
                    <a href="/blog" className="navItem">Blog</a>
                    <a href="/aboutus" className="navItem">About</a>
                    <a href="/don" className="navItem">Don</a>
                    <a href="/contact" className="navItem">Contact</a>
                    {isAuthenticated ? (
                        <>
                            <a href="#logout" className="navItem" onClick={handleLogout}>Log out</a>
                        </>
                    ) : (
                        <a href="/login" className="navItem">Log in</a>
                    )}
                </div>
                <div className="menuIcon" onClick={toggleMenu}>
                    ☰
                </div>
            </nav>
        </header>
    );
};

export default HeaderComponent;