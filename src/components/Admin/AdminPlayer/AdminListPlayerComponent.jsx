import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminListPlayerComponent() {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const fetchPlayers = async () => {
        try {
            const response = await fetch('http://localhost:4000/players');
            const data = await response.json();
            setPlayers(data.players);
        } catch (error) {
            console.error('Erreur lors de la récupération des joueurs:', error);
            alert('Erreur lors de la récupération des joueurs.');
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:4000/players/${id}`, {
                method: 'DELETE',
            });
            fetchPlayers(); // Refresh the list after deletion
        } catch (error) {
            console.error('Erreur lors de la suppression du joueur:', error);
            alert('Erreur lors de la suppression du joueur.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Liste des Joueurs</h2>
            <Button variant="primary" className="mb-3" onClick={() => navigate('/admin/players/create')}>
                Créer un joueur
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Date de Naissance</th>
                        <th>Centre de Formation</th>
                        <th>Sport</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <tr key={player.id}>
                            <td>{player.lastName}</td>
                            <td>{player.firstName}</td>
                            <td>{new Date(player.birthDate).toLocaleDateString()}</td>
                            <td>{player.formationCenter.name}</td>
                            <td>{player.sport.name}</td>
                            <td>
                                <Button variant="info" onClick={() => navigate(`/admin/players/${player.id}`)}>Détails</Button>{' '}
                                <Button variant="warning" onClick={() => navigate(`/admin/players/${player.id}/edit`)}>Modifier</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(player.id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminListPlayerComponent;