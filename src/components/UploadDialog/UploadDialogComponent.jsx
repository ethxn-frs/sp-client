import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const UploadDialogComponent = ({ open, handleClose, entityType, id, index }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg')) {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a PNG or JPEG file.');
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        let url = '';
        switch (entityType) {
            case 'user':
                url = `http://localhost:3030/images/user/${id}`;
                break;
            case 'club':
                url = `http://localhost:3030/images/club/${id}`;
                break;
            case 'formation-center':
                url = `http://localhost:3030/images/formation-center/${id}`;
                break;
            case 'player':
                url = `http://localhost:3030/images/player/${id}/${index}`;
                break;
            default:
                break;
        }
        try {
            const result = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!result.ok) {
                throw new Error('Failed to upload image');
            }

            Swal.fire('Succès!', 'La photo a bien été chargée.', 'success');
            handleClose();
        } catch (error) {
            Swal.fire('Erreur!', error.message, 'error');
        }
    }

    return (
        <Modal show={open} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Charger une Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formFile">
                        <Form.Label>Sélectionnez un fichier au format PNG ou JPEG.</Form.Label>
                        <Form.Control type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    </Form.Group>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Charger
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UploadDialogComponent;