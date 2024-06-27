import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Button, Spinner, ListGroup, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChangePasswordModal from '../Admin/AdminUser/ChangePasswordModal';
import EditProfileModal from '../Admin/AdminUser/EditProfileModal';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalPaymentComponent from '../Paypal/PaypalPaymentComponent';
import './ClubAccountComponent.css';

const ClubAccountComponent = ({ setActiveTab }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showPaypal, setShowPaypal] = useState(false);
    const [amount, setAmount] = useState(0);

    const userStorage = JSON.parse(localStorage.getItem('user'));
    const userId = userStorage.id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:4000/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const subscriptionStatus = {
        clubFee: {
            amount: 10,
            dueDate: '2025-01-01',
            status: 'paid'
        },
        userFee: {
            amount: 1,
            dueDate: '2025-01-01',
            status: 'unpaid'
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

    return (
        <Container className="mt-5 club-account">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={4} className="text-center">
                                    <Image
                                        src={user.image ? user.image : 'https://via.placeholder.com/150'}
                                        roundedCircle
                                        className="profile-img mb-3"
                                    />
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            ⋮
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setShowEditProfileModal(true)}>Modifier le Profil</Dropdown.Item>
                                            <Dropdown.Item href="mailto:sportvision.infos@gmail.com">Besoin d'aide ?</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col md={8}>
                                    <h3 className="text-primary">{user.firstname} {user.lastname}</h3>
                                    <p className="text-muted">Matricule: {user.matricule}</p>
                                    <Row>
                                        <Col xs={6}>
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Adresse:</strong> {user.address}</p>
                                            <p><strong>Date de naissance:</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
                                            <p><strong>Date de création:</strong> {new Date(user.createDate).toLocaleDateString()}</p>
                                        </Col>
                                        <Col xs={6}>
                                            <p><strong>Nom du Club:</strong> {user.club.name}</p>
                                            <p><strong>Adresse du Club:</strong> {user.club.address}</p>
                                            <p><strong>Email du Club:</strong> {user.club.email}</p>
                                            <p><strong>Date de création du Club:</strong> {new Date(user.club.creationDate).toLocaleDateString()}</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <h4 className="text-primary">Cotisation des Membres</h4>
                            <Row>
                                <Col xs={6}>
                                    <p><strong>Montant:</strong> 1 EUR</p>
                                    <p><strong>Date limite de paiement:</strong> 01/01/2025</p>
                                </Col>
                                <Col xs={6}>
                                    <p><strong>Status:</strong> {subscriptionStatus.userFee.status === 'paid' ? <span className="text-success">Payé</span> : <span className="text-danger">Non payé</span>}</p>
                                    {subscriptionStatus.userFee.status !== 'paid' && (
                                        <Button onClick={() => handlePayClick(subscriptionStatus.userFee.amount)} variant="primary">Payer</Button>
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

                    <Row className="mt-4">
                        <Col>
                            <h4>Actions disponibles</h4>
                            <ListGroup>
                                <ListGroup.Item action onClick={() => setActiveTab('Événements')}>Gérer les événements du club</ListGroup.Item>
                                <ListGroup.Item action onClick={() => setActiveTab('Club')}>Gérer le club</ListGroup.Item>
                                <ListGroup.Item action onClick={() => setActiveTab('MarketPlace')}>MarketPlace</ListGroup.Item>
                                <ListGroup.Item action onClick={() => setActiveTab('MarketPlace')}>Voir mes documents</ListGroup.Item>
                                <ListGroup.Item action onClick={() => setShowChangePasswordModal(true)}>Changer le mot de passe</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <ChangePasswordModal
                show={showChangePasswordModal}
                handleClose={() => setShowChangePasswordModal(false)}
                userId={userId}
            />
            <EditProfileModal
                show={showEditProfileModal}
                handleClose={() => setShowEditProfileModal(false)}
                user={user}
            />
        </Container>
    );
};

export default ClubAccountComponent;