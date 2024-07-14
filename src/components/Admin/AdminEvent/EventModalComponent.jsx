import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
import './EventFormModal.css'; // Ajoutez cette ligne pour importer le fichier CSS

const EventFormModal = ({ isOpen, onRequestClose, onSave, defaultStart, defaultEnd }) => {
    const [eventData, setEventData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        lieu: '',
        description: '',
        type: '',
        clubs: [],
        trainingCenters: [],
        users: []
    });

    const [participantsOptions, setParticipantsOptions] = useState([]);
    const [clubsOptions, setClubsOptions] = useState([]);
    const [trainingCentersOptions, setTrainingCentersOptions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        setEventData(prevState => ({
            ...prevState,
            startDate: defaultStart ? defaultStart.toISOString().substring(0, 16) : '',
            endDate: defaultEnd ? defaultEnd.toISOString().substring(0, 16) : ''
        }));
        fetchOptions();
    }, [defaultStart, defaultEnd]);

    const fetchOptions = async () => {
        try {
            const [clubsResponse, trainingCentersResponse, usersResponse] = await Promise.all([
                fetch('http://localhost:3030/clubs'),
                fetch('http://localhost:3030/formations-centers'),
                fetch('http://localhost:3030/users')
            ]);

            if (!clubsResponse.ok || !trainingCentersResponse.ok || !usersResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const [clubsData, trainingCentersData, usersData] = await Promise.all([
                clubsResponse.json(),
                trainingCentersResponse.json(),
                usersResponse.json()
            ]);

            setClubsOptions(clubsData.clubs);
            setTrainingCentersOptions(trainingCentersData.formationsCenters);
            setParticipantsOptions(usersData.user);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'startDate' || name === 'endDate') {
            const startDateValid = Date.parse(eventData.startDate);
            const endDateValid = Date.parse(eventData.endDate);

            if (startDateValid && endDateValid) {
                const startDate = new Date(eventData.startDate);
                const endDate = new Date(eventData.endDate);

                if (startDate > endDate) {
                    setError('La date de fin doit être supérieure ou égale à la date de début');
                } else if (startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0] && startDate >= endDate) {
                    setError('L\'heure de fin doit être supérieure à l\'heure de début si les dates sont égales');
                    setEventData(prevState => ({
                        ...prevState,
                        endDate: ''
                    }));
                } else {
                    setError('');
                }
            } else {
                setError('');
            }
        }
    };

    const handleSelectChange = (selectedOptions, field) => {
        const values = selectedOptions ? selectedOptions.map(option => JSON.parse(option.value)) : [];
        setEventData(prevState => ({
            ...prevState,
            [field]: values
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3030/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error('Failed to save event');
            }

            const result = await response.json();
            Swal.fire({
                title: 'Succès',
                text: 'Événement créé avec succès!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            onRequestClose();
        } catch (error) {
            console.error("Error saving event:", error);
            Swal.fire({
                title: 'Erreur',
                text: 'Échec de la création de l\'événement.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const optionsClubs = clubsOptions.map(club => ({
        value: JSON.stringify(club),
        label: club.name
    }));

    const optionsUsers = participantsOptions.map(participant => ({
        value: JSON.stringify(participant),
        label: participant.firstname + ' ' + participant.lastname + ' (' + participant.email + ')'
    }));

    const optionsFormationCenters = trainingCentersOptions.map(formationcenter => ({
        value: JSON.stringify(formationcenter),
        label: formationcenter.name
    }));

    return (
        <Modal show={isOpen} onHide={onRequestClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Créer un Nouvel Événement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={eventData.title}
                            onChange={handleChange}
                            required
                            placeholder='Titre'
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date de Début</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="startDate"
                            value={eventData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date de Fin</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name='endDate'
                            value={eventData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <Form.Group className="mb-3">
                        <Form.Label>Lieu</Form.Label>
                        <Form.Control
                            type="text"
                            name='lieu'
                            value={eventData.lieu}
                            onChange={handleChange}
                            required
                            placeholder='Lieu'
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Type d'Événement</Form.Label>
                        <Form.Control
                            type="text"
                            name='type'
                            value={eventData.type}
                            onChange={handleChange}
                            required
                            placeholder='Type d\’évenement'
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name='description'
                            value={eventData.description}
                            onChange={handleChange}
                            required
                            placeholder='Description'
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Utilisateurs</Form.Label>
                        <Select
                            placeholder="Sélectionnez les Utilisateurs"
                            isMulti
                            name="users"
                            options={optionsUsers}
                            value={optionsUsers.filter(option => eventData.users.map(user => JSON.stringify(user)).includes(option.value))}
                            onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'users')}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isSearchable
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Clubs</Form.Label>
                        <Select
                            placeholder="Sélectionnez les Clubs"
                            isMulti
                            name="clubs"
                            options={optionsClubs}
                            value={optionsClubs.filter(option => eventData.clubs.map(club => JSON.stringify(club)).includes(option.value))}
                            onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'clubs')}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Centres de Formation</Form.Label>
                        <Select
                            placeholder="Sélectionnez les Centres de Formation"
                            isMulti
                            name="trainingCenters"
                            options={optionsFormationCenters}
                            value={optionsFormationCenters.filter(option => eventData.trainingCenters.map(tc => JSON.stringify(tc)).includes(option.value))}
                            onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'trainingCenters')}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Enregistrer
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EventFormModal;