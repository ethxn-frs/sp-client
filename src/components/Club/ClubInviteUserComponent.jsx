import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ClubInviteUserComponent = ({ show, handleClose, hostId }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        birthDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3030/users/${hostId}/invite-user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l\'invitation de l\'utilisateur');
            }

            handleClose();

            Swal.fire({
                title: 'Succès',
                text: 'Utilisateur invité avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Inviter un utilisateur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Entrez l'email"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formFirstName">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Entrez le prénom"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLastName">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Entrez le nom"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formAddress">
                        <Form.Label>Adresse</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Entrez l'adresse"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBirthDate">
                        <Form.Label>Date de naissance</Form.Label>
                        <Form.Control
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Fermer
                        </Button>
                        <Button variant="primary" type="submit">
                            Envoyer
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ClubInviteUserComponent;