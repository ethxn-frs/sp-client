// src/components/AdminDetailClubComponent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminClubComponent.css';

function AdminDetailClubComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [club, setClub] = useState(null);

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const response = await fetch(`http://localhost:4000/clubs/${id}`);
                const data = await response.json();
                setClub(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du club:', error);
                alert('Erreur lors de la récupération du club.');
            }
        };

        fetchClub();
    }, [id]);

    if (!club) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={10}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Détails du Club</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={4}>
                                    {club.image && (
                                        <img 
                                            src={club.image.path} 
                                            alt={club.name} 
                                            className="img-fluid rounded mb-3"
                                        />
                                    )}
                                </Col>
                                <Col xs={12} md={8}>
                                    <Card.Text>
                                        <strong>Nom:</strong> {club.name}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Adresse:</strong> {club.address}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Email:</strong> {club.email}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Date de création:</strong> {new Date(club.creationDate).toLocaleDateString()}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Sports:</strong>
                                        <ListGroup>
                                            {club.sports && club.sports.length > 0 ? (
                                                club.sports.map(sport => (
                                                    <ListGroup.Item key={sport.id}>{sport.name}</ListGroup.Item>
                                                ))
                                            ) : (
                                                <ListGroup.Item>Aucun sport associé.</ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </Card.Text>
                                </Col>
                            </Row>
                            <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin/clubs')}>
                                Retour à la liste
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDetailClubComponent;
