import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
            const role = user.role.role;
            if (role === 'ADMIN') {
                navigate('/admin');
            } else if (role === 'CLUB' || role === 'ADMIN_CLUB') {
                navigate('/club');
            } else if (role === 'ADMIN_FORMATIONCENTER' || role === 'FORMATIONCENTER') {
                navigate('/training-center');
            } else if (role === 'PLAYER') {
                navigate('/player');
            }

        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: "Erreur lors de la vérification du code A2F.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleRegenerateCode = async () => {
        try {
            const response = await fetch(`http://localhost:4000/users/${user.id}/regenerate-a2f`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la régénération du code A2F');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Un nouveau code a été envoyé à votre adresse e-mail.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message || 'Erreur lors de la régénération du code A2F.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="verification-container mb-5">
                <h2>Vérification A2F</h2>
                <p>Un code A2F a été envoyé sur votre adresse mail associée. Vous avez 15 minutes pour entrer le code. Si vous ne recevez pas le code, vous pouvez le renvoyer.</p>
                <form onSubmit={handleSubmit} className="verification-form">
                    <div className="form-group visible">
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
                <button
                    onClick={handleRegenerateCode}
                    className="regenerate-button mt-5"
                >
                    Renvoyer le code
                </button>
            </div>
            <FooterComponent />
        </div>
    );
}

export default A2FVerificationComponent;
