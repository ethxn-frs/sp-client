import React, { useState, useEffect } from 'react';
import { Card, Spinner, Button, Col, Image, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UploadDialogComponent from '../UploadDialog/UploadDialogComponent';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PaypalPaymentComponent from '../Paypal/PaypalPaymentComponent';
import DocumentsModal from '../Document/DocumentsModal';

const PlayerAccountComponent = () => {
    const [cotisation, setCotisation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showPaypal, setShowPaypal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);

    const userStorage = JSON.parse(localStorage.getItem('user'));
    const userId = userStorage.id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/${user.id}`);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                Swal.fire('Erreur', 'Impossible de récupérer les informations utilisateur', 'error');
            } finally {
                setLoading(false);
            }
        };

        const fetchCotisation = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/${user.id}/cotisation`);
                const data = await response.json();
                setCotisation(data);
            } catch (error) {
                Swal.fire('Erreur', 'Impossible de récupérer les cotisations', 'error');
            }
        };

        fetchUser();
        fetchCotisation();
    }, [user.id]);

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


    const showErrorAlert = (message) => {
        Swal.fire({
            title: 'Erreur',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Col md={8}>
            <Card className="mb-3">
                <Card.Body>
                    <h5 className="card-title">Informations du Compte</h5>
                    {user && (
                        <>
                            <Image
                                src={user.image ? user.image.path : 'https://via.placeholder.com/150'}
                                roundedCircle
                                className="profile-img mb-3"
                                onClick={() => setShowUploadDialog(true)}
                                style={{ cursor: 'pointer' }}
                            />
                            <p><strong>Nom :</strong> {user.lastname}</p>
                            <p><strong>Prénom :</strong> {user.firstname}</p>
                            <p><strong>Email :</strong> {user.email}</p>
                            <p><strong>Adresse :</strong> {user.address}</p>
                        </>
                    )}
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

                    <Button variant="primary" onClick={() => setShowDocumentsModal(true)}>Voir mes documents</Button> {/* Ajouter le bouton pour afficher les documents */}
                </Card.Body>
            </Card>
            <UploadDialogComponent
                open={showUploadDialog}
                handleClose={() => setShowUploadDialog(false)}
                entityType="user"
                id={user.id}
            />
            <DocumentsModal
                show={showDocumentsModal}
                handleClose={() => setShowDocumentsModal(false)}
                userId={userId}
            /> {/* Ajouter le modal de documents */}
        </Col >
    );
}

export default PlayerAccountComponent;
