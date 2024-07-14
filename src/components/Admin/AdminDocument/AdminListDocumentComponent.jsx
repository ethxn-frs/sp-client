import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function AdminListDocumentComponent() {
    const [folders, setFolders] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, [currentFolder]);

    const fetchDocuments = async () => {
        try {
            const response = await fetch('http://localhost:3030/documents', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Échec de la récupération des documents: ${response.status} (${response.statusText})`);
            }

            const data = await response.json();
            setFolders(data.folders);
            setDocuments(data.documents);
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de la récupération des documents. Veuillez réessayer.', 'error');
        }
    };

    const handleDownload = async (documentId) => {
        try {
            const response = await fetch(`http://localhost:3030/documents/${documentId}/download`, {
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
            Swal.fire('Erreur', 'Erreur lors du téléchargement du document. Veuillez réessayer.', 'error');
        }
    };

    const handleDelete = async (documentId) => {
        try {
            const response = await fetch(`http://localhost:3030/documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Échec de la suppression du document: ${response.status} (${response.statusText})`);
            }

            fetchDocuments();
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de la suppression du document. Veuillez réessayer.', 'error');
        }
    };

    const handleFolderClick = (folderId) => {
        setCurrentFolder(folderId);
    };

    const handleBackClick = () => {
        setCurrentFolder(null);
    };

    const currentDocuments = documents.filter(doc => doc.folder && doc.folder.id === currentFolder);
    const currentFolders = folders.filter(folder => !currentFolder || folder.id === currentFolder);

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={10}>
                    <h2>Liste des Documents</h2>
                    {currentFolder && <Button variant="secondary" onClick={handleBackClick}>Retour</Button>}
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentFolders.map((folder) => (
                                <tr key={folder.id}>
                                    <td>{folder.id}</td>
                                    <td>{folder.name}</td>
                                    <td>Dossier</td>
                                    <td>
                                        <Button
                                            variant="info"
                                            onClick={() => handleFolderClick(folder.id)}
                                        >
                                            Ouvrir
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {currentDocuments.map((document) => (
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
                            {!currentFolder && documents.filter(doc => !doc.folder).map((document) => (
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
