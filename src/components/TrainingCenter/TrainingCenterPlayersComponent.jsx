import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import './TrainingCenterPlayersComponent.css';

const TrainingCenterPlayersComponent = () => {
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState('');
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formationCenterId, setFormationCenterId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        sportId: '',
        height: '',
        weight: ''
    });

    const userStorage = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchFormationCenter = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/${userStorage.id}/formation-center`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Error fetching formation center: ${response.status} (${response.statusText})`);
                }

                const formationCenterResponse = await response.json();
                setFormationCenterId(formationCenterResponse.id);
                fetchPlayers(formationCenterResponse.id);
            } catch (error) {
                console.error('Error fetching formation center:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSports = async () => {
            try {
                const response = await fetch('http://localhost:3030/sports');
                const data = await response.json();
                setSports(data.sports);
            } catch (error) {
                console.error('Error fetching sports:', error);
            }
        };

        fetchFormationCenter();
        fetchSports();
    }, [userStorage.id]);

    const fetchPlayers = async (formationCenterId) => {
        try {
            const response = await fetch(`http://localhost:3030/formation-centers/${formationCenterId}/players`);
            const data = await response.json();
            setPlayers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching players:', error);
            setLoading(false);
        }
    };

    const handleSportChange = (e) => {
        setSelectedSport(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3030/playerProposals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, formationCenterId }),
            });

            if (!response.ok) {
                throw new Error('Failed to propose player');
            }

            setShowModal(false);
            setFormData({
                firstName: '',
                lastName: '',
                birthDate: '',
                email: '',
                sportId: '',
                height: '',
                weight: ''
            });

            Swal.fire({
                title: 'Succès!',
                text: 'La proposition de joueur a été soumise avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error('Error proposing player:', error);
            Swal.fire({
                title: 'Erreur!',
                text: 'Erreur lors de la proposition du joueur.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const filteredPlayers = selectedSport
        ? players.filter(player => player.sport.name === selectedSport)
        : players;

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center">Mes Joueurs</h2>
            <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
                Proposer un joueur
            </Button>
            <Form.Group controlId="sportFilter" className="mb-4">
                <Form.Label>Filtrer par sport</Form.Label>
                <Form.Control as="select" value={selectedSport} onChange={handleSportChange}>
                    <option value="">Tous les sports</option>
                    {sports.map(sport => (
                        <option key={sport.id} value={sport.name}>{sport.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Row>
                {filteredPlayers.map(player => (
                    <Col md={4} key={player.id} className="mb-4">
                        <Card className="player-card shadow-sm">
                            <Card.Img variant="top" src={player.image ? player.image.path : `https://via.placeholder.com/150`} />
                            <Card.Body>
                                <Card.Title>{player.firstName} {player.lastName}</Card.Title>
                                <Card.Text>
                                    <strong>Sport:</strong> {player.sport.name} <br />
                                    <strong>Taille:</strong> {player.height ? `${player.height} cm` : 'N/A'} <br />
                                    <strong>Poids:</strong> {player.weight ? `${player.weight} kg` : 'N/A'} <br />
                                    <strong>Date de naissance:</strong> {new Date(player.birthDate).toLocaleDateString()} <br />
                                </Card.Text>
                                {player.stats && (
                                    <Card.Text>
                                        <strong>Statistiques:</strong> <br />
                                        DEF: {player.stats.DEF}, DRI: {player.stats.DRI}, PAC: {player.stats.PAC}, <br />
                                        PAS: {player.stats.PAS}, PHY: {player.stats.PHY}, SHO: {player.stats.SHO}
                                    </Card.Text>
                                )}
                                <Button variant="primary" className="mb-2" block>Télécharger la fiche</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Proposer un joueur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="firstName">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="birthDate">
                            <Form.Label>Date de naissance</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="sportId">
                            <Form.Label>Sport</Form.Label>
                            <Form.Control as="select" name="sportId" value={formData.sportId} onChange={handleInputChange} required>
                                <option value="">Sélectionner un sport</option>
                                {sports.map(sport => (
                                    <option key={sport.id} value={sport.id}>{sport.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="height">
                            <Form.Label>Taille (cm)</Form.Label>
                            <Form.Control
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="weight">
                            <Form.Label>Poids (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Soumettre
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default TrainingCenterPlayersComponent;
