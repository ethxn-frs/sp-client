import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminListPlayerProposalComponent.css';

const AdminListPlayerProposalComponent = () => {
    const [playerProposals, setPlayerProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayerProposals = async () => {
            try {
                const response = await fetch('http://localhost:4000/playerProposals', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch player proposals');
                }
                const data = await response.json();
                setPlayerProposals(data.playerProposals);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerProposals();
    }, []);

    const handleAcceptProposal = async (proposalId) => {
        try {
            const response = await fetch(`http://localhost:4000/playerProposals/${proposalId}/create`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to create player from proposal');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Joueur créé à partir de la proposition.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setPlayerProposals(playerProposals.filter(proposal => proposal.id !== proposalId));
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
            const response = await fetch(`http://localhost:4000/playerProposals/${proposalId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete player proposal');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Proposition de joueur refusée et supprimée.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setPlayerProposals(playerProposals.filter(proposal => proposal.id !== proposalId));
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
            <h2>Propositions de Joueurs</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Date de naissance</th>
                        <th>Email</th>
                        <th>Sport</th>
                        <th>Taille</th>
                        <th>Poids</th>
                        <th>Centre de formation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {playerProposals.map(proposal => (
                        <tr key={proposal.id}>
                            <td>{proposal.firstName}</td>
                            <td>{proposal.lastName}</td>
                            <td>{new Date(proposal.birthDate).toLocaleDateString()}</td>
                            <td>{proposal.email}</td>
                            <td>{proposal.sport.name}</td>
                            <td>{proposal.height ? `${proposal.height} cm` : 'N/A'}</td>
                            <td>{proposal.weight ? `${proposal.weight} kg` : 'N/A'}</td>
                            <td>{proposal.formationCenter.name}</td>
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
        </Container>
    );
};

export default AdminListPlayerProposalComponent;
