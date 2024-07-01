import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const TrainingCenterInviteUserComponent = ({ show, handleClose, hostId }) => {
    const [email, setEmail] = useState('');

    const handleInviteUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/formation-centers/${hostId}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Failed to invite user');
            }

            Swal.fire('Succès!', 'Utilisateur invité avec succès.', 'success');
            handleClose();
        } catch (error) {
            Swal.fire('Erreur!', error.message, 'error');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Inviter un utilisateur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleInviteUser}>
                    <Form.Group controlId="formUserEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Entrez l'email de l'utilisateur"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Fermer
                        </Button>
                        <Button variant="primary" type="submit">
                            Inviter
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TrainingCenterInviteUserComponent;
