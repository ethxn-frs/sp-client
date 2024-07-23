import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDetailPlayerComponent.css';

function AdminDetailPlayerComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await fetch(`http://localhost:3030/players/${id}`);
                const data = await response.json();
                setPlayer(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du joueur:', error);
                alert('Erreur lors de la récupération du joueur.');
            }
        };

        fetchPlayer();
    }, [id]);

    const handleRegenerate = () => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous allez régénérer la fiche du joueur!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, régénérer!',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Ajouter la logique pour régénérer la fiche du joueur ici
                Swal.fire(
                    'Régénéré!',
                    'La fiche du joueur a été régénérée.',
                    'success'
                );
            }
        });
    };

    const handleDeactivate = () => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous allez désactiver ce joueur!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, désactiver!',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Ajouter la logique pour désactiver le joueur ici
                Swal.fire(
                    'Désactivé!',
                    'Le joueur a été désactivé.',
                    'success'
                );
            }
        });
    };

    if (!player) {
        return <div>Chargement...</div>;
    }

    const renderStats = (stats) => {
        if (!stats) {
            return <ListGroup.Item>Aucune statistique disponible.</ListGroup.Item>;
        }

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
                                        <strong>Taille:</strong> {player.height ? `${player.height} cm` : 'N/A'}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Poids:</strong> {player.weight ? `${player.weight} kg` : 'N/A'}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <h5 className="mt-4">Statistiques</h5>
                            <ListGroup variant="flush">
                                {renderStats(player.stats)}
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="warning" className="mt-3" onClick={handleRegenerate}>
                                Régénérer sa fiche
                            </Button>
                            <Button variant="danger" className="mt-3" onClick={handleDeactivate}>
                                Désactiver
                            </Button>
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
