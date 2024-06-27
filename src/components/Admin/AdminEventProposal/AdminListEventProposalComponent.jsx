import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminListEventProposalComponent.css';

const AdminListEventProposalComponent = () => {
    const [eventProposals, setEventProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventProposals = async () => {
            try {
                const response = await fetch('http://localhost:4000/eventproposals', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch event proposals');
                }
                const data = await response.json();
                setEventProposals(data.eventProposals);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventProposals();
    }, []);

    const handleAcceptProposal = async (proposalId) => {
        try {
            const response = await fetch(`http://localhost:4000/events/create-from/proposal/${proposalId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to create event from proposal');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Événement créé à partir de la proposition.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Remove the accepted proposal from the list
            setEventProposals(eventProposals.filter(proposal => proposal.id !== proposalId));
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleRefuseProposal = async (proposalId) => {
        try {
            const response = await fetch(`http://localhost:4000/eventproposals/${proposalId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete event proposal');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Proposition d\'événement refusée et supprimée.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Remove the refused proposal from the list
            setEventProposals(eventProposals.filter(proposal => proposal.id !== proposalId));
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
            <h2>Propositions d'événements</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Date de début</th>
                        <th>Date de fin</th>
                        <th>Lieu</th>
                        <th>Créé par</th>
                        <th>Joueur</th>
                        <th>Club</th>
                        <th>Centre de formation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {eventProposals.map(proposal => (
                        <tr key={proposal.id}>
                            <td>{proposal.title}</td>
                            <td>{proposal.description}</td>
                            <td>{new Date(proposal.startDate).toLocaleString()}</td>
                            <td>{new Date(proposal.endDate).toLocaleString()}</td>
                            <td>{proposal.place}</td>
                            <td>{proposal.createdBy ? `${proposal.createdBy.firstname} ${proposal.createdBy.lastname}` : 'N/A'}</td>
                            <td>{proposal.player ? `${proposal.player.firstName} ${proposal.player.lastName}` : 'N/A'}</td>
                            <td>{proposal.club ? proposal.club.name : 'N/A'}</td>
                            <td>{proposal.formationCenter ? proposal.formationCenter.name : 'N/A'}</td>
                            <td>
                                <Button variant="success" size="sm" className="mr-2" onClick={() => handleAcceptProposal(proposal.id)}>
                                    Accepter
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleRefuseProposal(proposal.id)}>
                                    Refuser
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button variant="primary" onClick={() => navigate('/admin/events/planning')} className="mt-3">
                Retour au planning
            </Button>
        </Container>
    );
};

export default AdminListEventProposalComponent;
