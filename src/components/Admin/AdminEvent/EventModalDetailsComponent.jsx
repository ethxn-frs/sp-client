import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './EventModalDetails.css';
import ParticipantsModal from './ParticipantsModal';

const EventModalDetails = ({ isOpen, onRequestClose, event, onDelete }) => {
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleOpenParticipantsModal = () => {
        setShowParticipantsModal(true);
    };

    const handleCloseParticipantsModal = () => {
        setShowParticipantsModal(false);
    };

    return (
        <Modal show={isOpen} onHide={onRequestClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Détails de l'événement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="event-details">
                    <h1 className="event-title">{event?.title}</h1>
                    <p><strong>Type :</strong> {event?.type}</p>
                    <p><strong>Lieu :</strong> {event?.lieu}</p>
                    <p><strong>Date de début :</strong> {formatDate(event?.start)}</p>
                    <p><strong>Date de fin :</strong> {formatDate(event?.end)}</p>
                    <p><strong>Description :</strong> {event?.description}</p>
                    <p><strong>Clubs :</strong> {event?.clubs?.map(c => c.name).join(', ')}</p>
                    <p><strong>Centres de formation :</strong> {event?.trainingCenters?.map(tc => tc.name).join(', ')}</p>
                </div>
                <div className="modal-buttons">
                    <Button variant="secondary" onClick={onRequestClose}>
                        Fermer
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(event?.id)}>
                        Supprimer
                    </Button>
                    <Button variant="primary" onClick={handleOpenParticipantsModal}>
                        Voir les participants
                    </Button>
                </div>
            </Modal.Body>
            <ParticipantsModal
                isOpen={showParticipantsModal}
                onRequestClose={handleCloseParticipantsModal}
                eventId={event?.id}
            />
        </Modal>
    );
};

export default EventModalDetails;