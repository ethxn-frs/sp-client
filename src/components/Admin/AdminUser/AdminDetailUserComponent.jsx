import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminUserComponent.css';

function AdminDetailUserComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [entity, setEntity] = useState(null);

    useEffect(() => {
        console.log(id);
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:4000/users/${id}`);
                if (!response.ok) {
                    throw new Error(`Échec de la récupération de l'utilisateur: ${response.status} (${response.statusText})`);
                }
                const data = await response.json();
                setUser(data);
                fetchEntity(data);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                alert('Erreur lors de la récupération de l\'utilisateur.');
            }
        };

        const fetchEntity = async (user) => {
            try {
                let response, data;
                if (user.role?.role === 'CLUB') {
                    response = await fetch(`http://localhost:4000/clubs/${user.club.id}`);
                } else if (user.role?.role === 'FORMATIONCENTER') {
                    response = await fetch(`http://localhost:4000/formations-centers/${user.formationCenter.id}`);
                } else if (user.role?.role === 'PLAYER') {
                    response = await fetch(`http://localhost:4000/players/${user.player.id}`);
                }

                if (response && response.ok) {
                    data = await response.json();
                    setEntity(data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'entité:', error);
                alert('Erreur lors de la récupération de l\'entité.');
            }
        };

        fetchUser();
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Détails de l'Utilisateur</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12}>
                                    <Card.Text><strong>Prénom:</strong> {user.firstname}</Card.Text>
                                    <Card.Text><strong>Nom:</strong> {user.lastname}</Card.Text>
                                    <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                                    <Card.Text><strong>Adresse:</strong> {user.address}</Card.Text>
                                    <Card.Text><strong>Date de naissance:</strong> {new Date(user.birthDate).toLocaleDateString()}</Card.Text>
                                    <Card.Text><strong>Date d'ancienneté:</strong> {new Date(user.createDate).toLocaleDateString()}</Card.Text>
                                    {user.role && <Card.Text><strong>Rôle:</strong> {user.role.role}</Card.Text>}
                                </Col>
                            </Row>
                            {entity && (
                                <>
                                    <hr />
                                    {user.role?.role === 'CLUB' && (
                                        <>
                                            <h5>Club Associé</h5>
                                            <Card.Text><strong>Nom:</strong> {entity.name}</Card.Text>
                                            <Card.Text><strong>Adresse:</strong> {entity.address}</Card.Text>
                                            <Card.Text><strong>Email:</strong> {entity.email}</Card.Text>
                                            <Button variant="info" onClick={() => navigate(`/admin/clubs/${entity.id}`)}>Voir Club</Button>
                                        </>
                                    )}
                                    {user.role?.role === 'FORMATIONCENTER' && (
                                        <>
                                            <h5>Centre de Formation Associé</h5>
                                            <Card.Text><strong>Nom:</strong> {entity.name}</Card.Text>
                                            <Card.Text><strong>Adresse:</strong> {entity.address}</Card.Text>
                                            <Card.Text><strong>Email:</strong> {entity.email}</Card.Text>
                                            <Button variant="info" onClick={() => navigate(`/admin/formations-centers/${entity.id}`)}>Voir Centre de Formation</Button>
                                        </>
                                    )}
                                    {user.role?.role === 'PLAYER' && (
                                        <>
                                            <h5>Joueur Associé</h5>
                                            <Card.Text><strong>Nom:</strong> {entity.firstName} {entity.lastName}</Card.Text>
                                            {entity.position && <Card.Text><strong>Position:</strong> {entity.position}</Card.Text>}
                                            <Button variant="info" onClick={() => navigate(`/admin/players/${entity.id}`)}>Voir Joueur</Button>
                                        </>
                                    )}
                                </>
                            )}
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin/users')}>
                                Retour à la liste
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDetailUserComponent;
