import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            alert('Les mots de passe ne correspondent pas');
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

            alert('Mot de passe mis à jour avec succès');
            if (user.role === 'ADMIN_CLUB') {
                navigate('/club/home');
            } else {
                navigate('/admin/home');
            }
        } catch (error) {
            alert("Erreur lors de la mise à jour du mot de passe.");
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
