import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminClubComponent.css';

function AdminCreateClubComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [club, setClub] = useState({
        name: '',
        address: '',
        email: '',
        sports: []  // Will hold the selected sport IDs
    });
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState({});
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await fetch('http://localhost:3030/sports');
                const data = await response.json();
                setSports(data.sports);
            } catch (error) {
                console.error('Erreur lors de la récupération des sports:', error);
                alert('Erreur lors de la récupération des sports.');
            }
        };

        const fetchClub = async () => {
            if (id) {
                try {
                    const response = await fetch(`http://localhost:3030/clubs/${id}`);
                    const data = await response.json();
                    setClub({
                        ...data,
                        sports: data.sports.map(sport => sport.id) // Extracting sport IDs
                    });
                } catch (error) {
                    console.error('Erreur lors de la récupération du club:', error);
                    alert('Erreur lors de la récupération du club.');
                }
            }
        };

        fetchSports();
        fetchClub();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClub((prevClub) => ({
            ...prevClub,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleInputSport = (event) => {
        const sport = JSON.parse(event.target.value);
        setSelectedSport(sport);
    };

    const handleAddSport = () => {
        if (selectedSport && !club.sports.includes(selectedSport.id)) {
            setClub(prevState => ({
                ...prevState,
                sports: [...prevState.sports, selectedSport.id] // Adding sport ID
            }));
            setSelectedSport({});
        }
    };

    const handleRemoveSport = (id) => {
        setClub(prevState => ({
            ...prevState,
            sports: prevState.sports.filter(sportId => sportId !== id) // Removing sport ID
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `http://localhost:3030/clubs/${id}` : 'http://localhost:3030/clubs';
            const formData = new FormData();
            formData.append('name', club.name);
            formData.append('address', club.address);
            formData.append('email', club.email);
            formData.append('sports', JSON.stringify(club.sports)); // Converting sports IDs array to JSON string
            if (file) {
                formData.append('image', file);
            }

            const response = await fetch(url, {
                method,
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde du club');
            }
            navigate('/admin/clubs');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du club:', error);
            alert('Erreur lors de la sauvegarde du club.');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">{id ? 'Modifier le Club' : 'Ajouter un Club'}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Form.Group controlId="formName">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={club.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddress" className="mt-3">
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={club.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail" className="mt-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={club.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formSport" className="mt-3">
                                    <Form.Label>Associer un sport</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={JSON.stringify(selectedSport)}
                                        onChange={handleInputSport}
                                        required
                                    >
                                        <option value="" disabled>Sélectionner un sport</option>
                                        {sports.map(sport => (
                                            <option key={sport.id} value={JSON.stringify(sport)}>
                                                {sport.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" className="mt-3" onClick={handleAddSport} disabled={!selectedSport.id}>
                                    Ajouter le sport
                                </Button>
                                <ListGroup className="mt-3">
                                    {club.sports.map(sportId => {
                                        const sport = sports.find(s => s.id === sportId);
                                        return (
                                            <ListGroup.Item key={sportId}>
                                                {sport?.name}
                                                <Button variant="danger" size="sm" className="float-end" onClick={() => handleRemoveSport(sportId)}>
                                                    Supprimer
                                                </Button>
                                            </ListGroup.Item>
                                        );
                                    })}
                                </ListGroup>
                                <Form.Group controlId="formFile" className="mt-3">
                                    <Form.Label>Photo de profil</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        onChange={handleFileChange}
                                    />
                                </Form.Group>
                                <Button variant="secondary" className="mt-3 ms-3" onClick={() => navigate('/admin/clubs')}>
                                    Annuler
                                </Button>
                                <Button type="submit" variant="success" className="mt-3">
                                    {id ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminCreateClubComponent;