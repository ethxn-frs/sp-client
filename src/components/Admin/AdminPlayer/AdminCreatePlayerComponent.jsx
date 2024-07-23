import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function AdminCreatePlayerComponent() {
    const [playerData, setPlayerData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        formationCenterId: '',
        sportId: '',
    });
    const [formationCenters, setFormationCenters] = useState([]);
    const [sports, setSports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormationCenters = async () => {
            try {
                const response = await fetch('http://localhost:3030/formations-centers');
                const data = await response.json();
                setFormationCenters(data.formationsCenters);
            } catch (error) {
                console.error('Erreur lors de la récupération des centres de formation:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: "Erreur lors de la récupération des centres de formation.",
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        };

        const fetchSports = async () => {
            try {
                const response = await fetch('http://localhost:3030/sports');
                const data = await response.json();
                setSports(data.sports);
            } catch (error) {
                console.error('Erreur lors de la récupération des sports:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: "Erreur lors de la récupération des sports.",
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchFormationCenters();
        fetchSports();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPlayerData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3030/players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playerData),
            });

            if (!response.ok) {
                throw new Error('Échec de la création du joueur');
            }

            Swal.fire({
                title: 'Succès',
                text: 'Joueur créé avec succès!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/admin/players');
            });
        } catch (error) {
            console.error('Erreur lors de la création du joueur:', error);
            Swal.fire({
                title: 'Erreur',
                text: 'Erreur lors de la création du joueur.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2>Créer un Joueur</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={playerData.firstName}
                                onChange={handleInputChange}
                                placeholder="Prénom"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formLastName" className="mt-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={playerData.lastName}
                                onChange={handleInputChange}
                                placeholder="Nom"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBirthDate" className="mt-3">
                            <Form.Label>Date de Naissance</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                value={playerData.birthDate}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={playerData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formFormationCenter" className="mt-3">
                            <Form.Label>Centre de Formation</Form.Label>
                            <Form.Control
                                as="select"
                                name="formationCenterId"
                                value={playerData.formationCenterId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Sélectionner un centre de formation</option>
                                {formationCenters.map((center) => (
                                    <option key={center.id} value={center.id}>
                                        {center.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formSport" className="mt-3">
                            <Form.Label>Sport</Form.Label>
                            <Form.Control
                                as="select"
                                name="sportId"
                                value={playerData.sportId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Sélectionner un sport</option>
                                {sports.map((sport) => (
                                    <option key={sport.id} value={sport.id}>
                                        {sport.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button type="submit" variant="success" className="mt-3" style={{ width: '100%' }}>
                            Créer le joueur
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminCreatePlayerComponent;
