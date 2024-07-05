import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LoginComponent.css';
import FooterComponent from '../Footer/FooterComponent';
import HeaderComponent from '../Header/HeaderComponent';
import { Modal, Button, Form } from 'react-bootstrap';

function LoginComponent() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const role = user.role.role;
            switch (role) {
                case 'ADMIN':
                    navigate('/admin');
                    break;
                case 'CLUB':
                case 'ADMIN_CLUB':
                    navigate('/club');
                    break;
                case 'FORMATIONCENTER':
                case 'ADMIN_FORMATIONCENTER':
                    navigate('/training-center');
                    break;
                case 'PLAYER':
                    navigate('/player');
                    break;
                default:
                    navigate('/dashboard');
            }
        }
    }, [navigate]);

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
                localStorage.setItem('user', JSON.stringify(result.user));

                if (!result.user.firstConnection) {
                    navigate('/login/first-connection');
                } else {
                    const role = result.user.role.role;
                    switch (role) {
                        case 'ADMIN':
                            navigate('/admin');
                            break;
                        case 'CLUB':
                        case 'ADMIN_CLUB':
                            navigate('/club');
                            break;
                        case 'FORMATIONCENTER':
                        case 'ADMIN_FORMATIONCENTER':
                            navigate('/training-center');
                            break;
                        case 'PLAYER':
                            navigate('/player');
                            break;
                        default:
                            navigate('/dashboard');
                    }
                }
            } else {
                localStorage.setItem('user', JSON.stringify(result.user));
                navigate('/login/a2f');
            }

        } catch (error) {
            setErrorMessage("Erreur lors de la connexion.");
            Swal.fire('Erreur', "Erreur lors de la connexion.", 'error');
        }
    };

    const handleForgotPassword = async () => {
        try {
            await fetch('http://localhost:4000/users/auth/lost-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: forgotEmail })
            });

            Swal.fire('Succès', 'Un email vient d\'être envoyé au mail renseigné si un utilisateur existe.', 'success');
        } catch (error) {
            Swal.fire('Succès', 'Un email vient d\'être envoyé au mail renseigné si un utilisateur existe.', 'success');
        } finally {
            setShowModal(false);
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group visible">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group visible">
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
                <p className="forgot-password" onClick={() => setShowModal(true)}>Mot de passe oublié ?</p>
            </div>
            <FooterComponent />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Mot de passe oublié</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="forgotEmail">
                        <Form.Label>Adresse email</Form.Label>
                        <Form.Control
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="Entrez votre adresse email"
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleForgotPassword}>
                        Envoyer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LoginComponent;
