import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Button, Spinner, ListGroup, Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChangePasswordModal from '../Admin/AdminUser/ChangePasswordModal';
import EditProfileModal from '../Admin/AdminUser/EditProfileModal';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalPaymentComponent from '../Paypal/PaypalPaymentComponent';
import UserInfoAlertComponent from '../Admin/AdminUser/AdminUserInfoAlertComponent';
import CotisationWarning from '../Cotisation/CotisationWarning';
import DocumentsModal from '../Document/DocumentsModal';
import UploadDialogComponent from '../UploadDialog/UploadDialogComponent';

const TrainingCenterAccountComponent = ({ setActiveTab }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cotisation, setCotisation] = useState(null);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [showPaypal, setShowPaypal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    const userStorage = JSON.parse(localStorage.getItem('user'));
    const userId = userStorage.id;

    const showErrorAlert = (message) => {
        Swal.fire({
            title: 'Erreur',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to fetch user');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError(error.message);
                showErrorAlert(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCotisation = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/${userId}/cotisation`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to fetch cotisation');
                }
                const data = await response.json();
                setCotisation(data);
            } catch (error) {
                setError(error.message);
                showErrorAlert(error.message);
            }
        };

        fetchUser();
        fetchCotisation();
    }, [userId]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
            const response = await fetch(`http://localhost:3030/users/${userId}/cotisation`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCotisation(data);
            Swal.fire({
                title: 'Succès',
                text: 'Cotisation mise à jour avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const calculateDaysLeft = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const timeDiff = due - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    };

    return (
        <Container className="mt-5 club-account">
            <UserInfoAlertComponent user={user} />
            {cotisation && cotisation.status !== 'paid' && (
                <CotisationWarning daysLeft={calculateDaysLeft(cotisation.dueDate)} />
            )}
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={4} className="text-center">
                                    <Image
                                        src={user.image ? user.image.path : 'https://via.placeholder.com/150'}
                                        roundedCircle
                                        className="profile-img mb-3"
                                        onClick={() => setShowUploadDialog(true)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            ⋮
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setShowEditProfileModal(true)}>Modifier le Profil</Dropdown.Item>
                                            <Dropdown.Item href="mailto:sportvision.infos@gmail.com">Besoin d'aide ?</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setShowDocumentsModal(true)}>Accéder à ses documents</Dropdown.Item>
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
                                            <p><strong>Nom du Centre de Formation:</strong> {user.formationCenter.name}</p>
                                            <p><strong>Adresse du Centre de Formation:</strong> {user.formationCenter.address}</p>
                                            <p><strong>Email du Centre de Formation:</strong> {user.formationCenter.email}</p>
                                            <p><strong>Date de création du Centre de Formation:</strong> {new Date(user.formationCenter.creationDate).toLocaleDateString()}</p>
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
                                    <p><strong>Montant:</strong> {cotisation ? `${cotisation.amount} EUR` : 'Chargement...'}</p>
                                    <p><strong>Date limite de paiement:</strong> {cotisation ? new Date(cotisation.limitDate).toLocaleDateString() : 'Chargement...'}</p>
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
                            <PaypalPaymentComponent amount={amount} type="COTISATION" cotisationId={cotisation.id} onPaymentSuccess={handlePaymentSuccess} />
                        </PayPalScriptProvider>
                    )}

                    <Row className="mt-4">
                        <Col>
                            <h4>Actions disponibles</h4>
                            <ListGroup>
                                <ListGroup.Item action onClick={() => setActiveTab('Événements')}>Gérer les événements du centre de formation</ListGroup.Item>
                                <ListGroup.Item action onClick={() => setActiveTab('Centre de Formation')}>Gérer le centre de formation</ListGroup.Item>
                                <ListGroup.Item action onClick={() => setActiveTab('Mes Joueurs')}>Mes Joueurs</ListGroup.Item>
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
            <DocumentsModal
                show={showDocumentsModal}
                handleClose={() => setShowDocumentsModal(false)}
                userId
                ={userId}
            />
            <UploadDialogComponent
                open={showUploadDialog}
                handleClose={() => setShowUploadDialog(false)}
                entityType="user"
                id={userId}
            />
        </Container>
    );
};

export default TrainingCenterAccountComponent;