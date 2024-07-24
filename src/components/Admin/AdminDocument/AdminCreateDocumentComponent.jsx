import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminCreateDocument() {
    const { register: registerFolder, handleSubmit: handleSubmitFolder, reset: resetFolder } = useForm();
    const { register: registerDocument, handleSubmit: handleSubmitDocument, reset: resetDocument, watch } = useForm();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchFolders();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3030/users');
            const data = await response.json();
            setUsers(data.user);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            Swal.fire('Erreur', 'Erreur lors de la récupération des utilisateurs.', 'error');
        }
    };

    const fetchFolders = async () => {
        try {
            const response = await fetch('http://localhost:3030/folders');
            const data = await response.json();
            setFolders(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des dossiers:', error);
            Swal.fire('Erreur', 'Erreur lors de la récupération des dossiers.', 'error');
        }
    };

    const onCreateFolderSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:3030/create-folder/${data.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.foldername,
                }),
            });

            if (response.ok) {
                Swal.fire('Succès', 'Dossier créé avec succès', 'success');
                resetFolder();
                fetchFolders();
            } else {
                Swal.fire('Erreur', 'Échec de la création du dossier', 'error');
            }
        } catch (error) {
            console.error('Erreur lors de la création du dossier:', error);
            Swal.fire('Erreur', 'Erreur lors de la création du dossier', 'error');
        }
    };

    const onUploadDocumentSubmit = async (data) => {
        const selectedFolder = folders.find(folder => folder.id === parseInt(data.folderId));

        if (!selectedFolder) {
            Swal.fire('Erreur', 'Dossier sélectionné introuvable', 'error');
            return;
        }

        const onSubmit = async (data) => {
            const formData = new FormData();
            formData.append('file', data.file[0]);

            try {
                const response = await fetch(`http://localhost:3030/folders/${selectedFolder.googleId}/upload/${selectedFolder.user.id}/files`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    Swal.fire('Succès', 'Document téléchargé avec succès', 'success');
                    resetDocument();
                    navigate('/admin/documents');
                } else {
                    Swal.fire('Erreur', 'Échec du téléchargement du document', 'error');
                }
            } catch (error) {
                console.error('Erreur lors du téléchargement du document:', error);
                Swal.fire('Erreur', 'Erreur lors du téléchargement du document', 'error');
            }
        };

        return (
            <Container fluid className="mt-5">
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Créer un dossier</Card.Title>
                                <Form onSubmit={handleSubmitFolder(onCreateFolderSubmit)}>
                                    <Form.Group controlId="formFolderName">
                                        <Form.Label>Nom du dossier</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...registerFolder('foldername', { required: true })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formUserId" className="mt-3">
                                        <Form.Label>Utilisateur</Form.Label>
                                        <Form.Control
                                            as="select"
                                            {...registerFolder('userId', { required: true })}
                                        >
                                            <option value="">Sélectionner un utilisateur</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.firstname} {user.lastname}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-3">
                                        Créer le dossier
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Insérer un document</Card.Title>
                                <Form onSubmit={handleSubmitDocument(onUploadDocumentSubmit)}>
                                    <Form.Group controlId="formFile">
                                        <Form.Label>Sélectionner votre document</Form.Label>
                                        <Form.Control
                                            type="file"
                                            {...registerDocument('file', { required: true })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formFolderId" className="mt-3">
                                        <Form.Label>Dossier</Form.Label>
                                        <Form.Control
                                            as="select"
                                            {...registerDocument('folderId', { required: true })}
                                        >
                                            <option value="">Sélectionner un dossier</option>
                                            {folders.map(folder => (
                                                <option key={folder.id} value={folder.id}>
                                                    {folder.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="formUserId" className="mt-3">
                                        <Form.Label>Utilisateur</Form.Label>
                                        <Form.Control
                                            as="select"
                                            {...registerDocument('userId', { required: true })}
                                        >
                                            <option value="">Sélectionner un utilisateur</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.firstname} {user.lastname}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-3">
                                        Upload
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

}
export default AdminCreateDocument;
