import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


function AdminListMessageComponent() {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    
    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:3030/contacts');
            const data = await response.json();
            setMessages(data.contacts);
        } catch (error) {
            Swal.fire('Erreur', error.message || 'Erreur lors de la récupération des messages.', 'error');
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3030/contacts/${id}`, {
                method: 'DELETE',
            });
            fetchMessages();
        } catch (error) {
            Swal.fire('Erreur', error.message || 'Erreur lors de la suprresion du message.', 'error');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Liste des Messages</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nom Prénom</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Sujet</th>
                        <th>Date d'envoie</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((message) => (
                        <tr key={message.id}>
                            <td>{message.name}</td>
                            <td>{message.email}</td>
                            <td>{message?.role}</td>
                            <td>{message.subject}</td>
                            <td>{new Date(message.sentAt).toLocaleDateString()}</td>
                            <td>
                                <Button variant="info" onClick={() => navigate(`/admin/messages/${message.id}`)}>Détails</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(message.id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminListMessageComponent;