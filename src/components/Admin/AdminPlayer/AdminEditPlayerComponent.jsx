import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminEditPlayerComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playerData, setPlayerData] = useState({
        id: id,
        firstName: null,
        lastName: null,
        birthDate: null,
        formationCenterId: null,
        sportId: null,
        height: null,
        weight: null,
        stats: {}
    });
    const [initialPlayerData, setInitialPlayerData] = useState({});
    const [formationCenters, setFormationCenters] = useState([]);
    const [sports, setSports] = useState([]);
    const [sportStats, setSportStats] = useState([]);

    const handleBack = () => {
        navigate('/admin/players');
    };

    useEffect(() => {
        const fetchFormationCenters = async () => {
            try {
                const response = await fetch('http://localhost:3030/formations-centers');
                const data = await response.json();
                setFormationCenters(data.formationsCenters || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des centres de formation:', error);
                Swal.fire('Erreur', 'Erreur lors de la récupération des centres de formation.', 'error');
            }
        };

        const fetchSports = async () => {
            try {
                const response = await fetch('http://localhost:3030/sports');
                const data = await response.json();
                setSports(data.sports || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des sports:', error);
                Swal.fire('Erreur', 'Erreur lors de la récupération des sports.', 'error');
            }
        };

        const fetchPlayer = async () => {
            try {
                const response = await fetch(`http://localhost:3030/players/${id}`);
                const data = await response.json();
                const playerInitialData = {
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    birthDate: new Date(data.birthDate).toISOString().split('T')[0],
                    formationCenterId: data.formationCenter.id,
                    sportId: data.sport.id,
                    height: data.height || null,
                    weight: data.weight || null,
                    stats: data.stats || {}
                };
                setPlayerData(playerInitialData);
                setInitialPlayerData(playerInitialData);
                updateSportStats(data.sport.id);
            } catch (error) {
                console.error('Erreur lors de la récupération du joueur:', error);
                Swal.fire('Erreur', 'Erreur lors de la récupération du joueur.', 'error');
            }
        };

        fetchFormationCenters();
        fetchSports();
        fetchPlayer();
    }, [id]);

    const updateSportStats = (sportId) => {
        if (parseInt(sportId) === 1) { // Assuming 1 is the ID for Football
            setSportStats(['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']);
        } else if (parseInt(sportId) === 2) { // Assuming 2 is the ID for Basketball
            setSportStats(['PTS', 'REB', 'AST', 'STL', 'BLK']);
        } else {
            setSportStats([]);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPlayerData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleStatsChange = (event) => {
        const { name, value } = event.target;
        setPlayerData((prevState) => ({
            ...prevState,
            stats: {
                ...prevState.stats,
                [name]: parseInt(value, 10),
            }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const confirmed = await Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous allez enregistrer les modifications!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, enregistrer!',
            cancelButtonText: 'Annuler'
        });

        if (!confirmed.isConfirmed) {
            return;
        }

        // Construire l'objet de données mis à jour
        const updatedData = Object.keys(playerData).reduce((acc, key) => {
            if (JSON.stringify(playerData[key]) !== JSON.stringify(initialPlayerData[key])) {
                acc[key] = playerData[key];
            }
            acc.id = playerData.id
            return acc;
        }, {});

        try {
            const response = await fetch(`http://localhost:3030/players/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Échec de la modification du joueur');
            }

            Swal.fire('Succès', 'Joueur modifié avec succès!', 'success');
            navigate('/admin/players');
        } catch (error) {
            console.error('Erreur lors de la modification du joueur:', error);
            Swal.fire('Erreur', 'Erreur lors de la modification du joueur.', 'error');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={10}>
                    <h2 className="text-center mb-4">Modifier le Joueur</h2>
                    <Form onSubmit={handleSubmit} className='d-flex flex-wrap justify-content-between'>
                        <Card className="mb-4 flex-fill mr-2" style={{ flex: '0 0 48%' }}>
                            <Card.Header as="h5">Informations de base</Card.Header>
                            <Card.Body>
                                <Form.Group controlId="formFirstName" className="mb-2">
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={playerData.firstName || ''}
                                        onChange={handleInputChange}
                                        placeholder="Prénom"
                                        required
                                        size="sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formLastName" className="mb-2">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={playerData.lastName || ''}
                                        onChange={handleInputChange}
                                        placeholder="Nom"
                                        required
                                        size="sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBirthDate" className="mb-2">
                                    <Form.Label>Date de Naissance</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="birthDate"
                                        value={playerData.birthDate || ''}
                                        onChange={handleInputChange}
                                        required
                                        size="sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formHeight" className="mb-2">
                                    <Form.Label>Taille (cm)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="height"
                                        value={playerData.height || ''}
                                        onChange={handleInputChange}
                                        placeholder="Taille"
                                        size="sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formWeight" className="mb-2">
                                    <Form.Label>Poids (kg)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="weight"
                                        value={playerData.weight || ''}
                                        onChange={handleInputChange}
                                        placeholder="Poids"
                                        size="sm"
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4 flex-fill" style={{ flex: '0 0 100%' }}>
                            <Card.Header as="h5">Club et Sport</Card.Header>
                            <Card.Body>
                                <Form.Group controlId="formFormationCenter" className="mb-2">
                                    <Form.Label>Centre de Formation</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="formationCenterId"
                                        value={playerData.formationCenterId || ''}
                                        onChange={handleInputChange}
                                        required
                                        size="sm"
                                    >
                                        <option value="">Sélectionner un centre de formation</option>
                                        {formationCenters.length > 0 && formationCenters.map((center) => (
                                            <option key={center.id} value={center.id}>
                                                {center.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="formSport" className="mb-2">
                                    <Form.Label>Sport</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="sportId"
                                        value={playerData.sportId || ''}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            updateSportStats(e.target.value);
                                        }}
                                        required
                                        size="sm"
                                    >
                                        <option value="">Sélectionner un sport</option>
                                        {sports.length > 0 && sports.map((sport) => (
                                            <option key={sport.id} value={sport.id}>
                                                {sport.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4 flex-fill mr-2" style={{ flex: '0 0 48%' }}>
                            <Card.Header as="h5">Statistiques</Card.Header>
                            <Card.Body>
                                {sportStats.length > 0 && sportStats.map((stat) => (
                                    <Form.Group key={stat} controlId={`form${stat}`} className="mb-2">
                                        <Form.Label>{stat}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name={stat}
                                            value={playerData.stats[stat] || ''}
                                            onChange={handleStatsChange}
                                            placeholder={stat}
                                            size="sm"
                                        />
                                    </Form.Group>
                                ))}
                            </Card.Body>
                        </Card>

                        <Button onClick={handleBack} variant="warning" className="w-25 mb-5">
                            Retour
                        </Button>
                        <Button type="submit" variant="success" className="w-25 mb-5">
                            Enregistrer
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminEditPlayerComponent;
