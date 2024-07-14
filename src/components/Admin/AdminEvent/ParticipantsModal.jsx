import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ParticipantsModal = ({ isOpen, onRequestClose, eventId }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipants = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3030/events/${eventId}/invitations`);
                if (!response.ok) {
                    throw new Error('Failed to fetch participants');
                }
                const data = await response.json();
                setParticipants(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchParticipants();
        }
    }, [isOpen, eventId]);

    const getStatusEmoji = (status) => {
        switch (status) {
            case 'accepted':
                return '✅';
            case 'declined':
                return '❌';
            case 'pending':
            default:
                return '⏳';
        }
    };
    
    if (error) {
        Swal.fire('Erreur', error, 'error');
        return null;
    }

    return (
        <Modal show={isOpen} onHide={onRequestClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Participants</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map(invitation => (
                            <tr key={invitation.id}>
                                <td>{invitation.user.lastname}</td>
                                <td>{invitation.user.firstname}</td>
                                <td>{invitation.user.email}</td>
                                <td>{getStatusEmoji(invitation.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button variant="secondary" onClick={onRequestClose}>
                    Fermer
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ParticipantsModal;