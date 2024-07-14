import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminUserComponent.css';

function AdminDetailUserComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [entity, setEntity] = useState(null);
    const [emails, setEmails] = useState([]);
    const [loadingEmails, setLoadingEmails] = useState(true);
    const [cotisation, setCotisation] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/${id}`);
                if (!response.ok) {
                    throw new Error(`Échec de la récupération de l'utilisateur: ${response.status} (${response.statusText})`);
                }
                const data = await response.json();
                setUser(data);
                fetchEntity(data);
                fetchUserEmails(data.id);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Erreur lors de la récupération de l\'utilisateur.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        };

        const fetchEntity = async (user) => {
            try {
                let response, data;
                if (user.role?.role === 'CLUB') {
                    response = await fetch(`http://localhost:3030/clubs/${user.club.id}`);
                } else if (user.role?.role === 'FORMATIONCENTER') {
                    response = await fetch(`http://localhost:3030/formations-centers/${user.formationCenter.id}`);
                } else if (user.role?.role === 'PLAYER') {
                    response = await fetch(`http://localhost:3030/players/${user.player.id}`);
                }

                if (response && response.ok) {
                    data = await response.json();
                    setEntity(data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'entité:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Erreur lors de la récupération de l\'entité.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        };

        const fetchUserEmails = async (userId) => {
            try {
                const response = await fetch(`http://localhost:3030/users/${userId}/emails`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Échec de la récupération des emails: ${response.status} (${response.statusText})`);
                }
                const data = await response.json();
                setEmails(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des emails:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Erreur lors de la récupération des emails.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoadingEmails(false);
            }
        };

        const fetchCotisation = async () => {
            try {
                let response, data;
                response = await fetch(`http://localhost:3030/users/${id}/cotisation`)
                if (response && response.ok) {
                    data = await response.json();
                    setCotisation(data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de cotisation:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Erreur lors de la récupération de la cotisation.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }

            fetchUser();
        };

        fetchUser();
        fetchCotisation();
    }, [id]);

    const handleDeactivateUser = async () => {
        try {
            const response = await fetch(`http://localhost:3030/users/${id}/delete`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Échec de la désactivation de l\'utilisateur');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Utilisateur désactivé avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/admin/users');
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

    const recreateCotisation = async () => {
        try {
            const response = await fetch(`http://localhost:3030/users/${id}/recreate-cotisation`, {
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
            }).then(() => {
                navigate(`/admin/users/${id}`);
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    const handleReactivateUser = async () => {
        try {
            const response = await fetch(`http://localhost:3030/users/${id}/reactivate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Échec de la réactivation de l\'utilisateur');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Utilisateur réactivé avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/admin/users');
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

    if (!user) {
        return <Spinner animation="border" />;
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
                            <Row className="justify-content-center mb-4">
                                <Col xs={6} md={4}>
                                    <img
                                        src={user.image.path}
                                        alt="Profile"
                                        className="img-fluid rounded-circle"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Card.Text><strong>Prénom:</strong> {user.firstname}</Card.Text>
                                    <Card.Text><strong>Nom:</strong> {user.lastname}</Card.Text>
                                    <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                                    <Card.Text><strong>Adresse:</strong> {user.address}</Card.Text>
                                    <Card.Text><strong>Date de naissance:</strong> {new Date(user.birthDate).toLocaleDateString()}</Card.Text>
                                    <Card.Text><strong>Date d'ancienneté:</strong> {new Date(user.createDate).toLocaleDateString()}</Card.Text>
                                    <Card.Text><strong>Paiment cotisation:</strong> {cotisation?.paymentDate ? `✅ - ${cotisation.paymentDate}` : '❌'}</Card.Text>
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
                            <hr />
                            <Button variant="info" onClick={() => navigate(`/admin/tools?userId=${id}`)}>Voir ses infos</Button>
                            <Button>Voir ses mails</Button>
                            <Button onClick={recreateCotisation}>Recréer sa cotisation</Button>
                        </Card.Body>
                        <Card.Footer className="text-center">

                            {user.deleted ?
                                <Button variant="danger" className="mt-3" onClick={handleReactivateUser}>
                                    Réactiver l'utilisateur
                                </Button>
                                :
                                <Button variant="danger" className="mt-3" onClick={handleDeactivateUser}>
                                    Désactiver l'utilisateur
                                </Button>}

                            <Button variant="secondary" className="mt-3 ml-2" onClick={() => navigate('/admin/users')}>
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
