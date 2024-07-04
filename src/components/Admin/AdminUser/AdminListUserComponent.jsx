import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminListUserComponent() {
    const [data, setData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [filters, setFilters] = useState({
        deleted: false,
        firstName: '',
        lastName: '',
        email: '',
        roleId: null,
        page: 1,
        limit: 5
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [searchParams]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(searchParams).toString();
            const response = await fetch(`http://localhost:4000/users?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Échec de la récupération des utilisateurs: ${response.status} (${response.statusText})`);
            }

            const data = await response.json();
            setData(data.user);
            setTotalUsers(data.total);
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles:', error);
            Swal.fire('Erreur', "Erreur lors de la récupération des utilisateurs. Veuillez réessayer.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:4000/roles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Échec de la récupération des rôles: ${response.status} (${response.statusText})`);
            }

            const rolesData = await response.json();
            setRoles(rolesData.roles)
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles:', error);
            Swal.fire('Erreur', "Erreur lors de la récupération des rôles. Veuillez réessayer.", 'error');
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
            Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
        );
        setSearchParams(filteredFilters);
    };

    const handleResetFilters = () => {
        setFilters({
            deleted: false,
            firstName: '',
            lastName: '',
            email: '',
            roleId: null,
            page: 1,
            limit: 5
        });
        setSearchParams({});
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous ne pourrez pas revenir en arrière!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:4000/users/${id}/delete`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || 'Erreur lors de la suppression de l\'utilisateur');
                    }

                    setData(data.filter(item => item.id !== id));
                    Swal.fire('Supprimé!', 'Utilisateur supprimé avec succès!', 'success');
                } catch (error) {
                    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
                    Swal.fire('Erreur', error.message || "Erreur lors de la suppression de l'utilisateur. Veuillez réessayer.", 'error');
                }
            }
        });
    };

    const handleDetail = (id) => {
        navigate(`/admin/users/${id}`);
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
            <h2>Liste des Utilisateurs</h2>
            <Form onSubmit={handleFilterSubmit}>
                <Row>
                    <Col md={3}>
                        <Form.Group controlId="deleted">
                            <Form.Check
                                type="checkbox"
                                label="Actifs"
                                checked={!filters.deleted}
                                onChange={(e) => handleFilterChange('deleted', !e.target.checked)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="firstName">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={filters.firstName}
                                onChange={(e) => handleFilterChange('firstName', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="lastName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={filters.lastName}
                                onChange={(e) => handleFilterChange('lastName', e.target.value)}
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
                        <Form.Group controlId="roleId">
                            <Form.Label>Rôle</Form.Label>
                            <Select
                                options={roles}
                                value={roles.find(role => role.value === filters.roleId)}
                                onChange={(selectedOption) => handleFilterChange('roleId', selectedOption ? selectedOption.role : null)}
                                isClearable
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
                        <th>ACTIF</th>
                        <th>NOM</th>
                        <th>PRENOMS</th>
                        <th>EMAIL</th>
                        <th>DATE DE NAISSANCE</th>
                        <th>DATE ANCIENNETE</th>
                        <th>ROLE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.deleted ? '❌' : '✅'}</td>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                            <td>{new Date(item.birthDate).toLocaleDateString()}</td>
                            <td>{new Date(item.createDate).toLocaleDateString()}</td>
                            <td>{item.role.role}</td>
                            <td>
                                <Button variant="info" onClick={() => handleDetail(item.id)}>Voir</Button>
                                <Button variant="danger" onClick={() => handleDelete(item.id)}>Supprimer</Button>
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
                    disabled={filters.page * filters.limit >= totalUsers}
                    onClick={() => handlePageChange(filters.page + 1)}
                >
                    Next
                </Button>
            </div>
        </Container>
    );
}

export default AdminListUserComponent;
