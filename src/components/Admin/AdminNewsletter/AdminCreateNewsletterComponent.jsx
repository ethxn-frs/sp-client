// AdminCreateNewsletterComponent.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminCreateNewsletterComponent() {
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3030/newsletter/send', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ subject, text })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l\'envoi de la newsletter');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Newsletter envoyée avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setSubject('');
            setText('');

        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card className="p-4 shadow-sm">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Créer une Newsletter</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formSubject" className="mb-3">
                                    <Form.Label>Objet</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Entrez l'objet de la newsletter"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formText" className="mb-3">
                                    <Form.Label>Contenu</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={10}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Entrez le contenu de la newsletter"
                                        required
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    <Button variant="secondary" className="me-2" onClick={() => { setSubject(''); setText(''); }}>
                                        Annuler
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Envoyer
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminCreateNewsletterComponent;