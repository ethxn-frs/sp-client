import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const DocumentsModal = ({ show, handleClose, userId }) => {
    const [documents, setDocuments] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (show) {
            fetchDocumentsAndFolders();
        }
    }, [show]);

    const fetchDocumentsAndFolders = async () => {
        try {
            const response = await fetch(`http://localhost:3030/files/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setDocuments(data.documents);
            setFolders(data.folders);
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: 'Erreur lors de la récupération des documents et dossiers.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (documentId) => {
        try {
            const response = await fetch(`http://localhost:3030/documents/${documentId}/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors du téléchargement du document.');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `document_${documentId}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Clean up
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Documents et Dossiers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    <>
                        <h5>Dossiers</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>Date de création</th>
                                </tr>
                            </thead>
                            <tbody>
                                {folders.map(folder => (
                                    <tr key={folder.id}>
                                        <td>{folder.id}</td>
                                        <td>{folder.name}</td>
                                        <td>{new Date(folder.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <h5>Documents</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>Type</th>
                                    <th>Télécharger</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map(document => (
                                    <tr key={document.id}>
                                        <td>{document.id}</td>
                                        <td>{document.name}</td>
                                        <td>{document.type}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleDownload(document.id)}>
                                                Télécharger
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DocumentsModal;
