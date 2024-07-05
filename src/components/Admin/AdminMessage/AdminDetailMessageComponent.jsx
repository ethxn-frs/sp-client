import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import './AdminDetailMessageComponent.css';

function AdminDetailMessageComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await fetch(`http://localhost:4000/contacts/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch message');
                }
                const data = await response.json();
                setMessage(data);
            } catch (error) {
                Swal.fire('Erreur', error.message || 'Erreur lors de la récupération du message.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchMessage();
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Chargement...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Détails du Message</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col xs={12} className="message-detail">
                                    <Card.Text>
                                        <strong>Nom:</strong> {message.name}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Type:</strong> {message?.role}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Email:</strong> {message.email}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Sujet:</strong> {message.subject}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Contenu:</strong> {message.content}
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin/messages')}>
                                Retour à la liste
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDetailMessageComponent;
