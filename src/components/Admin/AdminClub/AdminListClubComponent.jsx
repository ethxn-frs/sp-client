import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminClubComponent.css';

function AdminListClubComponent() {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch('http://localhost:4000/clubs');
                const data = await response.json();
                setClubs(data.clubs);
            } catch (error) {
                console.error('Erreur lors de la récupération des clubs:', error);
                alert('Erreur lors de la récupération des clubs.');
            }
        };

        fetchClubs();
    }, []);

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={10}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Liste des Clubs</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Button variant="primary" onClick={() => navigate('/admin/clubs/create')}>
                                Ajouter un Club
                            </Button>
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nom</th>
                                        <th>Adresse</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clubs.map((club) => (
                                        <tr key={club.id}>
                                            <td>{club.id}</td>
                                            <td>{club.name}</td>
                                            <td>{club.address}</td>
                                            <td>{club.email}</td>
                                            <td>
                                                <Button
                                                    variant="info"
                                                    onClick={() => navigate(`/admin/clubs/${club.id}`)}
                                                    className="mr-2"
                                                >
                                                    Voir
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    onClick={() => navigate(`/admin/clubs/${club.id}/edit`)}
                                                    className="mr-2"
                                                >
                                                    Modifier
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => navigate(`/admin/clubs/${club.id}/delete`)}
                                                >
                                                    Supprimer
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminListClubComponent;
