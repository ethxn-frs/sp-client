import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminEditSondageComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [updatedSondage, setUpdatedSondage] = useState(null);
    const [newQuestion, setNewQuestion] = useState('');
    const [addingQuestion, setAddingQuestion] = useState(false);

    useEffect(() => {
        const fetchSondage = async () => {
            try {
                const response = await fetch(`http://localhost:3030/sondages/${id}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération du sondage');
                }
                const data = await response.json();
                setUpdatedSondage(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du sondage:', error);
                alert('Erreur lors de la récupération du sondage.');
            }
        };
        fetchSondage();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedSondage({ ...updatedSondage, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            await fetch(`http://localhost:3030/sondages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSondage),
            });
            alert('Sondage mis à jour avec succès.');
            navigate('/admin/pools'); // Change the view back to the list after saving changes
        } catch (error) {
            console.error('Erreur lors de la modification du sondage:', error);
            alert('Erreur lors de la modification du sondage.');
        }
    };

    const handleAddQuestion = async () => {
        try {
            const response = await fetch('http://localhost:3030/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: newQuestion,
                    sondageId: updatedSondage.id,
                }),
            });

            if (response.ok) {
                const question = await response.json();
                setUpdatedSondage({ ...updatedSondage, questions: [...updatedSondage.questions, question] });
                setNewQuestion('');
                setAddingQuestion(false);
            } else {
                throw new Error('Erreur lors de la création de la question');
            }
        } catch (error) {
            console.error('Erreur lors de la création de la question:', error);
            alert('Erreur lors de la création de la question.');
        }
    };

    if (!updatedSondage) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Modifier le Sondage</h2>
            <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Nom du sondage</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={updatedSondage.name}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="formStartDate">
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="startDate"
                        value={new Date(updatedSondage.startDate).toISOString().slice(0, -1)}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="formEndDate">
                    <Form.Label>Date de fin</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="endDate"
                        value={new Date(updatedSondage.endDate).toISOString().slice(0, -1)}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSaveChanges}>
                    Enregistrer
                </Button>
                <Button variant="secondary" className="ml-2" onClick={() => navigate('/admin/sondages')}>
                    Annuler
                </Button>
            </Form>

            <h3 className="mt-5">Questions</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Texte</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedSondage.questions.map((question) => (
                        <tr key={question.id}>
                            <td>{question.id}</td>
                            <td>{question.text}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {addingQuestion ? (
                <Form className="mt-3">
                    <Form.Group controlId="formNewQuestion">
                        <Form.Label>Nouvelle question</Form.Label>
                        <Form.Control
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="success" onClick={handleAddQuestion}>
                        Ajouter
                    </Button>
                </Form>
            ) : (
                <Button variant="outline-primary" className="mt-3" onClick={() => setAddingQuestion(true)}>
                    Ajouter une question
                </Button>
            )}
        </div>
    );
}

export default AdminEditSondageComponent;
