import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';


const EventFormModal = ({ isOpen, onRequestClose, onSave, defaultStart, defaultEnd }) => {
    const [eventData, setEventData] = useState({
        title:'',
        startDate:'',
        endDate:'',
        lieu:'',
        activity:'',
        recurrence:'',
        statut:'',
        description:'',
        capacity:'',
        type: '',
        participants: [],
        clubs: [],
        trainingCenters: []
    })
  
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



    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        //onSave({ title, description, start: defaultStart, end: defaultEnd });
        await saveData()
        onRequestClose();
    };

    useEffect(() => {
        setStart(defaultStart ? defaultStart.toISOString().substring(0, 16) : '');
        setEnd(defaultEnd ? defaultEnd.toISOString().substring(0, 16) : '');
        fetchOptions()
    }, [defaultStart, defaultEnd]);

    /**
     * cette fonction fait appelle à trois api 
     * 
     * @returns trois objets des clubs,participants, et centre de formation
     */
    const getAllData = async () => {
        try {
            const [clubResponse, participantsResponse, trainingCentersResponse] = await Promise.all([
                fetch('http://localhost:3030/clubs', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }),
                fetch('http://localhost:3030/users', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }),
                fetch('http://localhost:3030/formations-centers', {
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

    /**
     * Cette fonction est utiliser pour enrégister les informations du formulaire 
     * en base de données
     */
    const saveData = async () =>{
        try{
            eventData.participants = participants;
            eventData.clubs =clubs;
            eventData.trainingCenters = trainingCenters
            const response = await fetch('http://localhost:3030/events', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
        
            if (!response.ok) {
                throw new Error('Échec de l\'inscription');
            }

            const result = await response.json();
            alert("Inscription réussie !");
        }catch(error){
        }
    }


    const fetchOptions = async () => {
        const data = await getAllData();
        if (data) {
            setParticipantsOptions(data.participants);
            setClubsOptions(data.clubs);
            setTrainingCentersOptions(data.trainingCenters);
        }
    };

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
        setParticipants(values);
    };

    const handleChangeclub = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => JSON.parse(option.value)) : [];
        setClubs(values);
    };

    const handleChangeformation = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => JSON.parse(option.value)) : [];
        setTrainingCenters(values);
    };

/**--------------------------------------------------------------------------------------------- */
    const [error, setError] = useState('');
    const handleChange =(event)=>{
        const { name, value } = event.target;    
        let newEventData = { ...eventData, [name]: value };

        if (name === 'startDate' || name === 'endDate') {
            
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

        setEventData(prevState => ({
            ...prevState,
            [name]: value
        }));
    
    }

    return (

        <div>
            <Modal show={isOpen} onHide={onRequestClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Control 
                            className="mb-3"
                            type="text"
                            name="title"
                            value={eventData.title}
                            onChange={handleChange}
                            required
                            placeholder='titre'
                        />

                        <Form.Control
                            className="mb-3"
                            type="datetime-local"
                            name="startDate"
                            value={eventData.startDate}
                            onChange={handleChange}
                            required
                            placeholder='titre'
                        />
                        <Form.Control
                            className="mb-3"
                            type="datetime-local"
                            name='endDate'
                            value={eventData.endDate}
                            onChange={handleChange}
                            required
                            placeholder='titre'
                        />

                        {error && <div className="text-danger">{error}</div>}

                        <Form.Control
                            className="mb-3"
                            type="test"
                            name='lieu'
                            value={eventData.lieu}
                            onChange={handleChange}
                            required
                            placeholder='lieu'
                        />
                        <Form.Control
                            className="mb-3"
                            type="test"
                            name='activity'
                            value={eventData.activity}
                            onChange={handleChange}
                            required
                            placeholder="type d'activté"
                        />
                        <Form.Control
                            className="mb-3"
                            type="test"
                            value={eventData.recurrence}
                            onChange={handleChange}
                            required
                            name='recurrence'
                            placeholder='recurrence'
                        />

                        <Form.Control
                            className="mb-3"
                            type="test"
                            value={eventData.statut}
                            onChange={handleChange}
                            required
                            name='statut'
                            placeholder='statut'
                        />

                        <Form.Control
                            className="mb-3"
                            type="number"
                            value={eventData.capacity}
                            onChange={handleChange}
                            required
                            name='capacity'
                            placeholder='capacité'
                        />

                        <Form.Control
                            className="mb-3"
                            type="text"
                            value={eventData.type}
                            onChange={handleChange}
                            required
                            name='type'
                            placeholder="type d'évènement"
                        />

                        <Form.Control
                            className="mb-3"
                            as="textarea"
                            value={eventData.description}
                            onChange={handleChange}
                            required
                            name='description'
                            placeholder='Description'
                        />

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
                         
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div >
    );
};

export default EventFormModal;
