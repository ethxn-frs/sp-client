import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './AdminInvitationComponent.css'; // Import custom CSS

const AdminInvitationComponent = () => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userStorage = JSON.parse(localStorage.getItem('user'));
    const userId = userStorage.id;
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/${userId}/event-invitations`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch invitations');
                }
                const data = await response.json();
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setInvitations(data);
                } else if (data && data.invitations) {
                    setInvitations(data.invitations);
                } else {
                    setInvitations([]);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitations();
    }, [userId]);

    const handleInvitationResponse = async (invitationId, status) => {
        try {
            const response = await fetch(`http://localhost:3030/invitations/${invitationId}/${status}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update invitation');
            }

            Swal.fire({
                title: 'Succès',
                text: `Invitation ${status === 'accepted' ? 'acceptée' : 'refusée'}.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setInvitations(prevInvitations =>
                prevInvitations.map(invitation =>
                    invitation.id === invitationId ? { ...invitation, status } : invitation
                )
            );
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
            <h2>Invitations aux événements</h2>
            {invitations.length === 0 ? (
                <p>Aucune invitation pour le moment</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Événement</th>
                            <th>Statut</th>
                            <th>Date de début</th>
                            <th>Date de fin</th>
                            <th>Lieu</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitations.map(invitation => (
                            <tr key={invitation.id}>
                                <td>{invitation.event.title}</td>
                                <td>{invitation.status}</td>
                                <td>{new Date(invitation.event.startDate).toLocaleDateString()}</td>
                                <td>{new Date(invitation.event.endDate).toLocaleDateString()}</td>
                                <td>{invitation.event.lieu}</td>
                                <td>
                                    {invitation.status === 'pending' && (
                                        <>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="mr-2"
                                                onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                                            >
                                                Accepter
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                                            >
                                                Refuser
                                            </Button>
                                        </>
                                    )}
                                    {invitation.status === 'accepted' && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                                        >
                                            Refuser
                                        </Button>
                                    )}
                                    {invitation.status === 'declined' && (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                                        >
                                            Accepter
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <Button variant="primary" onClick={() => navigate('/admin/events/planning')} className="mb-3">
                Retour au planning
            </Button>
        </Container>
    );
};

export default AdminInvitationComponent;
