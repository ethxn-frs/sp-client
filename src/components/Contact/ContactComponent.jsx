import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './ContactComponent.css';
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Footer/FooterComponent';

const ContactComponent = () => {
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [visibleFields, setVisibleFields] = useState({ role: true });

    useEffect(() => {
        if (role) {
            setTimeout(() => setVisibleFields(prev => ({ ...prev, name: true })), 500);
        }
    }, [role]);

    useEffect(() => {
        if (name) {
            setTimeout(() => setVisibleFields(prev => ({ ...prev, email: true })), 500);
        }
    }, [name]);

    useEffect(() => {
        if (email) {
            setTimeout(() => setVisibleFields(prev => ({ ...prev, subject: true })), 500);
        }
    }, [email]);

    useEffect(() => {
        if (subject) {
            setTimeout(() => setVisibleFields(prev => ({ ...prev, message: true })), 500);
        }
    }, [subject]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3030/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role,
                    name,
                    email,
                    subject,
                    content: message
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'On dirait bien que quelque chose s\'est mal passé... Réessayer plus tard.');
            }

            Swal.fire({
                title: 'Success',
                text: 'Votre message nous a été parvenu avec succès! Nous reviendrons vers vous dès que possible.',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            setRole('');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
            setVisibleFields({ role: true });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="contact-page">
                <div className="contact-container">
                    <h2>Contactez Nous</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className={`form-group ${visibleFields.role ? 'visible' : ''}`}>
                            <label htmlFor="role">Vous Êtes ?</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez une option</option>
                                <option value="Joueur">Joueur</option>
                                <option value="Centre de Formation">Centre de Formation</option>
                                <option value="Club">Club</option>
                                <option value="Bénévole">Bénévole</option>
                            </select>
                        </div>
                        <div className={`form-group ${visibleFields.name ? 'visible' : ''}`}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={`form-group ${visibleFields.email ? 'visible' : ''}`}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={`form-group ${visibleFields.subject ? 'visible' : ''}`}>
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>
                        <div className={`form-group ${visibleFields.message ? 'visible' : ''}`}>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                        {message && (
                            <button type="submit" className="contact-button">Send Message</button>
                        )}
                    </form>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default ContactComponent;
