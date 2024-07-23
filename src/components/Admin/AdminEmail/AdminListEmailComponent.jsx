import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Modal, Form, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import './AdminListEmailComponent.css';

const AdminListEmailComponent = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [totalEmails, setTotalEmails] = useState(0);
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        email: '',
        dateFrom: '',
        dateTo: '',
        page: 1,
        limit: 5
    });
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchEmails();
    }, [searchParams]);

    const fetchEmails = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(searchParams).toString();
            const response = await fetch(`http://localhost:3030/emails?${query}`);
            const data = await response.json();
            setEmails(data.emails);
            setTotalEmails(data.count);
        } catch (fetchError) {
            Swal.fire('Erreur', "Erreur lors de la récupération des emails.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        const filteredFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
        setSearchParams(filteredFilters);
    };

    const handleResetFilters = () => {
        setFilters({
            status: '',
            type: '',
            email: '',
            dateFrom: '',
            dateTo: '',
            page: 1,
            limit: 5
        });
        setSearchParams({});
    };

    const handleShowModal = (email) => {
        setSelectedEmail(email);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEmail(null);
    };

    const handlePageChange = (newPage) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            page: newPage
        }));
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            page: newPage
        });
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container className="mt-5">
            <h2>Liste des Emails</h2>
            <Form onSubmit={handleFilterSubmit}>
                <Row>
                    <Col md={3}>
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                type="text"
                                name="status"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="type"
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={filters.email}
                                onChange={(e) => handleFilterChange('email', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="dateFrom">
                            <Form.Label>Date From</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateFrom"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="dateTo">
                            <Form.Label>Date To</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateTo"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="d-flex align-items-end">
                        <Button type="submit" variant="primary" className="me-2">
                            Filtrer
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleResetFilters}>
                            Réinitialiser
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {emails.map((email) => (
                        <tr key={email.id}>
                            <td>{email.id}</td>
                            <td>{email.status}</td>
                            <td>{email.type}</td>
                            <td>{`${email.user.firstname} ${email.user.lastname}`}</td>
                            <td>{email.user.email}</td>
                            <td>{new Date(email.sentDate).toLocaleString()}</td>
                            <td>
                                <Button onClick={() => handleShowModal(email)}>👁️‍🗨️</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="pagination-controls">
                <Button
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                >
                    Previous
                </Button>
                <span>Page {filters.page}</span>
                <Button
                    disabled={filters.page * filters.limit >= totalEmails}
                    onClick={() => handlePageChange(filters.page + 1)}
                >
                    Next
                </Button>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Email Content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEmail && (
                        <div>
                            <p><strong>ID:</strong> {selectedEmail.id}</p>
                            <p><strong>Status:</strong> {selectedEmail.status}</p>
                            <p><strong>Type:</strong> {selectedEmail.type}</p>
                            <p><strong>Utilisateur:</strong> {`${selectedEmail.user.firstname} ${selectedEmail.user.lastname}`}</p>
                            <p><strong>Email:</strong> {selectedEmail.user.email}</p>
                            <p><strong>Date:</strong> {new Date(selectedEmail.sentDate).toLocaleString()}</p>
                            <p><strong>Contenu:</strong></p>
                            <pre>{selectedEmail.text}</pre>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminListEmailComponent;
