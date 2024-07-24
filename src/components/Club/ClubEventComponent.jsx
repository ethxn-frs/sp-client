import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Button, Container, Table, Spinner } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';
import ClubProposeMeetingModal from './ClubProposeMeetingModal';
import EventModalDetails from '../Admin/AdminEvent/EventModalDetailsComponent';

const localizer = momentLocalizer(moment);

const ClubEventComponent = () => {
    const [events, setEvents] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [slotInfo, setSlotInfo] = useState({ start: null, end: null });
    const [modalContent, setModalContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailsModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showProposeMeetingModal, setShowProposeMeetingModal] = useState(false);
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [clubId, setClubId] = useState(null);

    const userStorage = JSON.parse(localStorage.getItem('user'));
    const userId = userStorage.id;

    const fetchClub = async () => {
        try {
            const response = await fetch(`http://localhost:3030/users/${userId}/club`, {
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
            setErrorMessage('Error fetching events. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const fetchEvents = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(`http://localhost:3030/events/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Error fetching events: ${response.status} (${response.statusText})`);
            }

            const event = await response.json();
            const transformedEvents = event.events.map(ev => ({
                id: ev.id,
                title: ev.title,
                start: new Date(ev.startDate),
                end: new Date(ev.endDate),
                description: ev.description,
                lieu: ev.lieu,
                type: ev.type,
                clubs: ev.clubs,
                trainingCenters: ev.trainingCenters,
            }));
            setEvents(transformedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            setErrorMessage('Error fetching events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchInvitations = async () => {
        try {
            const response = await fetch(`http://localhost:3030/users/${userId}/event-invitations`);
            if (!response.ok) {
                throw new Error(`Error fetching invitations: ${response.status} (${response.statusText})`);
            }
            const data = await response.json();
            setInvitations(data);
        } catch (error) {
            console.error('Error fetching invitations:', error);
        }
    };

    const fetchPlayers = async () => {
        try {
            const response = await fetch('http://localhost:3030/players');
            const data = await response.json();
            setPlayers(data.players);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    useEffect(() => {
        fetchClub();
        fetchEvents();
        fetchInvitations();
        fetchPlayers();
    }, []);

    const handleSelectSlot = useCallback(({ start, end }) => {
        setSlotInfo({ start, end });
        setShowModal(true);
    }, []);

    const handleSelectEvent = useCallback((event) => {
        setModalContent(event);
        setShowDetailsModal(true);
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setShowDetailsModal(false);
        setSlotInfo({ start: null, end: null });
    };

    const handleInvitationResponse = async (invitationId, status) => {
        try {
            const response = await fetch(`http://localhost:3030/invitations/${invitationId}/${status}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update invitation');
            }

            Swal.fire({
                title: 'Succès',
                text: `Invitation ${status === 'accepted' ? 'acceptée' : 'refusée'}.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setInvitations(prevInvitations =>
                prevInvitations.map(invitation =>
                    invitation.id === invitationId ? { ...invitation, status } : invitation
                )
            );
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleProposeMeeting = () => {
        setShowProposeMeetingModal(true);
    };

    const { defaultDate, scrollToTime } = useMemo(() => ({
        defaultDate: new Date(),
        scrollToTime: new Date(1970, 1, 1, 6),
    }), []);

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container className="mt-5">
            <h2>Événements</h2>
            <Button variant="primary" onClick={handleProposeMeeting} className="mb-3">
                Proposer un événement
            </Button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <Fragment>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: '50px' }}
                    onSelectEvent={handleSelectEvent}
                    selectable
                    scrollToTime={scrollToTime}
                />
            </Fragment>
            <h3>Invitations</h3>
            {invitations.length === 0 ? (
                <p>Aucune invitation pour le moment</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Événement</th>
                            <th>Statut</th>
                            <th>Date de début</th>
                            <th>Date de fin</th>
                            <th>Lieu</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitations.map(invitation => (
                            <tr key={invitation.id}>
                                <td>{invitation.event.title}</td>
                                <td>{invitation.status}</td>
                                <td>{new Date(invitation.event.startDate).toLocaleDateString()}</td>
                                <td>{new Date(invitation.event.endDate).toLocaleDateString()}</td>
                                <td>{invitation.event.lieu}</td>
                                <td>
                                    {invitation.status === 'pending' && (
                                        <>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="mr-2"
                                                onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                                            >
                                                Accepter
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                                            >
                                                Refuser
                                            </Button>
                                        </>
                                    )}
                                    {invitation.status === 'accepted' && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                                        >
                                            Refuser
                                        </Button>
                                    )}
                                    {invitation.status === 'declined' && (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                                        >
                                            Accepter
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            {showProposeMeetingModal && (
                <ClubProposeMeetingModal
                    show={showProposeMeetingModal}
                    handleClose={() => setShowProposeMeetingModal(false)}
                    players={players}
                    clubId={clubId}
                    createdById={userId}
                />
            )}
            {modalContent && (
                <EventModalDetails
                    isOpen={showDetailModal}
                    event={modalContent}
                    onRequestClose={handleCloseModal}
                />
            )}
        </Container>
    );
};

export default ClubEventComponent;
