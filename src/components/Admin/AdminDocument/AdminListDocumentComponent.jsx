import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminListDocumentComponent() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch('http://localhost:4000/documents', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Échec de la récupération des documents: ${response.status} (${response.statusText})`);
            }

            const data = await response.json();
            setDocuments(data.documents);
        } catch (error) {
            console.error('Erreur lors de la récupération des documents:', error);
            alert("Erreur lors de la récupération des documents. Veuillez réessayer.");
        }
    };

    const handleDownload = async (documentId) => {
        try {
            const response = await fetch(`http://localhost:4000/documents/${documentId}/download`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Échec du téléchargement du document: ${response.status} (${response.statusText})`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${documentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Erreur lors du téléchargement du document:', error);
            alert("Erreur lors du téléchargement du document. Veuillez réessayer.");
        }
    };

    const handleDelete = async (documentId) => {
        try {
            const response = await fetch(`http://localhost:4000/documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Échec de la suppression du document: ${response.status} (${response.statusText})`);
            }

            fetchDocuments(); // Refresh the list after deletion
        } catch (error) {
            console.error('Erreur lors de la suppression du document:', error);
            alert("Erreur lors de la suppression du document. Veuillez réessayer.");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={10}>
                    <h2>Liste des Documents</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((document) => (
                                <tr key={document.id}>
                                    <td>{document.id}</td>
                                    <td>{document.name}</td>
                                    <td>{document.type}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => handleDownload(document.id)}
                                        >
                                            Télécharger
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(document.id)}
                                        >
                                            Supprimer
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminListDocumentComponent;
