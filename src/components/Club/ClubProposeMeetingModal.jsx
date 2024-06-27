import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const ClubProposeMeetingModal = ({ show, handleClose, players, selectedPlayer, clubId, createdById }) => {
    const [meetingDetails, setMeetingDetails] = useState({
        player: selectedPlayer ? { value: selectedPlayer.id, label: `${selectedPlayer.firstName} ${selectedPlayer.lastName}` } : null,
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        place: '',
        clubId: clubId || null,
        createdById: createdById || null
    });

    useEffect(() => {
        if (selectedPlayer) {
            setMeetingDetails(prevState => ({
                ...prevState,
                player: { value: selectedPlayer.id, label: `${selectedPlayer.firstName} ${selectedPlayer.lastName}` }
            }));
        }
    }, [selectedPlayer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMeetingDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePlayerChange = (selectedOption) => {
        setMeetingDetails(prevState => ({
            ...prevState,
            player: selectedOption
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventProposalData = {
            title: meetingDetails.title,
            description: meetingDetails.description,
            startDate: meetingDetails.startDate,
            endDate: meetingDetails.endDate,
            place: meetingDetails.place,
            clubId: meetingDetails.clubId,
            createdById: meetingDetails.createdById,
            playerId: meetingDetails.player.value
        };

        try {
            const response = await fetch('http://localhost:4000/eventproposals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventProposalData),
            });

            if (!response.ok) {
                throw new Error('Failed to create event proposal');
            }

            const result = await response.json();
            console.log('Event proposal created:', result);
            Swal.fire({
                title: 'Proposition envoyée!',
                text: 'Votre proposition a bien été reçue. Nous reviendrons vers vous dès que possible.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            handleClose();
        } catch (error) {
            console.error('Error creating event proposal:', error);
            Swal.fire({
                title: 'Erreur',
                text: 'Impossible de créer cette proposition. Veuillez réessayer plus tard.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const playerOptions = players.map(player => ({
        value: player.id,
        label: `${player.firstName} ${player.lastName}`
    }));

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Proposer un rendez-vous</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formPlayer">
                        <Form.Label>Joueur</Form.Label>
                        <Select
                            options={playerOptions}
                            value={meetingDetails.player}
                            onChange={handlePlayerChange}
                            isSearchable
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={meetingDetails.title}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formStartDate">
                        <Form.Label>Date de début</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="startDate"
                            value={meetingDetails.startDate}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEndDate">
                        <Form.Label>Date de fin</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="endDate"
                            value={meetingDetails.endDate}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPlace">
                        <Form.Label>Lieu</Form.Label>
                        <Form.Control
                            type="text"
                            name="place"
                            value={meetingDetails.place}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={meetingDetails.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Proposer
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ClubProposeMeetingModal;
