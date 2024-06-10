import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminCreateUserComponent() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        newsletter: false,
        birthDate: '',
        roleId: '',
        playerId: '',
        formationCenterId: '',
        clubId: '',
    });
    const [roles, setRoles] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [formationCenters, setFormationCenters] = useState([]);
    const [players, setPlayers] = useState([]);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (userData.roleId) {
            fetchEntitiesByRole(parseInt(userData.roleId));
        }
    }, [userData.roleId]);

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:4000/roles');
            const data = await response.json();
            setRoles(data.roles);
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles:', error);
            alert('Erreur lors de la récupération des rôles.');
        }
    };

    const fetchEntitiesByRole = async (roleId) => {
        setUserData((prevData) => ({
            ...prevData,
            formationCenterId: '',
            playerId: '',
            clubId: '',
        }));
        setClubs([]);
        setFormationCenters([]);
        setPlayers([]);
        try {
            if (roleId === 2) {
                const response = await fetch('http://localhost:4000/clubs');
                const data = await response.json();
                setClubs(data.clubs);
            } else if (roleId === 4) {
                const response = await fetch('http://localhost:4000/formations-centers');
                const data = await response.json();
                setFormationCenters(data.formationsCenters);
            } else if (roleId === 3) {
                const response = await fetch('http://localhost:4000/players');
                const data = await response.json();
                setPlayers(data.players);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des entités:', error);
            alert('Erreur lors de la récupération des entités.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('firstName', userData.firstName);
            formData.append('lastName', userData.lastName);
            formData.append('email', userData.email);
            formData.append('address', userData.address);
            formData.append('newsletter', userData.newsletter.toString());
            formData.append('birthDate', userData.birthDate);
            formData.append('roleId', userData.roleId);
            if (userData.clubId) formData.append('clubId', userData.clubId);
            if (userData.formationCenterId) formData.append('formationCenterId', userData.formationCenterId);
            if (userData.playerId) formData.append('playerId', userData.playerId);
            if (file) formData.append('image', file);

            const response = await fetch('http://localhost:4000/users/auth/signup', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la création de l\'utilisateur');
            }
            alert('Utilisateur créé avec succès!');
            navigate('/admin/users');
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            alert('Erreur lors de la création de l\'utilisateur.');
        }
    };

    const renderEntitySelect = () => {
        switch (parseInt(userData.roleId)) {
            case 2:
                return (
                    <Form.Group controlId="formClub" className="mt-3">
                        <Form.Label>Club</Form.Label>
                        <Form.Control
                            as="select"
                            name="clubId"
                            value={userData.clubId || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Sélectionner un club</option>
                            {clubs.map((club) => (
                                <option key={club.id} value={club.id}>
                                    {club.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                );
            case 4:
                return (
                    <Form.Group controlId="formFormationCenter" className="mt-3">
                        <Form.Label>Centre de Formation</Form.Label>
                        <Form.Control
                            as="select"
                            name="formationCenterId"
                            value={userData.formationCenterId || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Sélectionner un centre de formation</option>
                            {formationCenters.map((center) => (
                                <option key={center.id} value={center.id}>
                                    {center.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                );
            case 3:
                return (
                    <Form.Group controlId="formPlayer" className="mt-3">
                        <Form.Label>Joueur</Form.Label>
                        <Form.Control
                            as="select"
                            name="playerId"
                            value={userData.playerId || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Sélectionner un joueur</option>
                            {players.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.firstName} {player.lastName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                );
            default:
                return null;
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col>
                    <Card className=" p-3 mb-5 bg-white rounded">
                        <Card.Header className="text-center bg-primary text-white">
                            <Card.Title className="mb-0">Créer un Utilisateur</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Form.Group controlId="formFirstName">
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={userData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formLastName" className="mt-3">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail" className="mt-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddress" className="mt-3">
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={userData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBirthDate" className="mt-3">
                                    <Form.Label>Date de naissance</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="birthDate"
                                        value={userData.birthDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formRole" className="mt-3">
                                    <Form.Label>Rôle</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="roleId"
                                        value={userData.roleId || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Sélectionner un rôle</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={parseInt(role.id)}>
                                                {role.role}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                {renderEntitySelect()}
                                <Form.Group controlId="formNewsletter" className="mt-3">
                                    <Form.Check
                                        type="checkbox"
                                        name="newsletter"
                                        label="S'abonner à la newsletter"
                                        checked={userData.newsletter}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formFile" className="mt-3">
                                    <Form.Label>Photo de profil</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        onChange={handleFileChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-3">
                                    Créer
                                </Button>
                                <Button variant="secondary" className="mt-3 ms-3" onClick={() => navigate('/admin/users')}>
                                    Annuler
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminCreateUserComponent;

