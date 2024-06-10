import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminHome() {
    const [stats, setStats] = useState({});
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);

    useEffect(() => {
        // Fetch statistics, recent users, and recent events
        fetchStats();
        fetchRecentUsers();
        fetchRecentEvents();
    }, []);

    const fetchStats = async () => {
        // Fetch stats from API
        const response = await fetch('http://localhost:4000/stats');
        const data = await response.json();
        setStats(data);
    };

    const fetchRecentUsers = async () => {
        // Fetch recent users from API
        const response = await fetch('http://localhost:4000/users/recents');
        const data = await response.json();
        setRecentUsers(data);
    };

    const fetchRecentEvents = async () => {
        // Fetch recent events from API
        const response = await fetch('http://localhost:4000/events/recents');
        const data = await response.json();
        setRecentEvents(data);
    };

    return (
        <Container fluid className="mt-5">
            <Row>
                <Col>
                    <h1>Dashboard Admin</h1>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Utilisateurs</Card.Title>
                            <Card.Text>{stats.totalUsers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Clubs</Card.Title>
                            <Card.Text>{stats.totalClubs}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Centres de Formation</Card.Title>
                            <Card.Text>{stats.totalFormationCenters}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Joueurs</Card.Title>
                            <Card.Text>{stats.totalPlayers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Dernières inscriptions</Card.Title>
                            <ListGroup>
                                {recentUsers.map(user => (
                                    <ListGroup.Item key={user.id}>
                                        {user.firstname} {user.lastname}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Derniers événements</Card.Title>
                            <ListGroup>
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
            <Row className="mt-4">
                <Col md={6}>
                    <Button variant="primary" as={Link} to="/admin/users/create">Ajouter un nouvel utilisateur</Button>
                </Col>
                <Col md={6}>
                    <Button variant="primary" as={Link} to="/admin/events/create">Organiser un nouvel événement</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminHome;