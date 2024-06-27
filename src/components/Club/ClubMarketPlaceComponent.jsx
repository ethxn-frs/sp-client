import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClubMarketPlaceComponent.css';
import ClubProposeMeetingModal from './ClubProposeMeetingModal';

const ClubMarketPlaceComponent = () => {
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState('');
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [clubId, setClubId] = useState(null);

    const userStorage = JSON.parse(localStorage.getItem('user'));
    const createdById = userStorage.id;

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const response = await fetch(`http://localhost:4000/users/${userStorage.id}/club`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
    
                if (!response.ok) {
                    throw new Error(`Error fetching events: ${response.status} (${response.statusText})`);
                }
    
                const clubResponse = await response.json();
                setClubId(clubResponse.id)
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        }

        const fetchSports = async () => {
            try {
                const response = await fetch('http://localhost:4000/sports');
                const data = await response.json();
                setSports(data.sports);
            } catch (error) {
                console.error('Error fetching sports:', error);
            }
        };

        const fetchPlayers = async () => {
            try {
                const response = await fetch('http://localhost:4000/players');
                const data = await response.json();
                setPlayers(data.players);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching players:', error);
                setLoading(false);
            }
        };

        fetchClub();
        fetchSports();
        fetchPlayers();
    }, []);

    const handleSportChange = (e) => {
        setSelectedSport(e.target.value);
    };

    const handleProposeMeeting = (player) => {
        setSelectedPlayer(player);
        setShowModal(true);
    };

    const filteredPlayers = selectedSport
        ? players.filter(player => player.sport.name === selectedSport)
        : players;

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center">MarketPlace</h2>
            <Form.Group controlId="sportFilter" className="mb-4">
                <Form.Label>Filtrer par sport</Form.Label>
                <Form.Control as="select" value={selectedSport} onChange={handleSportChange}>
                    <option value="">Tous les sports</option>
                    {sports.map(sport => (
                        <option key={sport.id} value={sport.name}>{sport.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Row>
                {filteredPlayers.map(player => (
                    <Col md={4} key={player.id} className="mb-4">
                        <Card className="player-card shadow-sm">
                            <Card.Img variant="top" src={`https://via.placeholder.com/150`} />
                            <Card.Body>
                                <Card.Title>{player.firstName} {player.lastName}</Card.Title>
                                <Card.Text>
                                    <strong>Sport:</strong> {player.sport.name} <br />
                                    <strong>Centre de formation:</strong> {player.formationCenter.name} <br />
                                    <strong>Taille:</strong> {player.height ? `${player.height} cm` : 'N/A'} <br />
                                    <strong>Poids:</strong> {player.weight ? `${player.weight} kg` : 'N/A'} <br />
                                    <strong>Date de naissance:</strong> {new Date(player.birthDate).toLocaleDateString()} <br />
                                </Card.Text>
                                {player.stats && (
                                    <Card.Text>
                                        <strong>Statistiques:</strong> <br />
                                        DEF: {player.stats.DEF}, DRI: {player.stats.DRI}, PAC: {player.stats.PAC}, <br />
                                        PAS: {player.stats.PAS}, PHY: {player.stats.PHY}, SHO: {player.stats.SHO}
                                    </Card.Text>
                                )}
                                <Button variant="primary" className="mb-2" block>Télécharger la fiche</Button>
                                <Button variant="secondary" block onClick={() => handleProposeMeeting(player)}>Proposer un rendez-vous</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {showModal && (
                <ClubProposeMeetingModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    players={players}
                    selectedPlayer={selectedPlayer}
                    clubId={clubId}
                    createdById={createdById}
                />
            )}
        </Container>
    );
};

export default ClubMarketPlaceComponent;