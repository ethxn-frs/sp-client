import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function AdminCreateFormationCenterComponent() {
    const [signupData, setSignupData] = useState({
        name: '',
        address: '',
        email: '',
        sports: []
    });

    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState({});
    const navigate = useNavigate();

    const handleInputSport = (event) => {
        const sport = JSON.parse(event.target.value);
        setSelectedSport(sport);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSignupData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const fetchSports = async () => {
        try {
            const response = await fetch('http://localhost:3030/sports');
            const sportData = await response.json();
            setSports(sportData.sports);
        } catch (error) {
            console.error('Erreur lors de la récupération des sports:', error);
            alert("Erreur lors de la récupération des sports. Veuillez réessayer.");
        }
    };

    useEffect(() => {
        fetchSports();
    }, []);

    const handleAddSport = () => {
        if (selectedSport && !signupData.sports.some(sport => sport.id === selectedSport.id)) {
            setSignupData(prevState => ({
                ...prevState,
                sports: [...prevState.sports, selectedSport]
            }));
            setSelectedSport({});
        }
    };

    const handleRemoveSport = (id) => {
        setSignupData(prevState => ({
            ...prevState,
            sports: prevState.sports.filter(sport => sport.id !== id)
        }));
    };

    const handleSignupSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3030/formations-centers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: signupData.name,
                    email: signupData.email,
                    address: signupData.address,
                    sports: signupData.sports
                })
            });

            if (!response.ok) {
                throw new Error('Échec de la création du centre de formation');
            }

            alert("Centre de formation créé avec succès !");
            navigate('/admin/formations-centers');
        } catch (error) {
            console.error('Erreur lors de la création du centre de formation:', error);
            alert("Erreur lors de la création du centre de formation.");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Créer un Centre de Formation</Card.Title>
                            <Form onSubmit={handleSignupSubmit}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nom du centre de formation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={signupData.name}
                                        onChange={handleInputChange}
                                        placeholder="Nom"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formAddress" className="mt-3">
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={signupData.address}
                                        onChange={handleInputChange}
                                        placeholder="Adresse"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formEmail" className="mt-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={signupData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
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
                                    {signupData.sports.map(sport => (
                                        <ListGroup.Item key={sport.id}>
                                            {sport.name}
                                            <Button variant="danger" size="sm" className="float-end" onClick={() => handleRemoveSport(sport.id)}>
                                                Supprimer
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                                <Button type="submit" variant="success" className="mt-3" style={{ width: '100%' }}>
                                    Créer un centre de formation
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminCreateFormationCenterComponent;
