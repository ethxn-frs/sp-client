import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminCreateDocument() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('file', data.file[0]);

        try {
            const response = await fetch('http://localhost:4000/documents', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Document uploaded successfully');
                reset();
                navigate('/admin/documents');
            } else {
                alert('Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Error uploading document');
        }
    };

    return (
        <Container fluid className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Insérer un document</Card.Title>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group controlId="formFile">
                                    <Form.Label>Sélectionner votre document </Form.Label>
                                    <Form.Control
                                        type="file"
                                        {...register('file', { required: true })}
                                    />
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

export default AdminCreateDocument;