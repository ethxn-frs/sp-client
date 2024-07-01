import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LoginComponent.css';
import FooterComponent from '../Footer/FooterComponent';
import HeaderComponent from '../Header/HeaderComponent';

function LoginComponent() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/users/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: email,
                    password: password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                setErrorMessage(result.message || 'Échec de la connexion');
                Swal.fire('Erreur', result.message || 'Échec de la connexion', 'error');
                return;
            }

            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user)); // Sérialiser l'objet user

                if (!result.user.firstConnection) {
                    navigate('/login/first-connection');
                } else {
                    const role = result.user.role.role;
                    if (role === 'ADMIN') {
                        navigate('/admin');
                    } else if (role === 'CLUB' || role === 'ADMIN_CLUB') {
                        navigate('/club');
                    } else if (role === 'ADMIN_FORMATIONCENTER' || role === 'FORMATIONCENTER') {
                        navigate('/training-center');
                    } else if (role === 'PLAYER') {
                        navigate('/player');
                    }
                }
            } else {
                // Si A2F est activé, redirige vers la page de vérification du code A2F
                localStorage.setItem('user', JSON.stringify(result.user)); // Sérialiser l'objet user
                navigate('/login/a2f');
            }

        } catch (error) {
            setErrorMessage("Erreur lors de la connexion.");
            Swal.fire('Erreur', "Erreur lors de la connexion.", 'error');
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                    <button type="submit" className="login-button">Log In</button>
                </form>
            </div>
            <FooterComponent />
        </div>
    );
}

export default LoginComponent;
