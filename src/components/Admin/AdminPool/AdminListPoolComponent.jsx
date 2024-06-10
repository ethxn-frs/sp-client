import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function AdminListPoolComponent() {
    const [sondages, setSondages] = useState([]);
    const navigate = useNavigate();

    const fetchSondages = async () => {
        try {
            const response = await fetch('http://localhost:4000/sondages');
            const data = await response.json();
            setSondages(data.sondages);
        } catch (error) {
            console.error('Erreur lors de la récupération des sondages:', error);
            alert('Erreur lors de la récupération des sondages.');
        }
    };

    useEffect(() => {
        fetchSondages();
    }, []);

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:4000/sondages/${id}`, {
                method: 'DELETE',
            });
            fetchSondages(); // Refresh the list after deletion
        } catch (error) {
            console.error('Erreur lors de la suppression du sondage:', error);
            alert('Erreur lors de la suppression du sondage.');
        }
    };

    const handleEdit = (sondage) => {
        navigate(`/admin/pools/${sondage.id}/edit`);
    };

    const handleView = (sondage) => {
        navigate(`/admin/pools/${sondage.id}`);
    };

    return (
        <div className="container mt-5">
            <h2>Liste des Sondages</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Date de début</th>
                        <th>Date de fin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sondages.map((sondage) => (
                        <tr key={sondage.id}>
                            <td>{sondage.name}</td>
                            <td>{new Date(sondage.startDate).toLocaleString()}</td>
                            <td>{new Date(sondage.endDate).toLocaleString()}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleView(sondage)}>Voir</Button>{' '}
                                <Button variant="warning" onClick={() => handleEdit(sondage)}>Modifier</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(sondage.id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminListPoolComponent;
