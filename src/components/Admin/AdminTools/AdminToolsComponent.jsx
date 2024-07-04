import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminToolsComponent.css';

const InfoLevelOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MODERATE', label: 'Moderate' },
    { value: 'HIGH', label: 'High' }
];

const InfoTypeOptions = [
    { value: 'COTISATION', label: 'Cotisation' },
    { value: 'USER_DELETE', label: 'User Delete' },
    { value: 'USER_INVITE', label: 'User Invite' },
    { value: 'USER_CREATE', label: 'User Create' },
    { value: 'USER_FIRST_CONNECTION', label: 'User First Connection' },
    { value: 'USER_CHANGE_PASSWORD', label: 'User Change Password' },
    { value: 'USER_ASK_CHANGE_PASSWORD', label: 'User Ask Change Password' },
    { value: 'COTISATION_PAYMENT', label: 'Cotisation Payment' },
    { value: 'CLUB_CREATE', label: 'Club Create' },
    { value: 'CLUB_DELETE', label: 'Club Delete' },
    { value: 'CLUB_UPDATE', label: 'Club Update' },
    { value: 'USER_DEACTIVATE', label: 'User Deactivate' },
    { value: 'USER_REACTIVATE', label: 'User Reactivate' },
    { value: 'CREATE_CARD', label: 'Create Card' }
];

const AdminToolsComponent = () => {
    const [infos, setInfos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [totalInfos, setTotalInfos] = useState(0);
    const [filters, setFilters] = useState({
        userId: '',
        level: '',
        type: '',
        dateFrom: '',
        dateTo: '',
        page: 1,
        limit: 5
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfos = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams(searchParams).toString();
                const response = await fetch(`http://localhost:4000/infos?${query}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch infos');
                }
                const data = await response.json();
                setInfos(data.infos);
                setTotalInfos(data.total);

                setFilters({
                    userId: searchParams.get('userId') || '',
                    level: searchParams.get('level') || '',
                    type: searchParams.get('type') || '',
                    dateFrom: searchParams.get('dateFrom') || '',
                    dateTo: searchParams.get('dateTo') || '',
                    page: parseInt(searchParams.get('page')) || 1,
                    limit: parseInt(searchParams.get('limit')) || 5
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInfos();
    }, [searchParams]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data.user.map(user => ({
                    value: user.id,
                    label: `${user.firstname} ${user.lastname} (${user.email})`
                })));
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUsers();
    }, []);

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
            userId: '',
            level: '',
            type: '',
            dateFrom: '',
            dateTo: '',
            page: 1,
            limit: 5
        });
        setSearchParams({});
    };

    const handleManageCotisations = async () => {
        try {
            const response = await fetch('http://localhost:4000/cotisations/manage', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to manage cotisations');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Vérification des cotisations effectuée avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleGenerateCards = async () => {
        try {
            const response = await fetch('http://localhost:4000/cotisations/generate-card', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate cards');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Génération des cartes d\'adhérent effectuée avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleReindexDatabase = async () => {
        try {
            const response = await fetch('http://localhost:4000/admin/tools/reindex-database', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reindex database');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Réindexation de la base de données effectuée avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={12}>
                    <h2>Outils d'administration</h2>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Informations</Card.Title>
                            <Form onSubmit={handleFilterSubmit}>
                                <Row>
                                    <Col md={3}>
                                        <Form.Group controlId="userId">
                                            <Form.Label>User</Form.Label>
                                            <Select
                                                options={users}
                                                value={users.find(option => option.value === filters.userId)}
                                                onChange={(selectedOption) => handleFilterChange('userId', selectedOption ? selectedOption.value : '')}
                                                isClearable
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="level">
                                            <Form.Label>Niveau</Form.Label>
                                            <Select
                                                options={InfoLevelOptions}
                                                value={InfoLevelOptions.find(option => option.value === filters.level)}
                                                onChange={(selectedOption) => handleFilterChange('level', selectedOption ? selectedOption.value : '')}
                                                isClearable
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="type">
                                            <Form.Label>Type</Form.Label>
                                            <Select
                                                options={InfoTypeOptions}
                                                value={InfoTypeOptions.find(option => option.value === filters.type)}
                                                onChange={(selectedOption) => handleFilterChange('type', selectedOption ? selectedOption.value : '')}
                                                isClearable
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
                                        <th>Niveau</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Contenu</th>
                                        <th>Utilisateur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {infos.map(info => (
                                        <tr key={info.id}>
                                            <td>{info.id}</td>
                                            <td>{info.level}</td>
                                            <td>{info.type}</td>
                                            <td>{new Date(info.date).toLocaleString()}</td>
                                            <td>{info.text}</td>
                                            <td>{info.user ? `${info.user.firstname} ${info.user.lastname}` : 'N/A'}</td>
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
                                    disabled={filters.page * filters.limit >= totalInfos}
                                    onClick={() => handlePageChange(filters.page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <h3>Jobs manuels</h3>
                    <Card className="mb-4">
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Nom du job</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Vérification des cotisations</td>
                                        <td>
                                            <Button variant="primary" onClick={handleManageCotisations}>
                                                Lancer la vérification
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Génération des cartes d'adhérent</td>
                                        <td>
                                            <Button variant="primary" onClick={handleGenerateCards}>
                                                Générer les cartes
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Réindexation de la base de données</td>
                                        <td>
                                            <Button variant="primary" onClick={handleReindexDatabase}>
                                                Réindexer la base de données
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminToolsComponent;
