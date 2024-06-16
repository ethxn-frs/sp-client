import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ChangePasswordModal = ({ show, handleClose, userId }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/users/${userId}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de la modification du mot de passe');
            }

            setErrorMessage('');
            handleClose();

            Swal.fire({
                title: 'Succès',
                text: 'Votre mot de passe a été modifié avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Modifier le mot de passe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formCurrentPassword">
                        <Form.Label>Mot de passe actuel</Form.Label>
                        <Form.Control
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            placeholder="Entrez votre mot de passe actuel"
                        />
                    </Form.Group>
                    <Form.Group controlId="formNewPassword">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Entrez votre nouveau mot de passe"
                        />
                    </Form.Group>
                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirmez votre nouveau mot de passe"
                        />
                    </Form.Group>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Fermer
                        </Button>
                        <Button variant="primary" type="submit">
                            Enregistrer
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePasswordModal;