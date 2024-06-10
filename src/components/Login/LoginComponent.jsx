import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css'
import FooterComponent from '../Footer/FooterComponent';
import HeaderComponent from '../Header/HeaderComponent';

function LoginComponent() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        Email: '',
        Password: ''
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Soumettre la Connexion 
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/users/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Échec de la connexion');
            }

            const result = await response.json();

            localStorage.setItem('token', result.token);
            localStorage.setItem('userId', result.userId);

            if (result && result.roles) {

                const isAdmin = result.roles.some(role => role.Role === 'admin');
                if (isAdmin) {
                    navigate('/admin/home');
                } else {
                    navigate('/');
                }
            }
            else {
                console.log("n'est pas admin")
                navigate('/');
            }

        } catch (error) {
            alert("Erreur lors de la connexion.");
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
                    </div>
                    <button type="submit" className="login-button">Log In</button>
                </form>
            </div>
            <FooterComponent />
        </div>
    );
}

export default LoginComponent;