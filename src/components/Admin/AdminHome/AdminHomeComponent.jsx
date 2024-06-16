import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AdminHome.css';
import UserInfoAlertComponent from '../AdminUser/AdminUserInfoAlertComponent';

function AdminHome() {
    const [stats, setStats] = useState({});
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        fetchStats();
        fetchRecentUsers();
        fetchRecentEvents();
    }, []);

    const fetchStats = async () => {
        const response = await fetch('http://localhost:4000/stats');
        const data = await response.json();
        setStats(data);
    };

    const fetchRecentUsers = async () => {
        const response = await fetch('http://localhost:4000/users/recents');
        const data = await response.json();
        setRecentUsers(data);
    };

    const fetchRecentEvents = async () => {
        const response = await fetch('http://localhost:4000/events/recents');
        const data = await response.json();
        setRecentEvents(data);
    };

    return (
        <Container fluid className="mt-5 d-flex flex-column align-items-center justify-content-center   ">
            <UserInfoAlertComponent user={user} /> 
            <Row className="mb-4 w-100">
                <Col>
                    <h1 className="text-center">Dashboard Admin</h1>
                </Col>
            </Row>
            <Row className="mb-4 w-100 justify-content-center">
                <Col md={6} className="mb-3">
                    <Card className="admin-card">
                        <Card.Body>
                            <Card.Title>Statistiques</Card.Title>
                            <Table striped bordered hover size="sm">
                                <tbody>
                                    <tr>
                                        <td><strong>Utilisateurs</strong></td>
                                        <td>{stats.totalUsers}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Clubs</strong></td>
                                        <td>{stats.totalClubs}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Centres de Formation</strong></td>
                                        <td>{stats.totalFormationCenters}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Joueurs</strong></td>
                                        <td>{stats.totalPlayers}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4 w-100 justify-content-center">
                <Col md={6} className="mb-3">
                    <Card className="admin-card">
                        <Card.Body>
                            <Card.Title>Dernières inscriptions</Card.Title>
                            <ListGroup variant="flush">
                                {recentUsers.map(user => (
                                    <ListGroup.Item key={user.id}>
                                        {user.firstname} {user.lastname}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="admin-card">
                        <Card.Body>
                            <Card.Title>Derniers événements</Card.Title>
                            <ListGroup variant="flush">
                                {recentEvents.map(event => (
                                    <ListGroup.Item key={event.id}>
                                        {event.title}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4 w-100 justify-content-center">
                <Col md={6} className="mb-3">
                    <Card className="admin-card">
                        <Card.Body>
                            <Card.Title>Actions</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Link to="/admin/planning/create">Voir les événements</Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/admin/users">Voir les utilisateurs</Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/admin/users/create">Ajouter un nouvel utilisateur</Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/admin/clubs">Voir les clubs</Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/admin/clubs/create">Ajouter un nouveau club</Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/admin/formations-centers">Voir les centres de formations</Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/admin/formations-centers/create">Créer un centre de formation</Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/admin/users">Voir les joueurs</Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to="/admin/users/create">Ajouter un nouveau joueur</Link>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminHome;
