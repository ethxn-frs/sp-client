import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ChangePasswordModal from './ChangePasswordModal'; // Importez le composant de la nouvelle modale

const EditProfileModal = ({ show, handleClose, user }) => {
    const [formData, setFormData] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        email: user.email
    });

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openChangePasswordModal = (open) => {
        setShowChangePasswordModal(open);
        handleClose();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implémentez la logique de soumission ici
        console.log(formData);
        handleClose();
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