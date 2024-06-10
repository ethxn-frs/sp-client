import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminListFormationCenterComponent() {
    const [formationCenters, setFormationCenters] = useState([]);
    const navigate = useNavigate();

    const fetchFormationCenters = async () => {
        try {
            const response = await fetch('http://localhost:4000/formations-centers');
            if (!response.ok) {
                throw new Error(`Échec de la récupération des centres de formation: ${response.status} (${response.statusText})`);
            }
            const data = await response.json();
            setFormationCenters(data.formationsCenters);
        } catch (error) {
            console.error('Erreur lors de la récupération des centres de formation:', error);
            alert("Erreur lors de la récupération des centres de formation. Veuillez réessayer.");
        }
    };

    useEffect(() => {
        fetchFormationCenters();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce centre de formation ?")) {
            try {
                const response = await fetch(`http://localhost:4000/formations-centers/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Échec de la suppression du centre de formation');
                }

                setFormationCenters(formationCenters.filter(center => center.Id !== id));
                alert('Centre de formation supprimé avec succès.');
                fetchFormationCenters()
            } catch (error) {
                console.error('Erreur lors de la suppression du centre de formation:', error);
                alert("Erreur lors de la suppression du centre de formation. Veuillez réessayer.");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/formations-centers/${id}/edit`);
    };

    const handleView = (id) => {
        navigate(`/admin/formations-centers/${id}`);
    };

    const handleCreate = () => {
        navigate('/admin/formations-centers/create');
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Liste des Centres de Formation</h2>
                <Button variant="success" onClick={handleCreate}>Créer un Centre de Formation</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Adresse</th>
                        <th>Email</th>
                        <th>Date de création</th>
                        <th>Sports</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {formationCenters.map(center => (
                        <tr key={center.id}>
                            <td>{center.name}</td>
                            <td>{center.address}</td>
                            <td>{center.email}</td>
                            <td>{new Date(center.createDate).toLocaleDateString()}</td>
                            <td>{center.sports.map(sport => sport.name).join(", ")}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => handleView(center.id)}>Voir</Button>{' '}
                                <Button variant="warning" size="sm" onClick={() => handleEdit(center.id)}>Modifier</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(center.id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminListFormationCenterComponent;