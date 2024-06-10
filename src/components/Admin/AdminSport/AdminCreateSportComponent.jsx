import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function AdminCreateSportComponent() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/sports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du sport');
            }

            alert('Sport créé avec succès!');
            navigate('/admin/sports');
        } catch (error) {
            console.error('Erreur lors de la création du sport:', error);
            alert('Erreur lors de la création du sport.');
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