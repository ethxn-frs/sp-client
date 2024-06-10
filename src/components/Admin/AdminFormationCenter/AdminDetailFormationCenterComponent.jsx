import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ListGroup, Container, Row, Col, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDetailFormationCenterComponent.css'; // Assurez-vous de créer ce fichier CSS pour les styles personnalisés

function AdminDetailFormationCenterComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formationCenter, setFormationCenter] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchFormationCenter = async () => {
            try {
                const response = await fetch(`http://localhost:4000/formations-centers/${id}`);
                if (!response.ok) {
                    throw new Error(`Échec de la récupération du centre de formation: ${response.status} (${response.statusText})`);
                }
                const data = await response.json();
                setFormationCenter(data);

                // Fetch associated players
                const playersResponse = await fetch(`http://localhost:4000/formations-centers/${id}/players`);
                const playersData = await playersResponse.json();
                setPlayers(playersData);
            } catch (error) {
                console.error('Erreur lors de la récupération du centre de formation:', error);
                alert('Erreur lors de la récupération du centre de formation.');
            }
        };

        fetchFormationCenter();
    }, [id]);

    if (!formationCenter) {
        return <div>Chargement...</div>;
    }

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <Card.Title className="text-center bg-primary text-white p-2 rounded">Détails du Centre de Formation</Card.Title>
                            <Card.Text>
                                <strong>Nom:</strong> {formationCenter.name}
                            </Card.Text>
                            <Card.Text>
                                <strong>Adresse:</strong> {formationCenter.address}
                            </Card.Text>
                            <Card.Text>
                                <strong>Email:</strong> {formationCenter.email}
                            </Card.Text>
                            <Card.Text>
                                <strong>Date de création:</strong> {new Date(formationCenter.createDate).toLocaleDateString()}
                            </Card.Text>
                            <Card.Text>
                                <strong>Sports:</strong>
                                <ListGroup>
                                    {formationCenter.sports.map(sport => (
                                        <ListGroup.Item key={sport.id}>{sport.name}</ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Text>
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
                            <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin/formations-centers')}>
                                Retour à la liste
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDetailFormationCenterComponent;