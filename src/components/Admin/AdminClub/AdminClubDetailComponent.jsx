import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import './AdminClubComponent.css';

function AdminDetailClubComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [club, setClub] = useState(null);
    const [cotisation, setCotisation] = useState(null);

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const response = await fetch(`http://localhost:3030/clubs/${id}`);
                const data = await response.json();
                setClub(data);

                const cotisationResponse = await fetch(`http://localhost:3030/clubs/${id}/cotisations`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (cotisationResponse.ok) {
                    const cotisationData = await cotisationResponse.json();
                    setCotisation(cotisationData);
                } else {
                    setCotisation(null);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du club:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Erreur lors de la récupération du club.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchClub();
    }, [id]);

    const handleRecreateCotisation = async () => {
        try {
            const response = await fetch(`http://localhost:3030/clubs/${id}/recreate-cotisation`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Échec de la recréation de la cotisation');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Cotisation recréée avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            const cotisationData = await response.json();
            setCotisation(cotisationData);
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleCheckPayment = () => {
        if (cotisation && cotisation.status === 'paid') {
            Swal.fire({
                title: 'Paiement vérifié',
                text: 'La cotisation est payée.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Paiement non effectué',
                text: 'La cotisation n\'est pas payée.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    };

    if (!club) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Détails du Club</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {club.image && (
                                    <Col xs={12} md={4}>
                                        <img
                                            src={club.image.path}
                                            alt={club.name}
                                            className="img-fluid rounded mb-3"
                                        />
                                    </Col>
                                )}
                                <Col xs={12}>
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
                                    <Card.Text>
                                        <strong>Cotisation:</strong>
                                        {cotisation ? (
                                            <ListGroup>
                                                <ListGroup.Item><strong>Montant:</strong> {cotisation.amount} EUR</ListGroup.Item>
                                                <ListGroup.Item><strong>Date limite de paiement:</strong> {new Date(cotisation.limitDate).toLocaleDateString()}</ListGroup.Item>
                                                <ListGroup.Item><strong>Status:</strong> {cotisation.status === 'paid' ? <span className="text-success">Payé</span> : <span className="text-danger">Non payé</span>}</ListGroup.Item>
                                            </ListGroup>
                                        ) : (
                                            <ListGroup.Item>Aucune cotisation trouvée.</ListGroup.Item>
                                        )}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin/clubs')}>
                                Retour à la liste
                            </Button>
                            <Button variant="warning" className="mt-3 ml-2" onClick={handleRecreateCotisation}>
                                Régénérer la cotisation
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDetailClubComponent;
