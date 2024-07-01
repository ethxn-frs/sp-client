import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './FirstConnectionComponent.css';
import FooterComponent from '../Footer/FooterComponent';
import HeaderComponent from '../Header/HeaderComponent';

function FirstConnectionComponent() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: 'Erreur',
                text: 'Les mots de passe ne correspondent pas',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await fetch(`http://localhost:4000/users/${user.id}/first-connection`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: newPassword
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du mot de passe');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Mot de passe mis à jour avec succès',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
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
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: 'Erreur lors de la mise à jour du mot de passe.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="update-password-container">
                <h2>Mettre à jour le mot de passe</h2>
                <form onSubmit={handleSubmit} className="update-password-form">
                    <div className="form-group">
                        <label htmlFor="newPassword">Nouveau mot de passe</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="update-password-button">Mettre à jour</button>
                </form>
            </div>
            <FooterComponent />
        </div>
    );
}

export default FirstConnectionComponent;
