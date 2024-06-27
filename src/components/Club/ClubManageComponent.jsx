import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Image, Spinner, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClubManageComponent.css';
import ClubInviteUserComponent from './ClubInviteUserComponent';
import Swal from 'sweetalert2';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalPaymentComponent from '../Paypal/PaypalPaymentComponent';

const ClubManageComponent = () => {
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const userId = userStorage.id;
    const [clubId, setClubId] = useState(null);
    const [club, setClub] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInviteUserModal, setShowInviteUserModal] = useState(false);
    const [showEditClubModal, setShowEditClubModal] = useState(false);
    const [showPaypal, setShowPaypal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [editClubFormData, setEditClubFormData] = useState({
        id: clubId,
        name: '',
        address: '',
        email: '',
        image: null
    });

    const subscriptionStatus = {
        clubFee: {
            amount: 10,
            dueDate: '2025-01-01',
            status: 'unpaid'
        },
        userFee: {
            amount: 1,
            dueDate: '2025-01-01',
            status: 'unpaid'
        }
    };

    useEffect(() => {
        const fetchClubId = async () => {
            try {
                const response = await fetch(`http://localhost:4000/users/${userStorage.id}/club`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Error fetching club ID: ${response.status} (${response.statusText})`);
                }

                const clubResponse = await response.json();
                setClubId(clubResponse.id);
            } catch (error) {
                console.error('Error fetching club ID:', error);
            }
        };

        fetchClubId();
    }, [userStorage.id]);

    useEffect(() => {
        if (clubId) {
            const fetchClub = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/clubs/${clubId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch club');
                    }
                    const data = await response.json();
                    setClub(data);
                    setEditClubFormData({
                        name: data.name,
                        address: data.address,
                        email: data.email,
                        image: null
                    });
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            const fetchUsers = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/clubs/${clubId}/users`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }
                    const data = await response.json();
                    setUsers(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchClub();
            fetchUsers();
        }
    }, [clubId]);

    const handleDeleteUser = async (userId) => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Cette action est irréversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Non, annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:4000/users/${userId}/delete`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete user');
                    }

                    Swal.fire(
                        'Supprimé!',
                        'L\'utilisateur a été supprimé.',
                        'success'
                    );

                    setUsers(users.filter(user => user.id !== userId));
                } catch (error) {
                    Swal.fire(
                        'Erreur!',
                        error.message,
                        'error'
                    );
                }
            }
        });
    };

    const handleEditClubChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setEditClubFormData({ ...editClubFormData, image: files[0] });
        }
        else {
            setEditClubFormData({ ...editClubFormData, [name]: value });
        }
    };

    const handleEditClubSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', clubId);
        formData.append('name', editClubFormData.name);
        formData.append('address', editClubFormData.address);
        formData.append('email', editClubFormData.email);
        if (editClubFormData.image) {
            formData.append('image', editClubFormData.image);
        }

        try {
            const response = await fetch(`http://localhost:4000/clubs/${clubId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update club');
            }

            const updatedClub = await response.json();
            setClub(updatedClub);
            setShowEditClubModal(false);

            Swal.fire(
                'Succès!',
                'Les informations du club ont été mises à jour.',
                'success'
            );
        } catch (error) {
            Swal.fire(
                'Erreur!',
                error.message,
                'error'
            );
        }
    };

    const initialOptions = {
        "client-id": "AZM-xhZvk9RPx-koGNixiPRRv_BdF3aTvmrw9hxorpC7ewPymOgJJel1hwh4bDTujpCRT__lro3P6KtD",
        currency: "EUR",
        intent: "capture"
    };

    const handlePayClick = (amount) => {
        setAmount(amount);
        setShowPaypal(true);
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container className="mt-5 club-manage">
            <Row className="justify-content-center">
                <Col md={8}>
                    {club && (
                        <Card className="shadow-sm mb-4">
                            <Card.Body>
                                <Row>
                                    <Col md={4} className="text-center">
                                        <Image
                                            src={club.image ? club.image : 'https://via.placeholder.com/150'}
                                            roundedCircle
                                            className="profile-img mb-3"
                                        />
                                        <Row>
                                            <Button variant="secondary" onClick={() => setShowEditClubModal(true)}>
                                                ⚙️
                                            </Button>
                                            <Button variant="warning" onClick={() => setShowEditClubModal(true)}>
                                                🗂️
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col md={8}>
                                        <h3 className="text-primary">{club.name}</h3>
                                        <p className="text-muted">ID du Club: {club.id}</p>
                                        <p><strong>Email:</strong> {club.email}</p>
                                        <p><strong>Adresse:</strong> {club.address}</p>
                                        <p><strong>Date de création:</strong> {new Date(club.creationDate).toLocaleDateString()}</p>
                                        <p><strong>Sports:</strong> {club.sports.map(sport => sport.name).join(', ')}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Utilisateurs du Club</h4>
                                <Button variant="primary" onClick={() => setShowInviteUserModal(true)}>
                                    Inviter un utilisateur
                                </Button>
                            </div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nom</th>
                                        <th>Email</th>
                                        <th>Date de création</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.firstname} {user.lastname}</td>
                                            <td>{user.email}</td>
                                            <td>{new Date(user.createDate).toLocaleDateString()}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    ✖️
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <h4 className="text-primary">Cotisation du Club</h4>
                            <Row>
                                <Col xs={6}>
                                    <p><strong>Montant:</strong> 10 EUR</p>
                                    <p><strong>Date limite de paiement:</strong> 01/01/2025</p>
                                </Col>
                                <Col xs={6}>
                                    <p><strong>Status:</strong> {subscriptionStatus.clubFee.status === 'paid' ? <span className="text-success">Payé</span> : <span className="text-danger">Non payé</span>}</p>
                                    {subscriptionStatus.clubFee.status !== 'paid' && (
                                        <Button onClick={() => handlePayClick(subscriptionStatus.clubFee.amount)} variant="primary">Payer</Button>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {showPaypal && (
                        <PayPalScriptProvider options={initialOptions}>
                            <PaypalPaymentComponent amount={amount} />
                        </PayPalScriptProvider>
                    )}
                </Col>
            </Row>
            <ClubInviteUserComponent
                show={showInviteUserModal}
                handleClose={() => setShowInviteUserModal(false)}
                hostId={userId}
            />
            {club && (
                <Modal show={showEditClubModal} onHide={() => setShowEditClubModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Modifier le Club</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditClubSubmit}>
                            <Form.Group controlId="formClubName">
                                <Form.Label>Nom du Club</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={editClubFormData.name}
                                    onChange={handleEditClubChange}
                                    placeholder="Entrez le nom du club"
                                />
                            </Form.Group>
                            <Form.Group controlId="formClubAddress">
                                <Form.Label>Adresse</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={editClubFormData.address}
                                    onChange={handleEditClubChange}
                                    placeholder="Entrez l'adresse du club"
                                />
                            </Form.Group>
                            <Form.Group controlId="formClubEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={editClubFormData.email}
                                    onChange={handleEditClubChange}
                                    placeholder="Entrez l'email du club"
                                />
                            </Form.Group>
                            <Form.Group controlId="formClubImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    onChange={handleEditClubChange}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" onClick={() => setShowEditClubModal(false)} className="me-2">
                                    Fermer
                                </Button>
                                <Button variant="primary" type="submit">
                                    Enregistrer
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
};

export default ClubManageComponent;
