import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const TrainingCenterProposeMeetingModal = ({ show, handleClose, players, selectedPlayer, formationCenterId, createdById }) => {
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');

    const handleProposeMeeting = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3030/meetings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    playerId: selectedPlayer.id,
                    formationCenterId,
                    createdById,
                    meetingDate,
                    meetingTime
                })
            });

            if (!response.ok) {
                throw new Error('Failed to propose meeting');
            }

            Swal.fire('Succès!', 'Rendez-vous proposé avec succès.', 'success');
            handleClose();
        } catch (error) {
            Swal.fire('Erreur!', error.message, 'error');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Proposer un rendez-vous</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleProposeMeeting}>
                    <Form.Group controlId="formMeetingDate">
                        <Form.Label>Date du rendez-vous</Form.Label>
                        <Form.Control
                            type="date"
                            value={meetingDate}
                            onChange={(e) => setMeetingDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formMeetingTime">
                        <Form.Label>Heure du rendez-vous</Form.Label>
                        <Form.Control
                            type="time"
                            value={meetingTime}
                            onChange={(e) => setMeetingTime(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Fermer
                        </Button>
                        <Button variant="primary" type="submit">
                            Proposer
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TrainingCenterProposeMeetingModal;
