import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';


const EventModalDetails = ({ isOpen, onRequestClose, onSave, children, onDelete }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(children);

    const [participants, setParticipants] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [trainingCenters, setTrainingCenters] = useState([]);


    /**
     * on récupère la liste des users, clubs et centre de formations
     * chaque liste est un objet
     */
    const [participantsOptions, setParticipantsOptions] = useState([]);
    const [clubsOptions, setClubsOptions] = useState([]);
    const [trainingCentersOptions, setTrainingCentersOptions] = useState([]);


    const handleEditClick = () => {
        setIsEditing(true);
    };
    const [error, setError] = useState('');
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newEventData = { ...formData, [name]: value };

        if (name === 'start' || name === 'end') {

            const startDateValid = Date.parse(newEventData.startDate);
            const endDateValid = Date.parse(newEventData.endDate);

            if (startDateValid && endDateValid) {
                const startDate = new Date(newEventData.startDate);
                const endDate = new Date(newEventData.endDate);

                if (startDate > endDate) {
                    setError('La date de fin doit être supérieure ou égale à la date de début');
                } else if (startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0] && startDate >= endDate) {
                    setError('L\'heure de fin doit être supérieure à l\'heure de début si les dates sont égales');
                    newEventData.endDate = '';
                } else {
                    setError('');
                }
            } else {
                setError('');
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveClick = () => {
        formData.participants = participants
        formData.clubs = clubs
        formData.trainingCenters = trainingCenters
        formData.Id = children.id
        console.log("formData", formData)
        onSave(formData);
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        onDelete(children.id);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    /**
     * cette fonction fait appelle à trois api 
     * 
     * @returns trois objets des clubs,participants, et centre de formation
     */
    const getAllData = async () => {
        try {
            const [clubResponse, participantsResponse, trainingCentersResponse] = await Promise.all([
                fetch('http://localhost:4000/clubs', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }),
                fetch('http://localhost:4000/users', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }),
                fetch('http://localhost:4000/formations-centers', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
            ]);

            if (!clubResponse.ok || !participantsResponse.ok || !trainingCentersResponse.ok) {
                throw new Error('Échec de la récupération des données');
            }

            const [clubData, participantsData, trainingCentersData] = await Promise.all([
                clubResponse.json(),
                participantsResponse.json(),
                trainingCentersResponse.json()
            ]);

            return {
                clubs: clubData.club,
                participants: participantsData.user,
                trainingCenters: trainingCentersData.formation
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            return null;
        }
    };

    const fetchOptions = async () => {
        const data = await getAllData();
        if (data) {

            console.log("data", data)
            setParticipantsOptions(data.participants);
            setClubsOptions(data.clubs);
            setTrainingCentersOptions(data.trainingCenters);
        }
    };

    useEffect(() => {
        fetchOptions()
    }, []);

    /**
    * ici nous récupérons une list d'option {clé, valeur } afin de pourvoir 
    * l'afficher dans un selecteur
    */
    const optionsclube = clubsOptions.map(club => ({
        value: JSON.stringify(club),
        label: club.Name
    }));

    const optionsusers = participantsOptions.map(participant => ({
        value: JSON.stringify(participant),
        label: participant.firstname + ' ' + participant.lastname
    }));

    const optionsformation = trainingCentersOptions.map(formationcenter => ({
        value: JSON.stringify(formationcenter),
        label: formationcenter.Name
    }));

    /**
    * cette fonction est utiliser pour affecter les valeurs des participants sélectionner 
    * dans le select.
    * il est de même pour handleChangeclub,handleChangeformation et handleChange
    * @param {*} selectedOptions 
    */
    const handleChangeuser = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => JSON.parse(option.value)) : [];
        console.log("handleChangeuser", values);
        setParticipants(values);
    };

    const handleChangeclub = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => JSON.parse(option.value)) : [];
        console.log("handleChangeclub", values);
        setClubs(values);
    };

    const handleChangeformation = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => JSON.parse(option.value)) : [];
        console.log("handleChangeformation", values);

        setTrainingCenters(values);
    };

    return (
        <div>
            <Modal show={isOpen} onHide={onRequestClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'évènement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isEditing ? (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Lieu</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lieu"
                                    value={formData.lieu}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date et heure de début</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="start"
                                    value={formData.start}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date et heure de fin</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="end"
                                    value={formData.end}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            {error && <div className="text-danger">{error}</div>}
                            <Form.Group className="mb-3">
                                <Form.Control
                                    className="mb-3"
                                    type="test"
                                    name='activity'
                                    value={formData.activity}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="type d'activté"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    className="mb-3"
                                    type="test"
                                    value={formData.recurrence}
                                    onChange={handleInputChange}
                                    required
                                    name='recurrence'
                                    placeholder='recurrence'
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    className="mb-3"
                                    type="test"
                                    value={formData.statut}
                                    onChange={handleInputChange}
                                    required
                                    name='statut'
                                    placeholder='statut'
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Capacité</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <div className="mb-3">
                                <Select
                                    placeholder="utilisateurs"
                                    isMulti
                                    name="utilisateurs"
                                    options={optionsusers}
                                    value={optionsusers.filter(option => participants.map(p => JSON.stringify(p)).includes(option.value))}
                                    onChange={handleChangeuser}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </div>

                            <div className="mb-3">
                                <Select
                                    placeholder="clubs"
                                    isMulti
                                    name="clubs"
                                    options={optionsclube}
                                    value={optionsclube.filter(option => clubs.map(c => JSON.stringify(c)).includes(option.value))}
                                    onChange={handleChangeclub}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </div>
                            <div className="mb-3">
                                <Select
                                    placeholder="centre de formation"
                                    isMulti
                                    name="formation"
                                    options={optionsformation}
                                    value={optionsformation.filter(option => trainingCenters.map(tc => JSON.stringify(tc)).includes(option.value))}
                                    onChange={handleChangeformation}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </div>
                            <Button variant="primary" onClick={handleSaveClick}>
                                Save
                            </Button>
                        </Form>
                    ) : (
                        <div>
                            <h1>{children.title}</h1>
                            <p>Type : {children.type}</p>
                            <p>Lieu : {children.lieu}</p>
                            {/* <p>Date et heure de début : {formatDate(children.start)}</p>
                            <p>Date et heure de fin : {formatDate(children.end)}</p> */}
                            <p>Capacité : {children.capacity}</p>
                            <p>Description : {children.description}</p>
                            <Button variant="secondary" onClick={handleEditClick}>
                                Modifier
                            </Button>
                            <Button variant="danger" onClick={handleDeleteClick}>
                                Supprimer
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EventModalDetails;
