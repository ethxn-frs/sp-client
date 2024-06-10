// src/components/AdminCreateClubComponent.jsx
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
        sports: []
    });
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState({});

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await fetch('http://localhost:4000/sports');
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
                    const response = await fetch(`http://localhost:4000/clubs/${id}`);
                    const data = await response.json();
                    setClub(data);
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

    const handleInputSport = (event) => {
        const sport = JSON.parse(event.target.value);
        setSelectedSport(sport);
    };

    const handleAddSport = () => {
        if (selectedSport && !club.sports.some(sport => sport.id === selectedSport.id)) {
            setClub(prevState => ({
                ...prevState,
                sports: [...prevState.sports, selectedSport]
            }));
            setSelectedSport({});
        }
    };

    const handleRemoveSport = (id) => {
        setClub(prevState => ({
            ...prevState,
            sports: prevState.sports.filter(sport => sport.id !== id)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `http://localhost:4000/clubs/${id}` : 'http://localhost:4000/clubs';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(club),
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
                            <Form onSubmit={handleSubmit}>
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
                                    {club.sports.map(sport => (
                                        <ListGroup.Item key={sport.id}>
                                            {sport.name}
                                            <Button variant="danger" size="sm" className="float-end" onClick={() => handleRemoveSport(sport.id)}>
                                                Supprimer
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Button variant="secondary" className="mt-3 ms-3" onClick={() => navigate('/admin/clubs')}>
                                    Annuler
                                </Button>
                                <Button type="submit" variant="success" className="mt-3">
                                    Créer
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
