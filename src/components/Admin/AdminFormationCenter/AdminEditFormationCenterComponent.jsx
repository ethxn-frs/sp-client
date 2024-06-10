import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminEditFormationCenterComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formationCenterData, setFormationCenterData] = useState({
        name: '',
        address: '',
        email: '',
        sports: []
    });

    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState({});

    const handleInputSport = (event) => {
        const sport = JSON.parse(event.target.value);
        setSelectedSport(sport);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormationCenterData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const fetchSports = async () => {
        try {
            const response = await fetch('http://localhost:4000/sports');
            const sportData = await response.json();
            setSports(sportData.sports);
        } catch (error) {
            console.error('Erreur lors de la récupération des sports:', error);
            alert("Erreur lors de la récupération des sports. Veuillez réessayer.");
        }
    };

    const fetchFormationCenter = async () => {
        try {
            const response = await fetch(`http://localhost:4000/formations-centers/${id}`);
            const data = await response.json();
            setFormationCenterData(data);
        } catch (error) {
            console.error('Erreur lors de la récupération du centre de formation:', error);
            alert('Erreur lors de la récupération du centre de formation.');
        }
    };

    useEffect(() => {
        fetchSports();
        fetchFormationCenter();
    }, [id]);

    const handleAddSport = () => {
        if (selectedSport && !formationCenterData.sports.some(sport => sport.Id === selectedSport.Id)) {
            setFormationCenterData(prevState => ({
                ...prevState,
                sports: [...prevState.sports, selectedSport]
            }));
            setSelectedSport({});
        }
    };

    const handleRemoveSport = (id) => {
        setFormationCenterData(prevState => ({
            ...prevState,
            sports: prevState.sports.filter(sport => sport.id !== id)
        }));
    };

    const handleSaveChanges = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/formations-centers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formationCenterData.name,
                    email: formationCenterData.email,
                    address: formationCenterData.address,
                    sports: formationCenterData.sports
                })
            });

            if (!response.ok) {
                throw new Error('Échec de la modification du centre de formation');
            }

            alert("Centre de formation modifié avec succès !");
            navigate('/admin/formations-centers');
        } catch (error) {
            console.error('Erreur lors de la modification du centre de formation:', error);
            alert("Erreur lors de la modification du centre de formation.");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Modifier le Centre de Formation</Card.Title>
                            <Form onSubmit={handleSaveChanges}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nom du centre de formation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formationCenterData.name}
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
                                        value={formationCenterData.address}
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
                                        value={formationCenterData.email}
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

                                <Button variant="primary" className="mt-3" onClick={handleAddSport} disabled={!selectedSport.Id}>
                                    Ajouter le sport
                                </Button>

                                <ListGroup className="mt-3">
                                    {formationCenterData.sports.map(sport => (
                                        <ListGroup.Item key={sport.id}>
                                            {sport.name}
                                            <Button variant="danger" size="sm" className="float-end" onClick={() => handleRemoveSport(sport.Id)}>
                                                Supprimer
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                                <Button type="submit" variant="success" className="mt-3" style={{ width: '100%' }}>
                                    Enregistrer les modifications
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminEditFormationCenterComponent;
