import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminListSportComponent() {
    const [sports, setSports] = useState([]);
    const navigate = useNavigate();

    const fetchSports = async () => {
        try {
            const response = await fetch('http://localhost:3030/sports');
            const data = await response.json();
            setSports(data.sports);
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de la récupération des sports.', 'error');
        }
    };

    const handleDelete = async (id) => {
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
                    const response = await fetch(`http://localhost:3030/sports/${id}`, {
                        method: 'DELETE',
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || 'Erreur lors de la suppression du sport');
                    }

                    fetchSports();
                    Swal.fire('Supprimé!', 'Le sport a été supprimé.', 'success');
                } catch (error) {
                    Swal.fire('Erreur', error.message || 'Erreur lors de la suppression du sport.', 'error');
                }
            }
        });
    };

    useEffect(() => {
        fetchSports();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Liste des Sports</h2>
            <Button variant="primary" className="mb-3" onClick={() => navigate('/admin/sports/create')}>Créer un Sport</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sports.map((sport) => (
                        <tr key={sport.id}>
                            <td>{sport.id}</td>
                            <td>{sport.name}</td>
                            <td>
                                <Button variant="info" as={Link} to={`/admin/sports/${sport.id}`}>Détails</Button>{' '}
                                <Button variant="warning" as={Link} to={`/admin/sports/${sport.id}/edit`}>Modifier</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(sport.id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminListSportComponent;