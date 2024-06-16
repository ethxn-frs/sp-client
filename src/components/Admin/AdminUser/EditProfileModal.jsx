import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ChangePasswordModal from './ChangePasswordModal';
import Swal from 'sweetalert2';

const EditProfileModal = ({ show, handleClose, user }) => {
    const [formData, setFormData] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        email: user.email,
        newsletter: user.newsletter,
        a2fEnabled: user.a2fEnabled,
    });

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const openChangePasswordModal = (open) => {
        setShowChangePasswordModal(open);
        handleClose();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFields = {};
        if (formData.firstname !== user.firstname) updatedFields.firstName = formData.firstname;
        if (formData.lastname !== user.lastname) updatedFields.lastName = formData.lastname;
        if (formData.address !== user.address) updatedFields.address = formData.address;
        if (formData.newsletter !== user.newsletter) updatedFields.newsletter = formData.newsletter;
        if (formData.a2fEnabled !== user.a2fEnabled) updatedFields.a2fEnabled = formData.a2fEnabled;

        try {
            const response = await fetch(`http://localhost:4000/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedFields)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
            }

            const result = await response.json();

            // Mise à jour du localStorage avec les nouvelles informations utilisateur
            const updatedUser = { ...user, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            handleClose();

            Swal.fire({
                title: 'Succès',
                text: 'Votre profil a été mis à jour avec succès.',
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
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le profil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formFirstname">
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        placeholder="Entrez votre prénom"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formLastname">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        placeholder="Entrez votre nom"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Entrez votre adresse"
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                placeholder="Votre email"
                            />
                        </Form.Group>
                        <Form.Group controlId="formNewsletter">
                            <Form.Check 
                                type="checkbox" 
                                name="newsletter" 
                                label="S'abonner à la newsletter" 
                                checked={formData.newsletter} 
                                onChange={handleChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formA2FEnabled">
                            <Form.Check 
                                type="checkbox" 
                                name="a2fEnabled" 
                                label="Activer l'authentification à deux facteurs" 
                                checked={formData.a2fEnabled} 
                                onChange={handleChange} 
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                Fermer
                            </Button>
                            <Button variant="primary" type="submit" className="me-2">
                                Enregistrer
                            </Button>
                            <Button variant="link" onClick={() => openChangePasswordModal(true)} className="text-decoration-none">
                                Modifier le mot de passe
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <ChangePasswordModal
                show={showChangePasswordModal}
                handleClose={() => setShowChangePasswordModal(false)}
                userId={user.id}
            />
        </>
    );
};

export default EditProfileModal;
