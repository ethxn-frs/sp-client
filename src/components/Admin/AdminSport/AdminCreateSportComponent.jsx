import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function AdminCreateSportComponent() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3030/sports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de la création du sport');
            }

            Swal.fire('Succès', 'Sport créé avec succès!', 'success');
            navigate('/admin/sports');
        } catch (error) {
            Swal.fire('Erreur', error.message || 'Erreur lors de la création du sport.', 'error');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Créer un Sport</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formSportName">
                    <Form.Label>Nom du Sport</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Créer
                </Button>
            </Form>
        </div>
    );
}

export default AdminCreateSportComponent;