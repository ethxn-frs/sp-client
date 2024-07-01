import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Image, Spinner, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TrainingCenterManageComponent.css';
import TrainingCenterInviteUserComponent from './TrainingCenterInviteUserComponent';
import Swal from 'sweetalert2';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalPaymentComponent from '../Paypal/PaypalPaymentComponent';

const TrainingCenterManageComponent = () => {
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const userId = userStorage.id;
    const [formationCenterId, setFormationCenterId] = useState(null);
    const [formationCenter, setFormationCenter] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInviteUserModal, setShowInviteUserModal] = useState(false);
    const [showEditFormationCenterModal, setShowEditFormationCenterModal] = useState(false);
    const [showPaypal, setShowPaypal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [cotisation, setCotisation] = useState(null);
    const [editFormationCenterFormData, setEditFormationCenterFormData] = useState({
        id: formationCenterId,
        name: '',
        address: '',
        email: '',
        image: null
    });

    useEffect(() => {
        const fetchFormationCenterId = async () => {
            try {
                const response = await fetch(`http://localhost:4000/users/${userStorage.id}/formation-center`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Error fetching formation center ID: ${response.status} (${response.statusText})`);
                }

                const formationCenterResponse = await response.json();
                setFormationCenterId(formationCenterResponse.id);
            } catch (error) {
                console.error('Error fetching formation center ID:', error);
            }
        };

        fetchFormationCenterId();
    }, [userStorage.id]);

    useEffect(() => {
        if (formationCenterId) {
            const fetchFormationCenter = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/formation-centers/${formationCenterId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch formation center');
                    }
                    const data = await response.json();
                    setFormationCenter(data);
                    setEditFormationCenterFormData({
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
                    const response = await fetch(`http://localhost:4000/formation-centers/${formationCenterId}/users`, {
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

            const fetchCotisation = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/formation-centers/${formationCenterId}/cotisations`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch cotisation');
                    }
                    const data = await response.json();
                    setCotisation(data);
                } catch (error) {
                    setError(error.message);
                }
            };

            fetchFormationCenter();
            fetchUsers();
            fetchCotisation();
        }
    }, [formationCenterId]);

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

    const handleEditFormationCenterChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setEditFormationCenterFormData({ ...editFormationCenterFormData, image: files[0] });
        } else {
            setEditFormationCenterFormData({ ...editFormationCenterFormData, [name]: value });
        }
    };

    const handleEditFormationCenterSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', formationCenterId);
        formData.append('name', editFormationCenterFormData.name);
        formData.append('address', editFormationCenterFormData.address);
        formData.append('email', editFormationCenterFormData.email);
        if (editFormationCenterFormData.image) {
            formData.append('image', editFormationCenterFormData.image);
        }

        try {
            const response = await fetch(`http://localhost:4000/formation-centers/${formationCenterId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update formation center');
            }

            const updatedFormationCenter = await response.json();
            setFormationCenter(updatedFormationCenter);
            setShowEditFormationCenterModal(false);

            Swal.fire(
                'Succès!',
                'Les informations du centre de formation ont été mises à jour.',
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

    const handlePaymentSuccess = async () => {
        try {
            const response = await fetch(`http://localhost:4000/cotisations/${cotisation.id}/paid`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to update cotisation status');
            }
            const updatedCotisation = await response.json();
            setCotisation(updatedCotisation);
            setShowPaypal(false);
            Swal.fire('Paiement réussi!', 'Votre cotisation a été mise à jour.', 'success');
        } catch (error) {
            Swal.fire('Erreur!', error.message, 'error');
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container className="mt-5 formation-center-manage">
            <Row className="justify-content-center">
                <Col md={8}>
                    {formationCenter && (
                        <Card className="shadow-sm mb-4">
                            <Card.Body>
                                <Row>
                                    <Col md={4} className="text-center">
                                        <Image
                                            src={formationCenter.image ? formationCenter.image : 'https://via.placeholder.com/150'}
                                            roundedCircle
                                            className="profile-img mb-3"
                                        />
                                        <Row>
                                            <Button variant="secondary" onClick={() => setShowEditFormationCenterModal(true)}>
                                                ⚙️
                                            </Button>
                                            <Button variant="warning" onClick={() => setShowEditFormationCenterModal(true)}>
                                                🗂️
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col md={8}>
                                        <h3 className="text-primary">{formationCenter.name}</h3>
                                        <p className="text-muted">ID du Centre de Formation: {formationCenter.id}</p>
                                        <p><strong>Email:</strong> {formationCenter.email}</p>
                                        <p><strong>Adresse:</strong> {formationCenter.address}</p>
                                        <p><strong>Date de création:</strong> {new Date(formationCenter.creationDate).toLocaleDateString()}</p>
                                        <p><strong>Sports:</strong> {formationCenter.sports.map(sport => sport.name).join(', ')}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Utilisateurs du Centre de Formation</h4>
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
                            <h4 className="text-primary">Cotisation du Centre de Formation</h4>
                            <Row>
                                <Col xs={6}>
                                    <p><strong>Montant:</strong> {cotisation ? `${cotisation.amount} EUR` : 'Chargement...'}</p>
                                    <p><strong>Date limite de paiement:</strong> {cotisation ? new Date(cotisation.dueDate).toLocaleDateString() : 'Chargement...'}</p>
                                </Col>
                                <Col xs={6}>
                                    <p><strong>Status:</strong> {cotisation ? (cotisation.status === 'paid' ? <span className="text-success">Payé</span> : <span className="text-danger">Non payé</span>) : 'Chargement...'}</p>
                                    {cotisation && cotisation.status !== 'paid' && (
                                        <Button onClick={() => handlePayClick(cotisation.amount)} variant="primary">Payer</Button>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {showPaypal && (
                        <PayPalScriptProvider options={initialOptions}>
                            <PaypalPaymentComponent 
                                amount={amount} 
                                type={'COTISATION'} 
                                cotisationId={cotisation ? cotisation.id : null} 
                                onPaymentSuccess={handlePaymentSuccess} 
                            />
                        </PayPalScriptProvider>
                    )}
                </Col>
            </Row>
            <TrainingCenterInviteUserComponent
                show={showInviteUserModal}
                handleClose={() => setShowInviteUserModal(false)}
                hostId={userId}
            />
            {formationCenter && (
                <Modal show={showEditFormationCenterModal} onHide={() => setShowEditFormationCenterModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Modifier le Centre de Formation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditFormationCenterSubmit}>
                            <Form.Group controlId="formFormationCenterName">
                                <Form.Label>Nom du Centre de Formation</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={editFormationCenterFormData.name}
                                    onChange={handleEditFormationCenterChange}
                                    placeholder="Entrez le nom du centre de formation"
                                />
                            </Form.Group>
                            <Form.Group controlId="formFormationCenterAddress">
                                <Form.Label>Adresse</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={editFormationCenterFormData.address}
                                    onChange={handleEditFormationCenterChange}
                                    placeholder="Entrez l'adresse du centre de formation"
                                />
                            </Form.Group>
                            <Form.Group controlId="formFormationCenterEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={editFormationCenterFormData.email}
                                    onChange={handleEditFormationCenterChange}
                                    placeholder="Entrez l'email du centre de formation"
                                />
                            </Form.Group>
                            <Form.Group controlId="formFormationCenterImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    onChange={handleEditFormationCenterChange}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" onClick={() => setShowEditFormationCenterModal(false)} className="me-2">
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

export default TrainingCenterManageComponent;
