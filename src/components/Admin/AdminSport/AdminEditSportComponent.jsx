import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function AdminEditSportComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sport, setSport] = useState({ Name: '' });

    useEffect(() => {
        const fetchSport = async () => {
            try {
                const response = await fetch(`http://localhost:4000/sports/${id}`);
                const data = await response.json();
                setSport(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du sport:', error);
                alert('Erreur lors de la récupération du sport.');
            }
        };
        fetchSport();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSport({ ...sport, [name]: value });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:4000/sports/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sport),
            });
            alert('Sport mis à jour avec succès.');
            navigate('/admin/sports');
        } catch (error) {
            console.error('Erreur lors de la modification du sport:', error);
            alert('Erreur lors de la modification du sport.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Modifier le Sport</h2>
            <Form onSubmit={handleSaveChanges}>
                <Form.Group controlId="formSportName">
                    <Form.Label>Nom du Sport</Form.Label>
                    <Form.Control
                        type="text"
                        name="Name"
                        value={sport.Name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Enregistrer
                </Button>
                <Button variant="secondary" className="ml-2" onClick={() => navigate('/admin/sports')}>
                    Annuler
                </Button>
            </Form>
        </div>
    );
}

export default AdminEditSportComponent;
