import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './A2FVerificationComponent.css';
import FooterComponent from '../Footer/FooterComponent';
import HeaderComponent from '../Header/HeaderComponent';

function A2FVerificationComponent() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/users/auth/verify-a2f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    code: code
                })
            });

            if (!response.ok) {
                throw new Error('Échec de la vérification du code A2F');
            }

            const result = await response.json();

            localStorage.setItem('token', result.token);
            navigate('/admin/home');

        } catch (error) {
            alert("Erreur lors de la vérification du code A2F.");
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="verification-container">
                <h2>Vérification A2F</h2>
                <form onSubmit={handleSubmit} className="verification-form">
                    <div className="form-group">
                        <label htmlFor="code">Code A2F</label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="verification-button">Vérifier</button>
                </form>
            </div>
            <FooterComponent />
        </div>
    );
}

export default A2FVerificationComponent;