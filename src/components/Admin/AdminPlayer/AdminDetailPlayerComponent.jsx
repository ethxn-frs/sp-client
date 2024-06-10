import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDetailPlayerComponent.css'; // Assurez-vous de créer ce fichier CSS

function AdminDetailPlayerComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await fetch(`http://localhost:4000/players/${id}`);
                const data = await response.json();
                setPlayer(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du joueur:', error);
                alert('Erreur lors de la récupération du joueur.');
            }
        };

        fetchPlayer();
    }, [id]);

    if (!player) {
        return <div>Chargement...</div>;
    }

    const renderStats = (stats) => {
        return Object.entries(stats).map(([key, value]) => (
            <ListGroup.Item key={key} className="d-flex justify-content-between align-items-center">
                <span className="stat-key">{key}</span>
                <span className="stat-value">{value}</span>
            </ListGroup.Item>
        ));
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Détails du Joueur</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col xs={12} sm={6} className="mb-3">
                                    <Card.Text>
                                        <strong>Nom:</strong> {player.lastName}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Prénom:</strong> {player.firstName}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Date de Naissance:</strong> {new Date(player.birthDate).toLocaleDateString()}
                                    </Card.Text>
                                </Col>
                                <Col xs={12} sm={6} className="mb-3">
                                    <Card.Text>
                                        <strong>Centre de Formation:</strong> {player.formationCenter.name}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Sport:</strong> {player.sport.name}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Taille:</strong> {player.height} cm
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Poids:</strong> {player.weight} kg
                                    </Card.Text>
                                </Col>
                            </Row>
                            <h5 className="mt-4">Statistiques</h5>
                            <ListGroup variant="flush">
                                {renderStats(player.stats)}
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin/players')}>
                                Retour à la liste
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDetailPlayerComponent;
