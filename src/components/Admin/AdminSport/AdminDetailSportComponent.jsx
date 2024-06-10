import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDetailSportComponent.css'; // Assurez-vous de créer ce fichier CSS pour les styles personnalisés

function AdminDetailSportComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sport, setSport] = useState(null);
    const [players, setPlayers] = useState([]);
    const [formationCenters, setFormationCenters] = useState([]);
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        const fetchSport = async () => {
            try {
                const response = await fetch(`http://localhost:4000/sports/${id}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération du sport');
                }
                const data = await response.json();
                setSport(data);

                // Fetch associated players
                const playersResponse = await fetch(`http://localhost:4000/sports/${id}/players`);
                const playersData = await playersResponse.json();
                setPlayers(playersData);

                // Fetch associated formation centers
                const formationCentersResponse = await fetch(`http://localhost:4000/sports/${id}/formations-centers`);
                const formationCentersData = await formationCentersResponse.json();
                setFormationCenters(formationCentersData);

                // Fetch associated clubs (assuming there's an endpoint for clubs)
                const clubsResponse = await fetch(`http://localhost:4000/sports/${id}/clubs`);
                const clubsData = await clubsResponse.json();
                setClubs(clubsData);
            } catch (error) {
                console.error('Erreur lors de la récupération du sport:', error);
                alert('Erreur lors de la récupération du sport.');
            }
        };

        fetchSport();
    }, [id]);

    if (!sport) {
        return <div>Loading...</div>;
    }

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={10}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Détails du Sport</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12}>
                                    <Card.Text>
                                        <strong>Nom du sport:</strong> {sport.name}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>ID du sport:</strong> {sport.id}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xs={12}>
                                    <h5>Joueurs associés</h5>
                                    {players.length > 0 ? (
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nom</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {players.map((player) => (
                                                    <tr key={player.id}>
                                                        <td>{player.id}</td>
                                                        <td>{player.firstName} {player.lastName}</td>
                                                        <td>
                                                            <Button
                                                                variant="info"
                                                                onClick={() => handleNavigate(`/admin/players/${player.id}`)}
                                                            >
                                                                Voir
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p>Aucun joueur associé.</p>
                                    )}
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xs={12}>
                                    <h5>Centres de Formations associés</h5>
                                    {formationCenters.length > 0 ? (
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nom</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formationCenters.map((center) => (
                                                    <tr key={center.id}>
                                                        <td>{center.id}</td>
                                                        <td>{center.name}</td>
                                                        <td>
                                                            <Button
                                                                variant="info"
                                                                onClick={() => handleNavigate(`/admin/formations-centers/${center.id}`)}
                                                            >
                                                                Voir
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p>Aucun centre de formation associé.</p>
                                    )}
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xs={12}>
                                    <h5>Clubs associés</h5>
                                    {clubs.length > 0 ? (
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nom</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clubs.map((club) => (
                                                    <tr key={club.id}>
                                                        <td>{club.id}</td>
                                                        <td>{club.name}</td>
                                                        <td>
                                                            <Button
                                                                variant="info"
                                                                onClick={() => handleNavigate(`/admin/clubs/${club.id}`)}
                                                            >
                                                                Voir
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p>Aucun club associé.</p>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin/sports')}>
                                Retour à la liste
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDetailSportComponent;