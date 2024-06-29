import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminToolsComponent.css';

const AdminToolsComponent = () => {
    const [infos, setInfos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInfos = async () => {
            try {
                const response = await fetch('http://localhost:4000/infos', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch infos');
                }
                const data = await response.json();
                setInfos(data.infos);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInfos();
    }, []);

    const handleManageCotisations = async () => {
        try {
            const response = await fetch('http://localhost:4000/cotisations/manage', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to manage cotisations');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Vérification des cotisations effectuée avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleGenerateCards = async () => {
        try {
            const response = await fetch('http://localhost:4000/cotisations/generate-card', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate cards');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Génération des cartes d\'adhérent effectuée avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={12}>
                    <h2>Outils d'administration</h2>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Informations</Card.Title>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Niveau</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Contenu</th>
                                        <th>Utilisateur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {infos.map(info => (
                                        <tr key={info.id}>
                                            <td>{info.id}</td>
                                            <td>{info.level}</td>
                                            <td>{info.type}</td>
                                            <td>{new Date(info.date).toLocaleString()}</td>
                                            <td>{info.text}</td>
                                            <td>{info.user ? `${info.user.firstname} ${info.user.lastname}` : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <h3>Jobs manuels</h3>
                    <Card className="mb-4">
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Nom du job</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Vérification des cotisations</td>
                                        <td>
                                            <Button variant="primary" onClick={handleManageCotisations}>
                                                Lancer la vérification
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Génération des cartes d'adhérent</td>
                                        <td>
                                            <Button variant="primary" onClick={handleGenerateCards}>
                                                Générer les cartes
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminToolsComponent;
